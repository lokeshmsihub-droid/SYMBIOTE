const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const buildUrl = (url, params) => {
  const isAbsolute = /^https?:\/\//i.test(url);
  const base = isAbsolute ? url : `${API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
  if (!params || Object.keys(params).length === 0) return base;
  const query = new URLSearchParams(
    Object.entries(params).reduce((acc, [key, value]) => {
      if (value === undefined || value === null) return acc;
      acc[key] = String(value);
      return acc;
    }, {})
  );
  return `${base}?${query.toString()}`;
};

const request = async (method, url, body, options = {}) => {
  const { params, headers } = options;
  const target = buildUrl(url, params);
  const init = {
    method,
    headers: {
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  };

  const response = await fetch(target, init);
  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await response.json() : await response.text();
  if (!response.ok) {
    const error = new Error(`Request failed with status ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return { data };
};

const api = {
  get: (url, options) => request('GET', url, undefined, options),
  post: (url, payload, options) => request('POST', url, payload, options),
  put: (url, payload, options) => request('PUT', url, payload, options),
  delete: (url, options) => request('DELETE', url, undefined, options),
};

export default api;
