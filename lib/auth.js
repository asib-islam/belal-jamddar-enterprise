import crypto from 'crypto';
import bcrypt from 'bcryptjs';

// ⚠️ SESSION_SECRET - .env.local + Vercel Environment Variables e add kora
// already ache. Na thakle: openssl rand -hex 32
const SECRET = process.env.SESSION_SECRET;

if (!SECRET) {
  console.error('⚠️ SESSION_SECRET environment variable is not set!');
}

// ============================================================
// PASSWORD HASHING (bcrypt) - login / add-user / change-password e use hoy
// ============================================================
export async function hashPassword(plainPassword) {
  return bcrypt.hash(plainPassword, 10);
}

export async function comparePassword(plainPassword, hash) {
  if (!plainPassword || !hash) return false;
  return bcrypt.compare(plainPassword, hash);
}

// ============================================================
// SESSION TOKEN (signed, forge-proof)
// user = { id, name, email, role }
// ============================================================
export function createSessionToken(user) {
  const payload = JSON.stringify({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    exp: Date.now() + 1000 * 60 * 60 * 24, // 24 ঘণ্টা
  });
  const payloadB64 = Buffer.from(payload).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SECRET)
    .update(payloadB64)
    .digest('base64url');
  return `${payloadB64}.${signature}`;
}

// Return: decoded user object hole token valid, na hoy null
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
    if (!payload.exp || Date.now() > payload.exp) return null; // expired
    return payload;
  } catch {
    return null;
  }
}
