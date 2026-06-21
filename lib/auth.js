import crypto from 'crypto';

// ⚠️ SESSION_SECRET ekta notun environment variable - eta apnar .env.local
// ar Vercel project settings (Environment Variables) e add korte hobe.
// Lomba, random ekta string hote hobe (kauke share korben na, GitHub e
// commit korben na). Generate korte:
//   - Terminal e: openssl rand -hex 32
//   - Othoba Node REPL e: require('crypto').randomBytes(32).toString('hex')
const SECRET = process.env.SESSION_SECRET;

if (!SECRET) {
  console.error('⚠️ SESSION_SECRET environment variable is not set!');
}

// Login successful hole eta call kore signed token banano hoy
export function createSessionToken() {
  const payload = JSON.stringify({
    role: 'admin',
    exp: Date.now() + 1000 * 60 * 60 * 24, // 24 ghonta
  });
  const payloadB64 = Buffer.from(payload).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SECRET)
    .update(payloadB64)
    .digest('base64url');
  return `${payloadB64}.${signature}`;
}

// Protected route gulote eta diye cookie-r token verify kora hoy
export function verifySessionToken(token) {
  if (!token || !SECRET) return false;

  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const [payloadB64, signature] = parts;

  const expectedSig = crypto
    .createHmac('sha256', SECRET)
    .update(payloadB64)
    .digest('base64url');

  const sigBuf = Buffer.from(signature);
  const expectedBuf = Buffer.from(expectedSig);

  // timing-safe compare - signature string ekdom shothik na hoile
  // matching attempt e o somoy-bhitti clue paowa jay na
  if (sigBuf.length !== expectedBuf.length) return false;
  if (!crypto.timingSafeEqual(sigBuf, expectedBuf)) return false;

  try {
    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString());
    if (!payload.exp || Date.now() > payload.exp) return false; // expired
    return payload.role === 'admin';
  } catch {
    return false;
  }
}
