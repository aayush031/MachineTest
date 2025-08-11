

const API_URL = import.meta.env.VITE_API_URL || '';

function isFormData(obj) {
  return typeof FormData !== 'undefined' && obj instanceof FormData;
}

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('token');
  const headers = { ...(options.headers || {}) };

  if (!headers['Content-Type'] && !isFormData(options.body)) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const fetchOptions = { ...options, headers };

  if (headers['Content-Type'] === 'application/json' && options.body && !isFormData(options.body)) {
    fetchOptions.body = JSON.stringify(options.body);
  }

  const res = await fetch(`${API_URL}${path}`, fetchOptions);
  const text = await res.text();
  let body = null;
  try { body = text ? JSON.parse(text) : null; } catch { body = text; }

  if (!res.ok) {
    const err = new Error(body?.message || res.statusText || 'API error');
    err.status = res.status;
    err.body = body;
    throw err;
  }
  return body;
}