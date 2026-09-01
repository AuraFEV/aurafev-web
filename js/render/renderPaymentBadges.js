/**
 * js/render/renderPaymentBadges.js
 * Renders the accepted-payment badge row shown in the footer — only
 * the payment methods actually available today (Yape, Plin,
 * transferencia bancaria; all coordinated manually via WhatsApp, no
 * live gateway yet). Do NOT add Visa/Mastercard/PayPal/Izipay/Niubiz
 * back here until a real integration exists — see
 * js/services/payment/providers/, where every provider currently
 * throws PaymentProviderNotImplementedError. Showing a badge for a
 * method nobody can actually use is a false trust signal, not a
 * cosmetic detail.
 *
 * Each badge is a real button — clicking it opens the QR/account
 * details via js/components/paymentInfo.js (wired separately in
 * shared.js via wirePaymentBadges, once this markup exists in the DOM).
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
      .map(({ id, label }) => `<button type="button" class="pay-pill" data-provider="${id}">${label.toUpperCase()}</button>`)
      .join('');
  } catch (err) {
    console.error('[renderPaymentBadges]', err);
  }
}
