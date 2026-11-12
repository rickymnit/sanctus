// Storage for site content and uploaded images.
//
// Production (Vercel): Vercel Blob, enabled when BLOB_READ_WRITE_TOKEN is set
//   (Vercel adds it automatically when a Blob store is connected to the project).
// Local development: files under frontend/.data/ (git-ignored).

import { promises as fs } from 'node:fs';
import path from 'node:path';

const CONTENT = 'content/content.json';
const HISTORY = 'content/history/';
const KEEP_HISTORY = 30;

const blobEnabled = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);

function assertWritable() {
  if (!blobEnabled() && process.env.VERCEL) {
    const err = new Error('Storage not connected');
    err.status = 500;
    err.publicMessage =
      'Storage is not connected. In Vercel, open Storage → Create → Blob and connect it to this project, then redeploy.';
    throw err;
  }
}

/* ---------- local filesystem backend ---------- */

const DATA_DIR = path.resolve(process.cwd(), '.data');
const local = (p) => path.join(DATA_DIR, p);

async function localWrite(p, data) {
  await fs.mkdir(path.dirname(local(p)), { recursive: true });
  await fs.writeFile(local(p), data);
}

async function localRead(p) {
  try {
    return await fs.readFile(local(p), 'utf8');
  } catch (e) {
    if (e.code === 'ENOENT') return null;
    throw e;
  }
}

/* ---------- blob backend ---------- */

const blob = () => import('@vercel/blob');

async function blobReadText(pathname) {
  const { get } = await blob();
  const res = await get(pathname, { access: 'public', useCache: false });
  if (!res || res.statusCode !== 200) return null;
  return await new Response(res.stream).text();
}

async function blobWriteJson(pathname, text) {
  const { put } = await blob();
  await put(pathname, text, {
    access: 'public',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json',
    cacheControlMaxAge: 60,
  });
}

/* ---------- public API ---------- */

export async function readContent() {
  if (!blobEnabled() && process.env.VERCEL) return null; // not connected yet: site uses built-in content
  const text = blobEnabled() ? await blobReadText(CONTENT) : await localRead(CONTENT);
  return text ? JSON.parse(text) : null;
}

export async function writeContent(content) {
  assertWritable();
  const text = JSON.stringify(content);
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const historyPath = `${HISTORY}${stamp}.json`;
  if (blobEnabled()) {
    await blobWriteJson(CONTENT, text);
    await blobWriteJson(historyPath, text);
    await pruneHistory();
  } else {
    await localWrite(CONTENT, text);
    await localWrite(historyPath, text);
    await pruneHistory();
  }
}

export async function listHistory() {
  assertWritable();
  let items;
  if (blobEnabled()) {
    const { list } = await blob();
    const out = [];
    let cursor;
    do {
      const page = await list({ prefix: HISTORY, cursor, limit: 1000 });
      out.push(...page.blobs);
      cursor = page.hasMore ? page.cursor : undefined;
    } while (cursor);
    items = out.map((b) => ({ id: b.pathname.slice(HISTORY.length, -5), savedAt: new Date(b.uploadedAt).toISOString(), size: b.size }));
  } else {
    let names = [];
    try {
      names = await fs.readdir(local(HISTORY));
    } catch {
      /* no history yet */
    }
    items = await Promise.all(
      names
        .filter((n) => n.endsWith('.json'))
        .map(async (n) => {
          const st = await fs.stat(local(HISTORY + n));
          return { id: n.slice(0, -5), savedAt: st.mtime.toISOString(), size: st.size };
        })
    );
  }
  return items.sort((a, b) => b.id.localeCompare(a.id));
}

export async function readHistory(id) {
  if (!/^[0-9TZ-]+$/.test(id)) return null;
  const p = `${HISTORY}${id}.json`;
  const text = blobEnabled() ? await blobReadText(p) : await localRead(p);
  return text ? JSON.parse(text) : null;
}

async function pruneHistory() {
  const items = await listHistory();
  const old = items.slice(KEEP_HISTORY);
  if (!old.length) return;
  if (blobEnabled()) {
    const { del } = await blob();
    await del(old.map((i) => `${HISTORY}${i.id}.json`));
  } else {
    await Promise.all(old.map((i) => fs.rm(local(`${HISTORY}${i.id}.json`), { force: true })));
  }
}

const EXT = { 'image/webp': 'webp', 'image/jpeg': 'jpg', 'image/png': 'png', 'image/avif': 'avif' };

export async function saveImage(buffer, contentType, baseName) {
  assertWritable();
  const ext = EXT[contentType];
  const safe = (baseName || 'image').toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'image';
  if (blobEnabled()) {
    const { put } = await blob();
    const res = await put(`uploads/${safe}.${ext}`, buffer, {
      access: 'public',
      addRandomSuffix: true,
      contentType,
      cacheControlMaxAge: 60 * 60 * 24 * 365,
    });
    return res.url;
  }
  const name = `${safe}-${Date.now().toString(36)}.${ext}`;
  await localWrite(`uploads/${name}`, buffer);
  return `/uploads/${name}`;
}

export const ALLOWED_IMAGE_TYPES = Object.keys(EXT);
