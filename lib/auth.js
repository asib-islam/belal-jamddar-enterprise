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
// SESSION TOKEN (No Expiry - Unlimited)
// ============================================================
export function createSessionToken(user) {
  const payload = JSON.stringify({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    // ❌ exp সরানো হয়েছে - Token কখনো এক্সপাইর হবে না
  });
  const payloadB64 = Buffer.from(payload).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SECRET)
    .update(payloadB64)
    .digest('base64url');
  return `${payloadB64}.${signature}`;
}

// ============================================================
// VERIFY TOKEN (No Expiry Check)
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
    // ❌ exp চেক সরানো হয়েছে - Token কখনো এক্সপাইর হবে না
    return payload; // full payload object return (id, name, email, role)
  } catch {
    return null;
  }
}