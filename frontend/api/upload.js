import { requireAdmin } from './_lib/auth.js';
import { handleError, isSameSiteWrite, onlyMethods, readRaw, send } from './_lib/http.js';
import { ALLOWED_IMAGE_TYPES, saveImage } from './_lib/store.js';

// POST /api/upload?name=hero  body: raw image bytes (already resized in the browser)
// Vercel caps request bodies at 4.5 MB; the admin's image editor keeps files well under that.
const LIMIT = 4 * 1024 * 1024;

// Check the file's real signature, not just the declared type.
function sniff(buf) {
  if (buf.length < 12) return null;
  if (buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') return 'image/webp';
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'image/jpeg';
  if (buf.toString('hex', 0, 8) === '89504e470d0a1a0a') return 'image/png';
  if (buf.toString('ascii', 4, 12) === 'ftypavif') return 'image/avif';
  return null;
}

export default async function handler(req, res) {
  if (!onlyMethods(req, res, ['POST'])) return;
  try {
    requireAdmin(req);
    if (!isSameSiteWrite(req)) return send(res, 403, { error: 'Forbidden' });
    const buf = await readRaw(req, LIMIT);
    const type = sniff(buf);
    if (!type || !ALLOWED_IMAGE_TYPES.includes(type)) {
      return send(res, 415, { error: 'Please upload a JPG, PNG, WebP or AVIF image.' });
    }
    const name = new URL(req.url, 'http://x').searchParams.get('name') || 'image';
    const url = await saveImage(buf, type, name);
    send(res, 200, { url, size: buf.length, type });
  } catch (err) {
    if (err.status === 413) return send(res, 413, { error: 'That image is too large (max 4 MB after resizing).' });
    handleError(res, err);
  }
}
