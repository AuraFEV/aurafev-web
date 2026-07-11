/**
 * js/pages/proximamente.js
 * Entry point for /proximamente.html. All the real logic lives in
 * js/pages/shared.js — this page has no content of its own to render,
 * so it only needs the shared chrome plus scroll-reveal.
 */
import { initSiteChrome } from './shared.js';
import { initReveal } from '../components/reveal.js';

async function init() {
  await initSiteChrome();
  initReveal();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
