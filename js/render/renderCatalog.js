/**
 * js/render/renderCatalog.js
 * Populates the catalog grid from js/data/products.json, each card
 * linking to its own detail page (producto.html?linea=...) and also
 * offering a direct "Agregar" quick-add button (adds the product's
 * first variant straight to the cart, no detour through the detail
 * page — wired via cartService so the header badge updates itself).
 * Supports an optional `occasion` filter (matched against the `occasion`
 * array in each product) so /catalogo.html?ocasion=cumpleanos can be
 * linked directly from js/data/occasions.json once a category has real
 * products behind it.
 */
import { fetchJSON, qs, qsa } from '../utils/dom.js';
import { formatPEN } from '../utils/currency.js';
import { addItem } from '../services/cart/cartService.js';

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
    <div class="prod-card">
      <a href="/producto.html?linea=${product.slug}" class="prod-card-media-link">
        <div class="prod-card-media">
          ${media}
          ${product.badge ? `<span class="prod-badge">${product.badge}</span>` : ''}
        </div>
      </a>
      <div class="prod-card-body">
        <a href="/producto.html?linea=${product.slug}" class="prod-card-title-link"><h3>${product.line}</h3></a>
        <p>${product.tagline}</p>
        <div class="prod-card-foot">
          <span class="prod-price">${formatPEN(product.price)}</span>
          <button type="button" class="prod-quickadd" data-slug="${product.slug}">Agregar</button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Wires every "Agregar" button in the grid to add that product's first
 * variant straight to the cart — no navigation, no variant picker (for
 * a specific color/licor, people still go to the detail page). Takes
 * the already-fetched `products` array so it doesn't re-fetch per click.
 */
function wireQuickAdd(container, products) {
  qsa('.prod-quickadd', container).forEach((btn) => {
    btn.addEventListener('click', () => {
      const product = products.find((p) => p.slug === btn.dataset.slug);
      if (!product) return;
      const variant = product.variants[0];
      addItem({
        id: `${product.slug}-${variant.id}`,
        name: `${product.line} — ${variant.label}`,
        price: variant.priceOverride ?? product.price,
        image: variant.image || null,
        quantity: 1
      });
      const original = btn.textContent;
      btn.textContent = '✓ Agregado';
      btn.setAttribute('data-state', 'added');
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = original;
        btn.removeAttribute('data-state');
        btn.disabled = false;
      }, 1500);
    });
  });
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
    wireQuickAdd(container, products);
  } catch (err) {
    console.error('[renderCatalog]', err);
  }
}

export function initCatalogFilterTitle() {
  const params = new URLSearchParams(window.location.search);
  const occasion = params.get('ocasion');
  const titleEl = qs('#catalogTitle');
  const labels = {
    cumpleanos: 'Cumpleaños',
    aniversario: 'Aniversario',
    graduacion: 'Graduación',
    'baby-shower': 'Bienvenida',
    pareja: 'Para mi Pareja',
    papa: 'Para Papá'
  };
  if (occasion && titleEl && labels[occasion]) {
    titleEl.textContent = `Catálogo — ${labels[occasion]}`;
  }
  return occasion;
}
