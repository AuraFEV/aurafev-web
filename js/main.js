/**
 * js/main.js
 * Single entry point for the homepage, loaded as `<script type="module">`.
 * Wires up UI components and kicks off the JSON-driven render modules.
 * Other pages (product, cart, checkout, account...) will get their own
 * thin entry file that imports only what they need from js/services and
 * js/components — this file should stay specific to the homepage.
 */
import { qs } from './utils/dom.js';
import { initNav } from './components/nav.js';
import { initReveal } from './components/reveal.js';
import { initHeroParallax } from './components/heroParallax.js';
import { initNewsletterForm } from './components/newsletterForm.js';

import { renderOccasions } from './render/renderOccasions.js';
import { renderWhyCards } from './render/renderWhyCards.js';
import { renderPackaging } from './render/renderPackaging.js';
import { renderTestimonials } from './render/renderTestimonials.js';
import { renderFaq } from './render/renderFaq.js';
import { renderFooterNav } from './render/renderFooterNav.js';
import { renderPaymentBadges } from './render/renderPaymentBadges.js';

import { initAnalytics, trackPageView } from './services/analytics/analyticsService.js';
import { getSupportLink } from './services/whatsapp/whatsappService.js';

async function renderContent() {
  await Promise.all([
    renderOccasions(qs('#occasionsGrid')),
    renderWhyCards(qs('#whyGrid')),
    renderPackaging(qs('#packagingGrid')),
    renderTestimonials(qs('#testimonialsGrid')),
    renderFaq(qs('#faqList')),
    renderFooterNav({
      tienda: qs('#footerTienda'),
      ayuda: qs('#footerAyuda'),
      empresa: qs('#footerEmpresa')
    }),
    renderPaymentBadges(qs('#paymentBadges'))
  ]);

  // Re-run scroll-reveal now that JSON-driven sections exist in the DOM.
  initReveal();
}

function wireWhatsappLinks() {
  const link = getSupportLink();
  if (!link) return;
  document.querySelectorAll('[data-whatsapp-link]').forEach((el) => {
    el.href = link;
  });
}

async function init() {
  initNav();
  initHeroParallax();
  initNewsletterForm();
  initAnalytics();
  trackPageView();
  wireWhatsappLinks();

  await renderContent();

  // Static (non-JSON-driven) sections can reveal immediately.
  initReveal();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
