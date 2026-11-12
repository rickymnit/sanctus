// Thin client for the admin API. Every write carries a custom header the
// server requires, which cross-site forms can't send.

async function request(path, { method = 'GET', body, headers = {}, raw = false } = {}) {
  const res = await fetch(path, {
    method,
    credentials: 'same-origin',
    headers: {
      'X-Sanctus-Admin': '1',
      ...(body !== undefined && !raw ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    body: body === undefined ? undefined : raw ? body : JSON.stringify(body),
  });
  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || `Request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return data;
}

export const api = {
  session: () => request('/api/session'),
  login: (username, password) => request('/api/login', { method: 'POST', body: { username, password } }),
  logout: () => request('/api/logout', { method: 'POST', body: {} }),
  content: () => request('/api/content?fresh=1'),
  publish: (content) => request('/api/content', { method: 'PUT', body: content }),
  history: () => request('/api/history'),
  version: (id) => request(`/api/history?id=${encodeURIComponent(id)}`),
  upload: (blob, name) =>
    request(`/api/upload?name=${encodeURIComponent(name || 'image')}`, {
      method: 'POST',
      body: blob,
      raw: true,
      headers: { 'Content-Type': blob.type || 'application/octet-stream' },
    }),
};
