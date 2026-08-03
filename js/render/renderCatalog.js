/**
 * js/render/renderCatalog.js
 * Populates the catalog grid from js/data/products.json — five product
 * lines, each linking to its own detail page (producto.html?linea=...).
 * Supports an optional `occasion` filter (matched against the `occasion`
 * array in each product) so /catalogo.html?ocasion=cumpleanos can be
 * linked directly from js/data/occasions.json once a category has real
 * products behind it.
 */
import { fetchJSON, qs } from '../utils/dom.js';
import { formatPEN } from '../utils/currency.js';

function productCard(product) {
  const firstVariant = product.variants[0];
  const image = product.photoPending ? null : (firstVariant.image || null);

  const media = image
    ? `<img src="${image}" alt="${product.line} — Aura Fev" loading="lazy">`
    : `
      <div class="prod-photo-pending" aria-hidden="true">
        <svg class="aura-rings-sm" viewBox="0 0 200 200">
          <g fill="none" stroke="#B88A44">
            <circle cx="100" cy="100" r="30" stroke-width="1" opacity=".5"/>
            <circle cx="100" cy="100" r="50" stroke-width="1" opacity=".35"/>
            <circle cx="100" cy="100" r="70" stroke-width="1" opacity=".2"/>
          </g>
        </svg>
        <span>Foto en camino</span>
      </div>
    `;

  return `
    <a href="/producto.html?linea=${product.slug}" class="prod-card">
      <div class="prod-card-media">
        ${media}
        ${product.badge ? `<span class="prod-badge">${product.badge}</span>` : ''}
      </div>
      <div class="prod-card-body">
        <h3>${product.line}</h3>
        <p>${product.tagline}</p>
        <div class="prod-card-foot">
          <span class="prod-price">${formatPEN(product.price)}</span>
          <span class="prod-link">Ver detalle →</span>
        </div>
      </div>
    </a>
  `;
}

export async function renderCatalog(container, { occasion } = {}) {
  if (!container) return;
  try {
    let products = await fetchJSON('/js/data/products.json');
    if (occasion) {
      products = products.filter((p) => p.occasion.includes(occasion));
    }
    if (!products.length) {
      container.innerHTML = `<p class="prod-empty">Todavía no tenemos productos publicados para esta ocasión — escríbenos por WhatsApp y te ayudamos igual.</p>`;
      return;
    }
    container.innerHTML = products.map(productCard).join('');
  } catch (err) {
    console.error('[renderCatalog]', err);
  }
}

export function initCatalogFilterTitle() {
  const params = new URLSearchParams(window.location.search);
  const occasion = params.get('ocasion');
  const titleEl = qs('#catalogTitle');
  const labels = { cumpleanos: 'Cumpleaños', aniversario: 'Aniversario' };
  if (occasion && titleEl && labels[occasion]) {
    titleEl.textContent = `Catálogo — ${labels[occasion]}`;
  }
  return occasion;
}
