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
import { wireWhatsappLinks } from '../components/whatsappLinks.js';

async function init() {
  await initSiteChrome();

  const params = new URLSearchParams(window.location.search);
  const slug = params.get('linea');
  const variante = params.get('variante');
  const product = await renderProduct(qs('#productDetail'), slug, variante);

  if (product) {
    document.title = `${product.line} | Aura Fev`;
  }

  // renderProduct() just created the "Consultar por WhatsApp" button —
  // it didn't exist yet when initSiteChrome() ran wireWhatsappLinks()
  // the first time, so it was still stuck on its href="#" placeholder.
  // wireWhatsappLinks() is a pure href-setter (no listeners), safe to
  // call again now that the element actually exists in the DOM.
  wireWhatsappLinks();

  initReveal();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
