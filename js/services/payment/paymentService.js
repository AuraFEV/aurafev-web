/**
 * js/services/payment/paymentService.js
 * Facade over every payment provider. This is the only module the rest
 * of the app (checkout UI, once built) should import — it decides which
 * gateway actually handles Visa/Mastercard (via PAYMENT_CARD_GATEWAY),
 * and exposes a single startCheckout() entry point regardless of which
 * provider ends up handling the order.
 *
 * Display order for badges/icons is a separate, brand-mandated concern
 * — see js/data/payment-methods.json and renderPaymentBadges.js. This
 * file is only about *processing* payments, not about how they're shown.
 */
import { config } from '../../config/index.js';
import { izipay } from './providers/izipay.js';
import { niubiz } from './providers/niubiz.js';
import { paypal } from './providers/paypal.js';
import { yape } from './providers/yape.js';
import { plin } from './providers/plin.js';

const cardGateways = { izipay, niubiz };
const providers = { izipay, niubiz, paypal, yape, plin };

/**
 * Visa and Mastercard are card brands, not gateways in their own right —
 * they're processed through whichever gateway is active.
 */
export function getActiveCardGateway() {
  const gatewayId = config.PAYMENT_CARD_GATEWAY || 'izipay';
  return cardGateways[gatewayId] || cardGateways.izipay;
}

export function getProvider(methodId) {
  if (methodId === 'visa' || methodId === 'mastercard') {
    return getActiveCardGateway();
  }
  return providers[methodId] || null;
}

export function getEnabledMethods() {
  return Object.values(providers).filter((p) => p.isEnabled());
}

/**
 * @param {string} methodId - one of the ids in js/data/payment-methods.json
 * @param {object} order
 */
export async function startCheckout(methodId, order) {
  const provider = getProvider(methodId);
  if (!provider) {
    throw new Error(`Unknown payment method "${methodId}"`);
  }
  return provider.createCheckoutSession(order);
}
