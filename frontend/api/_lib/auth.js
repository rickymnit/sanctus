import { createHash, createHmac, timingSafeEqual } from 'node:crypto';

// Credentials and signing secret come from environment variables only:
//   ADMIN_USERNAME, ADMIN_PASSWORD, SESSION_SECRET
// Set them in Vercel → Project → Settings → Environment Variables,
// and in frontend/.env.local for local development.

const COOKIE = 'sanctus_admin';
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function config() {
  const { ADMIN_USERNAME, ADMIN_PASSWORD, SESSION_SECRET } = process.env;
  if (!ADMIN_USERNAME || !ADMIN_PASSWORD || !SESSION_SECRET) {
    const err = new Error('Admin login is not configured');
    err.status = 500;
    err.publicMessage = 'Admin login is not configured on the server (missing ADMIN_USERNAME, ADMIN_PASSWORD or SESSION_SECRET).';
    throw err;
  }
  return { user: ADMIN_USERNAME, pass: ADMIN_PASSWORD, secret: SESSION_SECRET };
}

// Hash both sides first so the comparison is constant-time regardless of length.
const same = (a, b) =>
  timingSafeEqual(createHash('sha256').update(String(a)).digest(), createHash('sha256').update(String(b)).digest());

export function checkCredentials(username, password) {
  const { user, pass } = config();
  // Evaluate both so timing does not reveal which one was wrong.
  const u = same(username, user);
  const p = same(password, pass);
  return u && p;
}

const b64 = (s) => Buffer.from(s).toString('base64url');
const sign = (data, secret) => createHmac('sha256', secret).update(data).digest('base64url');

export function createSession(username) {
  const { secret } = config();
  const payload = b64(JSON.stringify({ u: username, exp: Math.floor(Date.now() / 1000) + MAX_AGE }));
  return `${payload}.${sign(payload, secret)}`;
}

function parseCookies(header = '') {
  return Object.fromEntries(
    header
      .split(';')
      .map((p) => p.trim().split('='))
      .filter(([k]) => k)
      .map(([k, ...v]) => [k, decodeURIComponent(v.join('='))])
  );
}

export function readSession(req) {
  const token = parseCookies(req.headers.cookie)[COOKIE];
  if (!token) return null;
  const { secret, user } = config();
  const [payload, sig] = token.split('.');
  if (!payload || !sig || !same(sig, sign(payload, secret))) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (data.exp < Date.now() / 1000) return null;
    if (data.u !== user) return null; // username changed → old sessions end
    return data;
  } catch {
    return null;
  }
}

const isHttps = (req) =>
  req.headers['x-forwarded-proto'] === 'https' || process.env.VERCEL === '1';

export function sessionCookie(req, token) {
  const parts = [`${COOKIE}=${token}`, 'Path=/', 'HttpOnly', 'SameSite=Strict', `Max-Age=${MAX_AGE}`];
  if (isHttps(req)) parts.push('Secure');
  return parts.join('; ');
}

export function clearCookie(req) {
  const parts = [`${COOKIE}=`, 'Path=/', 'HttpOnly', 'SameSite=Strict', 'Max-Age=0'];
  if (isHttps(req)) parts.push('Secure');
  return parts.join('; ');
}

export function requireAdmin(req) {
  const session = readSession(req);
  if (!session) {
    const err = new Error('Please log in again.');
    err.status = 401;
    throw err;
  }
  return session;
}
