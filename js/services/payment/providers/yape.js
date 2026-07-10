/**
 * js/services/payment/providers/yape.js
 * Placeholder for Yape (QR / wallet payments).
 * Real integration requires a Yape Empresas merchant account.
 *
 * To activate: set YAPE_MERCHANT_CODE as an environment variable, then
 * implement createCheckoutSession() to request a payment QR/link from
 * the future backend.
 */
import { config } from '../../../config/index.js';
import { PaymentProviderNotImplementedError } from '../PaymentProvider.js';

export const yape = {
  id: 'yape',
  label: 'Yape',
  isConfigured: () => Boolean(config.YAPE_MERCHANT_CODE),
  isEnabled: () => config.ENABLE_PAYMENT_YAPE === 'true',
  async createCheckoutSession(_order) {
    throw new PaymentProviderNotImplementedError('yape');
  }
};
