import { readSession } from './_lib/auth.js';
import { handleError, onlyMethods, send } from './_lib/http.js';

export default function handler(req, res) {
  if (!onlyMethods(req, res, ['GET'])) return;
  try {
    const session = readSession(req);
    if (!session) return send(res, 401, { error: 'Not logged in' });
    send(res, 200, { username: session.u, storage: process.env.BLOB_READ_WRITE_TOKEN ? 'blob' : process.env.VERCEL ? 'missing' : 'local' });
  } catch (err) {
    handleError(res, err);
  }
}
