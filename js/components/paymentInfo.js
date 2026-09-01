/**
 * js/components/paymentInfo.js
 * Shared modal that shows how to pay with a given provider — Yape/Plin
 * QR, or the bank account + CCI for transferencia. Triggered from two
 * places: the footer payment badges (wirePaymentBadges) and the cart
 * drawer's payment section (showPaymentInfo, called directly). Data
 * lives in js/data/payment-details.json, fetched once and cached.
 */
import { fetchJSON } from '../utils/dom.js';

let modal;
let detailsCache;

async function getDetails() {
  if (!detailsCache) {
    detailsCache = await fetchJSON('/js/data/payment-details.json');
  }
  return detailsCache;
}

function copyToClipboard(text, btn) {
  navigator.clipboard?.writeText(text).then(() => {
    const original = btn.textContent;
    btn.textContent = '¡Copiado!';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = original;
      btn.disabled = false;
    }, 1500);
  }).catch(() => {});
}

export function closePaymentInfo() {
  if (!modal) return;
  modal.classList.remove('is-open');
  setTimeout(() => { modal.hidden = true; }, 200);
}

function ensureModal() {
  if (modal) return modal;
  modal = document.createElement('div');
  modal.className = 'payment-modal-overlay';
  modal.hidden = true;
  modal.innerHTML = `
    <div class="payment-modal">
      <button type="button" class="payment-modal-close" aria-label="Cerrar">&times;</button>
      <div class="payment-modal-body"></div>
    </div>
  `;
  document.body.appendChild(modal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closePaymentInfo();
  });
  modal.querySelector('.payment-modal-close').addEventListener('click', closePaymentInfo);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) closePaymentInfo();
  });
  return modal;
}

export async function showPaymentInfo(providerId) {
  if (providerId !== 'yape' && providerId !== 'plin' && providerId !== 'transferencia') return;

  const m = ensureModal();
  const details = await getDetails();
  const body = m.querySelector('.payment-modal-body');

  if (providerId === 'yape' || providerId === 'plin') {
    const d = details[providerId];
    const label = providerId === 'yape' ? 'Yape' : 'Plin';
    body.innerHTML = `
      <h3>Paga con ${label}</h3>
      <img src="${d.qrImage}" alt="Código QR de ${label} — Aura Fev" class="payment-qr">
      <p class="payment-modal-note">Escanea el código con tu app de ${label} y envíanos la captura del pago por WhatsApp para confirmar tu pedido.</p>
    `;
  } else {
    const d = details.transferencia;
    body.innerHTML = `
      <h3>Transferencia bancaria</h3>
      <dl class="payment-account">
        <div><dt>Banco</dt><dd>${d.banco}</dd></div>
        <div><dt>Cuenta ${d.moneda}</dt><dd><span>${d.cuenta}</span><button type="button" class="copy-btn" data-copy="${d.cuenta}">Copiar</button></dd></div>
        <div><dt>CCI</dt><dd><span>${d.cci}</span><button type="button" class="copy-btn" data-copy="${d.cci}">Copiar</button></dd></div>
        <div><dt>Titular</dt><dd><span>${d.titular}</span></dd></div>
      </dl>
      <p class="payment-modal-note">Envíanos la constancia de la transferencia por WhatsApp para confirmar tu pedido.</p>
    `;
    body.querySelectorAll('.copy-btn').forEach((btn) => {
      btn.addEventListener('click', () => copyToClipboard(btn.dataset.copy, btn));
    });
  }

  m.hidden = false;
  requestAnimationFrame(() => m.classList.add('is-open'));
}

/** Wires click-delegation on the footer payment badge row. */
export function wirePaymentBadges(container) {
  if (!container) return;
  container.addEventListener('click', (e) => {
    const pill = e.target.closest('[data-provider]');
    if (!pill) return;
    showPaymentInfo(pill.dataset.provider);
  });
}
