/**
 * js/components/whatsappLinks.js
 * Wires every element marked [data-whatsapp-link] to the configured
 * wa.me click-to-chat URL. Split out of main.js so any page (home,
 * proximamente, future product/checkout pages) can reuse it without
 * duplicating the lookup logic.
 */
import { getSupportLink } from '../services/whatsapp/whatsappService.js';

export function wireWhatsappLinks() {
  const link = getSupportLink();
  if (!link) return;
  document.querySelectorAll('[data-whatsapp-link]').forEach((el) => {
    el.href = link;
  });
}
