/**
 * js/services/payment/providers/niubiz.js
 * Placeholder for Niubiz (card gateway — processes Visa/Mastercard).
 * Real integration docs: https://desarrolladores.niubiz.com.pe
 *
 * To activate: set NIUBIZ_MERCHANT_ID (and, server-side only,
 * NIUBIZ_SECRET_KEY) as environment variables, then implement
 * createCheckoutSession() to request a session token from the future
 * backend.
 */
import { config } from '../../../config/index.js';
import { PaymentProviderNotImplementedError } from '../PaymentProvider.js';

export const niubiz = {
  id: 'niubiz',
  label: 'Niubiz',
  isConfigured: () => Boolean(config.NIUBIZ_MERCHANT_ID),
  isEnabled: () => config.ENABLE_PAYMENT_NIUBIZ === 'true',
  async createCheckoutSession(_order) {
    throw new PaymentProviderNotImplementedError('niubiz');
  }
};
