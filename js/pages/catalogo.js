/**
 * js/pages/catalogo.js
 * Entry point for /catalogo.html. Renders the product grid from
 * js/data/products.json, optionally filtered by ?ocasion=.
 */
import { qs } from '../utils/dom.js';
import { initSiteChrome } from './shared.js';
import { initReveal } from '../components/reveal.js';
import { renderCatalog, initCatalogFilterTitle } from '../render/renderCatalog.js';

async function init() {
  await initSiteChrome();
  const occasion = initCatalogFilterTitle();
  await renderCatalog(qs('#catalogGrid'), { occasion });
  initReveal();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
