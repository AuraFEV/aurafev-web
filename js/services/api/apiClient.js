/**
 * js/services/api/apiClient.js
 * Thin fetch wrapper every future backend-dependent module (cart sync,
 * checkout, accounts, orders, reviews, coupons, gift cards, admin) will
 * share, so retries, headers and error handling only live in one place.
 *
 * There is no backend yet — API_BASE_URL is empty by default and every
 * method throws a clear ApiNotConfiguredError until it's set. This lets
 * the rest of the app be written and wired up today without pretending
 * a backend exists.
 */
import { config } from '../../config/index.js';

export class ApiNotConfiguredError extends Error {
  constructor() {
    super('API_BASE_URL is not configured. Set it as an environment variable once the backend exists (see README.md#future-backend).');
    this.name = 'ApiNotConfiguredError';
  }
}

function baseUrl() {
  return config.API_BASE_URL || '';
}

async function request(method, path, body) {
  if (!baseUrl()) throw new ApiNotConfiguredError();

  const res = await fetch(`${baseUrl()}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: body ? JSON.stringify(body) : undefined
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`API ${method} ${path} failed: ${res.status} ${text}`);
  }

  const contentType = res.headers.get('content-type') || '';
  return contentType.includes('application/json') ? res.json() : res.text();
}

export const apiClient = {
  get: (path) => request('GET', path),
  post: (path, body) => request('POST', path, body),
  put: (path, body) => request('PUT', path, body),
  patch: (path, body) => request('PATCH', path, body),
  delete: (path) => request('DELETE', path)
};
