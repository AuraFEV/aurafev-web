/**
 * js/config/index.js
 * Thin ES module wrapper around the global written by config.js, so the
 * rest of the app never touches `window` directly and can be unit tested
 * by mocking this one module.
 */
const raw = typeof window !== 'undefined' ? window.__AURA_CONFIG__ : null;

if (!raw) {
  // Fails loudly in dev if config.js wasn't loaded before this module —
  // much easier to debug than silent undefined values downstream.
  console.warn('[config] window.__AURA_CONFIG__ is missing. Did index.html load js/config/config.js before js/main.js?');
}

export const config = raw || {};

export function isFeatureEnabled(key) {
  return config[key] === 'true';
}
