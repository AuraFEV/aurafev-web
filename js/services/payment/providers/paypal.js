/**
 * js/services/payment/providers/paypal.js
 * Placeholder for PayPal Checkout.
 * Real integration docs: https://developer.paypal.com/docs/checkout/
 *
 * PAYPAL_CLIENT_ID is a public identifier (safe in client code) used to
 * load the PayPal JS SDK. PAYPAL_CLIENT_SECRET must stay server-side
 * only, for the future backend to verify/capture orders.
 */
import { config } from '../../../config/index.js';
import { PaymentProviderNotImplementedError } from '../PaymentProvider.js';

export const paypal = {
  id: 'paypal',
  label: 'PayPal',
  isConfigured: () => Boolean(config.PAYPAL_CLIENT_ID),
  isEnabled: () => config.ENABLE_PAYMENT_PAYPAL === 'true',
  async createCheckoutSession(_order) {
    throw new PaymentProviderNotImplementedError('paypal');
  }
};
