/**
 * js/components/cartDrawer.js
 * Wires the header cart icon to an actual cart view: a slide-out panel
 * listing items from cartService (localStorage-backed — see that file),
 * with quantity controls, a required delivery district (so Ernesto can
 * quote delivery AND get real traceability of where demand concentrates
 * — tracked via analyticsService, not just buried in a WhatsApp chat),
 * a payment method section (Yape/Plin QR or bank transfer, via
 * paymentInfo.js), and a final WhatsApp handoff that builds a formatted
 * order summary. No real checkout/payment gateway exists yet (see
 * js/services/payment/) — WhatsApp confirmation IS the checkout today,
 * same pattern as the rest of the site.
 */
import { qs, fetchJSON } from '../utils/dom.js';
import { getCart, setQuantity, removeItem, getSubtotal } from '../services/cart/cartService.js';
import { getSupportLink } from '../services/whatsapp/whatsappService.js';
import { formatPEN } from '../utils/currency.js';
import { showPaymentInfo } from './paymentInfo.js';
import { trackEvent } from '../services/analytics/analyticsService.js';

let selectedDistrict = '';
let districtsCache;

async function getDistricts() {
  if (!districtsCache) {
    districtsCache = await fetchJSON('/js/data/districts.json');
  }
  return districtsCache;
}

function buildOrderMessage() {
  const items = getCart();
  const lines = items.map((i) => `- ${i.name} x${i.quantity} — ${formatPEN(i.price * i.quantity)}`);
  const subtotal = formatPEN(getSubtotal());
  const districtLine = selectedDistrict ? `\nDistrito de entrega: ${selectedDistrict}` : '';
  return `Hola! Quiero confirmar este pedido:\n\n${lines.join('\n')}\n\nSubtotal: ${subtotal}${districtLine}\n\nAdjunto la captura o constancia de mi pago.`;
}

function itemRow(item) {
  const media = item.image
    ? `<img src="${item.image}" alt="${item.name}">`
    : `<div class="cart-item-noimg" aria-hidden="true"></div>`;
  return `
    <li class="cart-item" data-id="${item.id}">
      <div class="cart-item-media">${media}</div>
      <div class="cart-item-body">
        <p class="cart-item-name">${item.name}</p>
        <p class="cart-item-price">${formatPEN(item.price)}</p>
        <div class="cart-item-qty">
          <button type="button" class="qty-btn" data-action="dec" aria-label="Restar uno">&minus;</button>
          <span>${item.quantity}</span>
          <button type="button" class="qty-btn" data-action="inc" aria-label="Sumar uno">&plus;</button>
        </div>
      </div>
      <button type="button" class="cart-item-remove" data-action="remove" aria-label="Quitar del carrito">&times;</button>
    </li>
  `;
}

async function districtSelectHtml() {
  const districts = await getDistricts();
  const options = districts.map((d) => `<option value="${d}" ${d === selectedDistrict ? 'selected' : ''}>${d}</option>`).join('');
  return `
    <div class="cart-field">
      <label for="cartDistrict">Distrito de entrega <span class="req">*</span></label>
      <select id="cartDistrict">
        <option value="" disabled ${selectedDistrict ? '' : 'selected'}>Elige tu distrito...</option>
        ${options}
      </select>
    </div>
  `;
}

function paymentSectionHtml() {
  return `
    <div class="cart-field">
      <label>Método de pago</label>
      <div class="cart-payment-pills">
        <button type="button" class="pay-pill" data-provider="yape">YAPE</button>
        <button type="button" class="pay-pill" data-provider="plin">PLIN</button>
        <button type="button" class="pay-pill" data-provider="transferencia">TRANSFERENCIA</button>
      </div>
    </div>
  `;
}

async function renderContents(body, footer) {
  const items = getCart();
  if (!items.length) {
    body.innerHTML = `
      <div class="cart-empty">
        <p>Tu carrito está vacío.</p>
        <a href="/catalogo.html" class="btn btn-ghost">Ver catálogo</a>
      </div>
    `;
    footer.hidden = true;
    return;
  }
  body.innerHTML = `<ul class="cart-item-list">${items.map(itemRow).join('')}</ul>`;
  footer.hidden = false;
  footer.querySelector('.cart-subtotal-amount').textContent = formatPEN(getSubtotal());
  footer.querySelector('.cart-district-slot').innerHTML = await districtSelectHtml();
  updateWhatsappState(footer);
}

