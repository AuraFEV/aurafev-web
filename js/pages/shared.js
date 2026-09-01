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
import { initSocialRail } from '../components/socialRail.js';
import { initSearch } from '../components/search.js';
import { initCartDrawer } from '../components/cartDrawer.js';
import { wirePaymentBadges } from '../components/paymentInfo.js';
import { renderFooterNav } from '../render/renderFooterNav.js';
import { renderPaymentBadges } from '../render/renderPaymentBadges.js';
import { initAnalytics, trackPageView } from '../services/analytics/analyticsService.js';
import { getItemCount } from '../services/cart/cartService.js';

/**
 * Keeps the header cart bubble (.cart-count[data-count]) in sync with
 * cartService — updates on load and on every `cart:updated` event, so
 * product pages don't each need to reimplement this.
 */
function initCartBadge() {
  const badge = qs('.cart-count');
  if (!badge) return;
  const sync = () => badge.setAttribute('data-count', String(getItemCount()));
  sync();
  window.addEventListener('cart:updated', sync);
}

export async function initSiteChrome() {
  initSocialRail();
  initNav();
  initSearch();
  initNewsletterForm();
  initAnalytics();
  trackPageView();
  wireWhatsappLinks();
  initChatWidget();
  initCartBadge();
  initCartDrawer();

  await Promise.all([
    renderFooterNav({
      tienda: qs('#footerTienda'),
      ayuda: qs('#footerAyuda'),
      empresa: qs('#footerEmpresa')
    }),
    renderPaymentBadges(qs('#paymentBadges'))
  ]);

  wirePaymentBadges(qs('#paymentBadges'));
}
