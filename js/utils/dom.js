/**
 * js/utils/dom.js
 * Tiny DOM helpers used across the codebase instead of a framework.
 */
export const qs = (selector, scope = document) => scope.querySelector(selector);
export const qsa = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

export function on(target, event, handler, options) {
  target.addEventListener(event, handler, options);
  return () => target.removeEventListener(event, handler, options);
}

export function createElement(tag, attrs = {}, html = '') {
  const el = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (key === 'class') el.className = value;
    else if (key.startsWith('data-')) el.setAttribute(key, value);
    else el.setAttribute(key, value);
  }
  if (html) el.innerHTML = html;
  return el;
}

export async function fetchJSON(path) {
  const res = await fetch(path);
  if (!res.ok) {
    throw new Error(`[fetchJSON] Failed to load ${path}: ${res.status} ${res.statusText}`);
  }
  return res.json();
}
