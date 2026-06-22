import crypto from 'crypto';
import bcrypt from 'bcryptjs';

const SECRET = process.env.SESSION_SECRET;

if (!SECRET) {
  console.error('⚠️ SESSION_SECRET environment variable is not set!');
}

// ============================================================
// PASSWORD HASHING
// ============================================================
export async function hashPassword(plainPassword) {
  return bcrypt.hash(plainPassword, 10);
}

export async function comparePassword(plainPassword, hash) {
  if (!plainPassword || !hash) return false;
  return bcrypt.compare(plainPassword, hash);
}

// ============================================================
// SESSION TOKEN
// ============================================================
export function createSessionToken(user) {
  const payload = JSON.stringify({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    exp: Date.now() + 1000 * 60 * 60 * 24, // 24 ghonta
  });
  const payloadB64 = Buffer.from(payload).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SECRET)
    .update(payloadB64)
    .digest('base64url');
  return `${payloadB64}.${signature}`;
}

// ============================================================
// VERIFY TOKEN
// BUG FIX: age "return payload.role === 'admin'" chilo - 'super_admin'
// role-er jonno false return korto, tai /api/auth/me 401 dichilo.
// Ekhon full payload object return kora hocche.
// ============================================================
export function verifySessionToken(token) {
  if (!token || !SECRET) return null;

  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [payloadB64, signature] = parts;

  const expectedSig = crypto
    .createHmac('sha256', SECRET)
    .update(payloadB64)
    .digest('base64url');

  const sigBuf = Buffer.from(signature);
  const expectedBuf = Buffer.from(expectedSig);

  if (sigBuf.length !== expectedBuf.length) return null;
  if (!crypto.timingSafeEqual(sigBuf, expectedBuf)) return null;

  try {
    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString());
    if (!payload.exp || Date.now() > payload.exp) return null;
    return payload; // ← full payload object return (id, name, email, role)
  } catch {
    return null;
  }
}