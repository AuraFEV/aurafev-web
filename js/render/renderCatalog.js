/**
 * js/render/renderCatalog.js
 * Populates the catalog grid from js/data/products.json.
 * One card per product by default — but when a product has a variant
 * priced differently from the base (priceOverride, e.g. Cumpleaños'
 * "Edición Hincha" at S/69 vs the base S/54), that variant gets its own
 * card too, so it's actually discoverable in the grid instead of hiding
 * behind the detail page's variant picker. Same-priced variants (Luxury's
 * 2 whiskies, the bear-color pickers) stay as a single card — those are
 * a "pick on the detail page" choice, not a different purchase decision.
 * Each card also offers a direct "Agregar" quick-add button (adds that
 * exact variant straight to the cart via cartService).
 */
import { fetchJSON, qs, qsa } from '../utils/dom.js';
import { formatPEN } from '../utils/currency.js';
import { addItem } from '../services/cart/cartService.js';

/** Base card (product.variants[0]) + one extra card per differently-priced variant. */
function cardEntriesFor(product) {
  const base = product.variants[0];
  const entries = [{ product, variant: base, isVariant: false }];
  product.variants.slice(1).forEach((v) => {
    if (v.priceOverride !== undefined && v.priceOverride !== product.price) {
      entries.push({ product, variant: v, isVariant: true });
    }
  });
  return entries;
}

function productCard({ product, variant, isVariant }) {
  const image = product.photoPending ? null : (variant.image || null);
  const price = variant.priceOverride ?? product.price;
  const title = isVariant ? `${product.line} — ${variant.label}` : product.line;
  const tagline = isVariant ? (variant.note || product.tagline) : product.tagline;
  const href = isVariant
    ? `/producto.html?linea=${product.slug}&variante=${variant.id}`
    : `/producto.html?linea=${product.slug}`;

  const media = image
    ? `<img src="${image}" alt="${title} — Aura Fev" loading="lazy">`
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
      <a href="${href}" class="prod-card-media-link">
        <div class="prod-card-media">
          ${media}
          ${product.badge && !isVariant ? `<span class="prod-badge">${product.badge}</span>` : ''}
        </div>
      </a>
      <div class="prod-card-body">
        <a href="${href}" class="prod-card-title-link"><h3>${title}</h3></a>
        <p>${tagline}</p>
        <div class="prod-card-foot">
          <span class="prod-price">${formatPEN(price)}</span>
          <button type="button" class="prod-quickadd" data-slug="${product.slug}" data-variant="${variant.id}">Agregar</button>
        </div>
      </div>
    </div>
  `;
}

function wireQuickAdd(container, products) {
  qsa('.prod-quickadd', container).forEach((btn) => {
    btn.addEventListener('click', () => {
      const product = products.find((p) => p.slug === btn.dataset.slug);
      if (!product) return;
      const variant = product.variants.find((v) => v.id === btn.dataset.variant) || product.variants[0];
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
    const entries = products.flatMap(cardEntriesFor);
    container.innerHTML = entries.map(productCard).join('');
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
    papa: 'Para Papá',
    corporativo: 'Corporativo'
  };
  if (occasion && titleEl && labels[occasion]) {
    titleEl.textContent = `Catálogo — ${labels[occasion]}`;
  }
  return occasion;
}
