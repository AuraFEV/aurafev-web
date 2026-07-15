/**
 * js/pages/shared.js
 * Bootstraps everything that's identical on every page: header/nav
 * behavior, the newsletter form, analytics, WhatsApp links, and the
 * footer (rendered from js/data/footer-nav.json and
 * js/data/payment-methods.json — same source of truth everywhere).
 *
 * Every page entry file (js/main.js for the home, js/pages/*.js for
 * everything else) should call initSiteChrome() first, then add
 * whatever is specific to that page. This is the one place that logic
 * lives — page entry files must not re-implement any of it.
 */
import { qs } from '../utils/dom.js';
import { initNav } from '../components/nav.js';
import { initNewsletterForm } from '../components/newsletterForm.js';
import { wireWhatsappLinks } from '../components/whatsappLinks.js';
import { initChatWidget } from '../components/chatWidget.js';
import { renderFooterNav } from '../render/renderFooterNav.js';
import { renderPaymentBadges } from '../render/renderPaymentBadges.js';
import { initAnalytics, trackPageView } from '../services/analytics/analyticsService.js';

export async function initSiteChrome() {
  initNav();
  initNewsletterForm();
  initAnalytics();
  trackPageView();
  wireWhatsappLinks();
  initChatWidget();

  await Promise.all([
    renderFooterNav({
      tienda: qs('#footerTienda'),
      ayuda: qs('#footerAyuda'),
      empresa: qs('#footerEmpresa')
    }),
    renderPaymentBadges(qs('#paymentBadges'))
  ]);
}
