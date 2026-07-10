/**
 * js/render/renderPaymentBadges.js
 * Renders the accepted-payment badge row shown in the footer (and,
 * later, at checkout) in the exact brand-mandated order: Visa,
 * Mastercard, Yape, Plin, PayPal, Izipay, Niubiz.
 *
 * These are placeholder text badges, not the providers' official logo
 * artwork — see assets/icons/payments/README.md before launch.
 */
import { fetchJSON } from '../utils/dom.js';

export async function renderPaymentBadges(container) {
  if (!container) return;
  try {
    const methods = await fetchJSON('/js/data/payment-methods.json');
    container.innerHTML = methods
      .map(({ id, label }) => `<span class="pay-pill" data-provider="${id}">${label.toUpperCase()}</span>`)
      .join('');
  } catch (err) {
    console.error('[renderPaymentBadges]', err);
  }
}
