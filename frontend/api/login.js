import { checkCredentials, createSession, sessionCookie } from './_lib/auth.js';
import { handleError, isSameSiteWrite, onlyMethods, readJson, send } from './_lib/http.js';

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

export default async function handler(req, res) {
  if (!onlyMethods(req, res, ['POST'])) return;
  try {
    if (!isSameSiteWrite(req)) return send(res, 403, { error: 'Forbidden' });
    const { username = '', password = '' } = await readJson(req, 4096);
    if (!checkCredentials(String(username).trim(), String(password))) {
      await wait(800); // slow down guessing
      return send(res, 401, { error: 'Wrong username or password.' });
    }
    const token = createSession(String(username).trim());
    send(res, 200, { ok: true, username: String(username).trim() }, { 'Set-Cookie': sessionCookie(req, token) });
  } catch (err) {
    handleError(res, err);
  }
}
