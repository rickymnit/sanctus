import { requireAdmin } from './_lib/auth.js';
import { handleError, isSameSiteWrite, onlyMethods, readJson, send } from './_lib/http.js';
import { readContent, writeContent } from './_lib/store.js';
import { validateContent } from './_lib/validate.js';

// GET  /api/content         public; the site's current content (or 204 if never edited)
// GET  /api/content?fresh=1 admin; skips the CDN cache
// PUT  /api/content         admin; publish new content
export default async function handler(req, res) {
  if (!onlyMethods(req, res, ['GET', 'PUT'])) return;
  try {
    if (req.method === 'GET') {
      const fresh = (req.url || '').includes('fresh=1');
      if (fresh) requireAdmin(req);
      const content = await readContent();
      // Visitors get a CDN-cached copy for a few seconds; admins always get the latest.
      const cache = fresh ? 'no-store' : 'public, max-age=0, s-maxage=10, stale-while-revalidate=60';
      if (!content) {
        res.statusCode = 204;
        res.setHeader('Cache-Control', cache);
        return res.end();
      }
      return send(res, 200, content, { 'Cache-Control': cache });
    }

    requireAdmin(req);
    if (!isSameSiteWrite(req)) return send(res, 403, { error: 'Forbidden' });
    const content = validateContent(await readJson(req));
    await writeContent(content);
    send(res, 200, { ok: true, updatedAt: content.updatedAt });
  } catch (err) {
    handleError(res, err);
  }
}
