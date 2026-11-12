import { clearCookie } from './_lib/auth.js';
import { onlyMethods, send } from './_lib/http.js';

export default function handler(req, res) {
  if (!onlyMethods(req, res, ['POST'])) return;
  send(res, 200, { ok: true }, { 'Set-Cookie': clearCookie(req) });
}