function updateWhatsappState(footer) {
  const btn = footer.querySelector('#cartWhatsappBtn');
  const hint = footer.querySelector('.cart-district-hint');
  if (!selectedDistrict) {
    btn.setAttribute('aria-disabled', 'true');
    hint.hidden = false;
  } else {
    btn.removeAttribute('aria-disabled');
    hint.hidden = true;
  }
}

export function initCartDrawer() {
  const toggle = qs('.cart-count');
  if (!toggle) return;

  const overlay = document.createElement('div');
  overlay.className = 'cart-overlay';
  overlay.hidden = true;

  const drawer = document.createElement('aside');
  drawer.className = 'cart-drawer';
  drawer.hidden = true;
  drawer.setAttribute('aria-label', 'Tu carrito');
  drawer.innerHTML = `
    <div class="cart-drawer-head">
      <h2>Tu carrito</h2>
      <button type="button" class="cart-drawer-close" aria-label="Cerrar carrito">&times;</button>
    </div>
    <div class="cart-drawer-body"></div>
    <div class="cart-drawer-foot" hidden>
      <div class="cart-subtotal-row">
        <span>Subtotal</span>
        <span class="cart-subtotal-amount"></span>
      </div>
      <div class="cart-district-slot"></div>
      ${paymentSectionHtml()}
      <a href="#" class="btn btn-primary btn-block" id="cartWhatsappBtn" target="_blank" rel="noopener">Confirmar pedido por WhatsApp</a>
      <p class="cart-district-hint" hidden>Elige tu distrito de entrega para continuar.</p>
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.appendChild(drawer);

  const body = drawer.querySelector('.cart-drawer-body');
  const footer = drawer.querySelector('.cart-drawer-foot');
  const whatsappBtn = drawer.querySelector('#cartWhatsappBtn');

  function refresh() {
    renderContents(body, footer);
  }

  function openDrawer() {
    refresh();
    overlay.hidden = false;
    drawer.hidden = false;
    requestAnimationFrame(() => {
      overlay.classList.add('is-open');
      drawer.classList.add('is-open');
    });
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    overlay.classList.remove('is-open');
    drawer.classList.remove('is-open');
    document.body.style.overflow = '';
    setTimeout(() => {
      overlay.hidden = true;
      drawer.hidden = true;
    }, 250);
  }

  toggle.addEventListener('click', (e) => {
    e.preventDefault();
    openDrawer();
  });

  drawer.querySelector('.cart-drawer-close').addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) closeDrawer();
  });

  body.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const id = btn.closest('.cart-item').dataset.id;
    const item = getCart().find((i) => i.id === id);
    if (!item) return;
    if (btn.dataset.action === 'inc') setQuantity(id, item.quantity + 1);
    if (btn.dataset.action === 'dec') setQuantity(id, item.quantity - 1);
    if (btn.dataset.action === 'remove') removeItem(id);
  });

  footer.addEventListener('change', (e) => {
    if (e.target.id !== 'cartDistrict') return;
    selectedDistrict = e.target.value;
    trackEvent('delivery_district_selected', { district: selectedDistrict });
    updateWhatsappState(footer);
  });

  footer.addEventListener('click', (e) => {
    const pill = e.target.closest('.pay-pill[data-provider]');
    if (pill) showPaymentInfo(pill.dataset.provider);
  });

  whatsappBtn.addEventListener('click', (e) => {
    if (!selectedDistrict) {
      e.preventDefault();
      footer.querySelector('.cart-district-hint').hidden = false;
      footer.querySelector('#cartDistrict').focus();
      return;
    }
    const link = getSupportLink(buildOrderMessage());
    if (!link) {
      e.preventDefault();
      return;
    }
    whatsappBtn.href = link;
    trackEvent('begin_checkout_whatsapp', { district: selectedDistrict, value: getSubtotal() });
  });

  window.addEventListener('cart:updated', () => {
    if (drawer.classList.contains('is-open')) refresh();
  });
}
