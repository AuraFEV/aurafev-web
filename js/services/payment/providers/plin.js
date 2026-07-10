/**
 * js/services/payment/providers/plin.js
 * Placeholder for Plin (QR / wallet payments).
 *
 * To activate: set PLIN_MERCHANT_CODE as an environment variable, then
 * implement createCheckoutSession() to request a payment QR/link from
 * the future backend.
 */
import { config } from '../../../config/index.js';
import { PaymentProviderNotImplementedError } from '../PaymentProvider.js';

export const plin = {
  id: 'plin',
  label: 'Plin',
  isConfigured: () => Boolean(config.PLIN_MERCHANT_CODE),
  isEnabled: () => config.ENABLE_PAYMENT_PLIN === 'true',
  async createCheckoutSession(_order) {
    throw new PaymentProviderNotImplementedError('plin');
  }
};
