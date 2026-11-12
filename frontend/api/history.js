import { requireAdmin } from './_lib/auth.js';
import { handleError, onlyMethods, send } from './_lib/http.js';
import { listHistory, readHistory } from './_lib/store.js';

// GET /api/history          admin; list of past published versions (newest first)
// GET /api/history?id=...   admin; one version's full content
export default async function handler(req, res) {
  if (!onlyMethods(req, res, ['GET'])) return;
  try {
    requireAdmin(req);
    const id = new URL(req.url, 'http://x').searchParams.get('id');
    if (id) {
      const content = await readHistory(id);
      if (!content) return send(res, 404, { error: 'That version no longer exists.' });
      return send(res, 200, content);
    }
    send(res, 200, { versions: await listHistory() });
  } catch (err) {
    handleError(res, err);
  }
}
