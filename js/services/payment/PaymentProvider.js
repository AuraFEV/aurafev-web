/**
 * js/services/payment/PaymentProvider.js
 * Shared contract every payment provider module must implement. Plain
 * JS has no interfaces, so this file documents the shape and provides
 * one shared error type — it is the closest thing to a type contract
 * without adding TypeScript as a dependency.
 *
 * A provider module must export an object matching this shape:
 *   {
 *     id: string,               // matches an id in js/data/payment-methods.json
 *     label: string,
 *     isConfigured: () => boolean,   // true once its env vars are set
 *     isEnabled: () => boolean,      // true if the ENABLE_PAYMENT_* flag is on
 *     createCheckoutSession: (order) => Promise<{ redirectUrl?: string, ... }>
 *   }
 */
export class PaymentProviderNotImplementedError extends Error {
  constructor(providerId) {
    super(`Payment provider "${providerId}" is not implemented yet. This is an MVP placeholder — connect the real API before enabling it in production (see README.md#payment-gateway).`);
    this.name = 'PaymentProviderNotImplementedError';
    this.providerId = providerId;
  }
}
