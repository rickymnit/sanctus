// Light structural validation for saved content. The admin UI produces
// well-formed data; this guards against broken or malicious payloads.

const TOP_LEVEL = ['links', 'handles', 'contact', 'hero', 'about', 'venues', 'genres', 'sound', 'radio', 'sets', 'gallery', 'booking'];
const MAX_STRING = 5000;
const MAX_ARRAY = 100;
const MAX_DEPTH = 5;
const UNSAFE_URL = /^\s*(javascript|data|vbscript|file):/i;

function bad(msg) {
  const err = new Error(msg);
  err.status = 400;
  return err;
}

function clean(value, where, depth) {
  if (depth > MAX_DEPTH) throw bad(`Content is nested too deeply at ${where}`);
  if (value === null || typeof value === 'boolean') return value;
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) throw bad(`Invalid number at ${where}`);
    return value;
  }
  if (typeof value === 'string') {
    if (value.length > MAX_STRING) throw bad(`Text is too long at ${where}`);
    if (UNSAFE_URL.test(value)) throw bad(`Links must start with https://, mailto: or tel: (${where})`);
    return value;
  }
  if (Array.isArray(value)) {
    if (value.length > MAX_ARRAY) throw bad(`Too many items in ${where}`);
    return value.map((v, i) => clean(v, `${where}[${i}]`, depth + 1));
  }
  if (typeof value === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      if (!/^[A-Za-z][A-Za-z0-9]{0,40}$/.test(k)) throw bad(`Invalid field name "${k}" in ${where}`);
      out[k] = clean(v, `${where}.${k}`, depth + 1);
    }
    return out;
  }
  throw bad(`Unsupported value at ${where}`);
}

export function validateContent(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw bad('Content must be an object');
  const out = {};
  for (const key of TOP_LEVEL) {
    if (key in input) out[key] = clean(input[key], key, 1);
  }
  out.updatedAt = new Date().toISOString();
  return out;
}
