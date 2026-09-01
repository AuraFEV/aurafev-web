/**
 * js/pages/producto.js
 * Entry point for /producto.html?linea=<slug>. Renders one product's
 * detail view from js/data/products.json and updates the page <title>
 * once the product is known.
 */
import { qs } from '../utils/dom.js';
import { initSiteChrome } from './shared.js';
import { initReveal } from '../components/reveal.js';
import { renderProduct } from '../render/renderProduct.js';

async function init() {
  await initSiteChrome();

  const params = new URLSearchParams(window.location.search);
  const slug = params.get('linea');
  const variante = params.get('variante');
  const product = await renderProduct(qs('#productDetail'), slug, variante);

  if (product) {
    document.title = `${product.line} | Aura Fev`;
  }

  initReveal();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
