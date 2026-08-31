/**
 * js/components/cartDrawer.js
 * Wires the header cart icon to an actual cart view: a slide-out panel
 * listing items from cartService (localStorage-backed — see that file),
 * with quantity controls and a "Continuar por WhatsApp" button that
 * builds a formatted order summary and opens it as a pre-filled wa.me
 * message. No real checkout/payment gateway exists yet (see
 * js/services/payment/) — WhatsApp handoff IS the checkout today, same
 * pattern as the rest of the site.
 */
import { qs } from '../utils/dom.js';
import { getCart, setQuantity, removeItem, getSubtotal } from '../services/cart/cartService.js';
import { getSupportLink } from '../services/whatsapp/whatsappService.js';
import { formatPEN } from '../utils/currency.js';

function buildOrderMessage() {
  const items = getCart();
  const lines = items.map((i) => `- ${i.name} x${i.quantity} — ${formatPEN(i.price * i.quantity)}`);
  const subtotal = formatPEN(getSubtotal());
  return `Hola! Quiero confirmar este pedido:\n\n${lines.join('\n')}\n\nSubtotal: ${subtotal}\n\n¿Cómo coordinamos el pago y la entrega?`;
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

function renderContents(body, footer) {
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
      <a href="#" class="btn btn-primary btn-block" id="cartWhatsappBtn" target="_blank" rel="noopener">Continuar por WhatsApp</a>
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

  whatsappBtn.addEventListener('click', (e) => {
    const link = getSupportLink(buildOrderMessage());
    if (!link) {
      e.preventDefault();
      return;
    }
    whatsappBtn.href = link;
  });

  window.addEventListener('cart:updated', () => {
    if (drawer.classList.contains('is-open')) refresh();
  });
}
