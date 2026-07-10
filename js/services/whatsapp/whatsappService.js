/**
 * js/services/whatsapp/whatsappService.js
 * -----------------------------------------------------------------------
 * Two very different things live in this file on purpose:
 *
 * 1. getSupportLink() — works TODAY, no backend needed. It builds a
 *    wa.me click-to-chat link from WHATSAPP_NUMBER (a public, non-secret
 *    configuration value — the number is visible in the link itself).
 *
 * 2. The send*() functions below — placeholders for the Meta WhatsApp
 *    Business (Cloud API) integration. Sending template messages
 *    requires a permanent access token and phone number ID, which are
 *    SECRETS. They must live only in a future backend's environment
 *    variables (WHATSAPP_API_TOKEN, WHATSAPP_PHONE_NUMBER_ID,
 *    WHATSAPP_BUSINESS_ACCOUNT_ID — see .env.example) and are
 *    deliberately absent from js/config, which is public/client-side.
 *    These functions call apiClient against a future backend endpoint
 *    that will hold those secrets and talk to Meta's Graph API itself.
 * -----------------------------------------------------------------------
 */
import { config } from '../../config/index.js';
import { apiClient } from '../api/apiClient.js';

const DEFAULT_MESSAGE = 'Hola, quiero más información sobre un regalo Aura Fev.';

/**
 * Builds a wa.me click-to-chat link. Works with zero backend.
 * @param {string} [message]
 * @returns {string|null}
 */
export function getSupportLink(message = DEFAULT_MESSAGE) {
  const number = (config.WHATSAPP_NUMBER || '').replace(/\D/g, '');
  if (!number) {
    console.warn('[whatsappService] WHATSAPP_NUMBER is not configured — set it as an environment variable.');
    return null;
  }
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

/**
 * Everything below requires the future backend + Meta Cloud API and is
 * intentionally unimplemented in this MVP. Each stub documents the
 * backend route it expects to exist, so wiring the real thing later is
 * a matter of implementing that endpoint — not refactoring the caller.
 */

/** @param {{ orderId: string, phone: string }} payload */
export function sendOrderConfirmation(payload) {
  return apiClient.post('/whatsapp/order-confirmation', payload);
}

/** @param {{ orderId: string, phone: string, amount: number }} payload */
export function sendPaymentConfirmation(payload) {
  return apiClient.post('/whatsapp/payment-confirmation', payload);
}

/** @param {{ orderId: string, phone: string, trackingUrl?: string }} payload */
export function sendShippingNotification(payload) {
  return apiClient.post('/whatsapp/shipping-notification', payload);
}

/** @param {{ orderId: string, phone: string, message: string }} payload */
export function sendPersonalizedGiftMessage(payload) {
  return apiClient.post('/whatsapp/gift-message', payload);
}

/** @param {{ cartId: string, phone: string }} payload */
export function sendAbandonedCartReminder(payload) {
  return apiClient.post('/whatsapp/abandoned-cart', payload);
}

/** @param {{ phone: string, campaignId: string }} payload */
export function sendPromotionalCampaign(payload) {
  return apiClient.post('/whatsapp/promotional-campaign', payload);
}

/**
 * Placeholder hook for a future AI-assisted support flow (e.g. routing
 * inbound WhatsApp messages to an LLM-backed agent). Left unimplemented
 * deliberately — needs product decisions this codebase can't make.
 * @param {{ phone: string, message: string }} payload
 */
export function requestAiAssistantReply(payload) {
  return apiClient.post('/whatsapp/ai-assistant', payload);
}
