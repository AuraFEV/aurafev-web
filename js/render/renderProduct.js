/**
 * js/render/renderProduct.js
 * Renders a single product's detail view (image, variant picker, message
 * picker when applicable, price, and add-to-cart) from
 * js/data/products.json, matched by slug against ?linea= in the URL.
 * Wires the "Agregar al carrito" button straight into
 * js/services/cart/cartService.js — no page reload, no backend call yet.
 */
import { fetchJSON } from '../utils/dom.js';
import { formatPEN } from '../utils/currency.js';
import { addItem } from '../services/cart/cartService.js';

function photoPendingBlock() {
  return `
    <div class="prod-photo-pending prod-photo-pending--lg" aria-hidden="true">
      <svg class="aura-rings-sm" viewBox="0 0 200 200">
        <g fill="none" stroke="#B88A44">
          <circle cx="100" cy="100" r="40" stroke-width="1" opacity=".5"/>
          <circle cx="100" cy="100" r="65" stroke-width="1" opacity=".35"/>
          <circle cx="100" cy="100" r="90" stroke-width="1" opacity=".2"/>
        </g>
      </svg>
      <span>Foto en camino</span>
    </div>
  `;
}

export async function renderProduct(container, slug, initialVariantId) {
  if (!container) return null;

  let products;
  try {
    products = await fetchJSON('/js/data/products.json');
  } catch (err) {
    console.error('[renderProduct]', err);
    container.innerHTML = `<p class="prod-empty">No pudimos cargar el catálogo. Intenta de nuevo en unos minutos.</p>`;
    return null;
  }

  const product = products.find((p) => p.slug === slug);
  if (!product) {
    container.innerHTML = `
      <div class="prod-not-found reveal">
        <p class="eyebrow">Aura Fev</p>
        <h1>No encontramos ese producto.</h1>
        <p class="sub">Puede que el link esté mal escrito o el producto ya no exista.</p>
        <a href="/catalogo.html" class="btn btn-primary">Ver catálogo completo</a>
      </div>
    `;
    return null;
  }

  const hasMessages = Array.isArray(product.messageOptions) && product.messageOptions.length > 0;
  const initialVariant = product.variants.find((v) => v.id === initialVariantId) || product.variants[0];
  const initialPrice = initialVariant.priceOverride ?? product.price;

  container.innerHTML = `
    <div class="prod-detail reveal">
      <div class="prod-detail-media" id="prodMedia">
        ${product.photoPending ? photoPendingBlock() : `<img id="prodImage" src="${initialVariant.image || ''}" alt="${product.line} — Aura Fev">`}
        ${product.badge ? `<span class="prod-badge">${product.badge}</span>` : ''}
      </div>

      <div class="prod-detail-info">
        <p class="eyebrow">${product.line}</p>
        <h1>${product.tagline}</h1>
        <p class="prod-price-lg" id="prodPrice">${formatPEN(initialPrice)}</p>
        <p class="prod-description">${product.description}</p>

        <ul class="prod-includes">
          ${product.includes.map((item) => `<li>${item}</li>`).join('')}
        </ul>

        <div class="prod-variant-picker" role="radiogroup" aria-label="Elige tu variante">
          <p class="prod-picker-label">Elige tu variante</p>
          <div class="prod-variant-options" id="variantOptions">
            ${product.variants.map((v) => `
              <label class="prod-variant-chip">
                <input type="radio" name="variant" value="${v.id}" ${v.id === initialVariant.id ? 'checked' : ''}>
                <span>${v.label}</span>
              </label>
            `).join('')}
          </div>
          ${product.variants.some((v) => v.note) ? `<p class="prod-variant-note" id="variantNote">${initialVariant.note || ''}</p>` : ''}
        </div>

        ${hasMessages ? `
          <div class="prod-variant-picker">
            <p class="prod-picker-label">Personaliza el mensaje</p>
            <select class="prod-message-select" id="messageSelect">
              ${product.messageOptions.map((m) => `
                <option value="${m.id}" ${!m.available ? 'disabled' : ''}>${m.label}${!m.available ? ' — próximamente' : ''}</option>
              `).join('')}
            </select>
          </div>
        ` : ''}

        <div class="prod-actions">
          <button class="btn btn-primary btn-block" id="addToCartBtn">Agregar al carrito</button>
          <a href="#" class="btn btn-ghost btn-block" data-whatsapp-link target="_blank" rel="noopener">Consultar por WhatsApp</a>
        </div>
        <p class="form-message" id="addToCartMessage" aria-live="polite"></p>
      </div>
    </div>
  `;

  wireInteractions(product);
  return product;
}

function wireInteractions(product) {
  const variantInputs = document.querySelectorAll('input[name="variant"]');
  const priceEl = document.getElementById('prodPrice');
  const imageEl = document.getElementById('prodImage');
  const noteEl = document.getElementById('variantNote');
  const cartMsg = document.getElementById('addToCartMessage');
  const messageSelect = document.getElementById('messageSelect');

  function selectedVariant() {
    const checked = document.querySelector('input[name="variant"]:checked');
    return product.variants.find((v) => v.id === checked?.value) || product.variants[0];
  }

  function updateForVariant() {
    const variant = selectedVariant();
    const price = variant.priceOverride ?? product.price;
    if (priceEl) priceEl.textContent = formatPEN(price);
    if (imageEl && variant.image) imageEl.src = variant.image;
    if (noteEl) noteEl.textContent = variant.note || '';
  }

  variantInputs.forEach((input) => input.addEventListener('change', updateForVariant));

  const addBtn = document.getElementById('addToCartBtn');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      const variant = selectedVariant();
      const price = variant.priceOverride ?? product.price;
      const messageLabel = messageSelect
        ? messageSelect.options[messageSelect.selectedIndex].text
        : null;

      addItem({
        id: `${product.slug}-${variant.id}${messageSelect ? `-${messageSelect.value}` : ''}`,
        name: `${product.line} — ${variant.label}${messageLabel ? ` (${messageLabel})` : ''}`,
        price,
        image: variant.image || null,
        quantity: 1
      });

      if (cartMsg) {
        cartMsg.textContent = 'Agregado al carrito.';
        cartMsg.setAttribute('data-state', 'success');
      }
    });
  }
}
