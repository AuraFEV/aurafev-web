/**
 * js/services/payment/providers/izipay.js
 * Placeholder for Izipay (card gateway — processes Visa/Mastercard).
 * Real integration docs: https://www.izipay.pe/desarrolladores
 *
 * To activate: set IZIPAY_PUBLIC_KEY (and, server-side only,
 * IZIPAY_SECRET_KEY) as environment variables, then implement
 * createCheckoutSession() to call Izipay's session/token endpoint from
 * the future backend (never call it with the secret key from the
 * browser).
 */
import { config } from '../../../config/index.js';
import { PaymentProviderNotImplementedError } from '../PaymentProvider.js';

export const izipay = {
  id: 'izipay',
  label: 'Izipay',
  isConfigured: () => Boolean(config.IZIPAY_PUBLIC_KEY),
  isEnabled: () => config.ENABLE_PAYMENT_IZIPAY === 'true',
  async createCheckoutSession(_order) {
    throw new PaymentProviderNotImplementedError('izipay');
  }
};
