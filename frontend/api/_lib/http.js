// Tiny helpers shared by the API routes. They only use the plain Node
// request/response objects, so the same handlers run on Vercel and inside
// the Vite dev server (see vite.config.js).

export function send(res, status, body, headers = {}) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  if (!('Cache-Control' in headers)) res.setHeader('Cache-Control', 'no-store');
  for (const [k, v] of Object.entries(headers)) res.setHeader(k, v);
  res.end(JSON.stringify(body));
}

export async function readRaw(req, limit) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > limit) {
      const err = new Error('Payload too large');
      err.status = 413;
      throw err;
    }
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

export async function readJson(req, limit = 512 * 1024) {
  const raw = await readRaw(req, limit);
  try {
    return JSON.parse(raw.toString('utf8') || '{}');
  } catch {
    const err = new Error('Invalid JSON');
    err.status = 400;
    throw err;
  }
}

// Mutating requests must come from our own admin page: JSON (or image) body
// plus a custom header, which a cross-site form cannot set.
export function isSameSiteWrite(req) {
  return req.headers['x-sanctus-admin'] === '1';
}

export function onlyMethods(req, res, methods) {
  if (methods.includes(req.method)) return true;
  res.setHeader('Allow', methods.join(', '));
  send(res, 405, { error: 'Method not allowed' });
  return false;
}

export function handleError(res, err) {
  const status = err.status || 500;
  if (status >= 500) console.error(err);
  send(res, status, { error: status >= 500 ? err.publicMessage || 'Something went wrong on the server.' : err.message });
}
