/**
 * js/main.js
 * Entry point for the homepage, loaded as `<script type="module">`.
 * Site-wide chrome (nav, newsletter, footer, WhatsApp, analytics) comes
 * from js/pages/shared.js — this file only handles what's specific to
 * the home: the hero parallax and the JSON-driven sections that don't
 * appear anywhere else.
 */
import { qs } from './utils/dom.js';
import { initSiteChrome } from './pages/shared.js';
import { initReveal } from './components/reveal.js';
import { initHeroParallax } from './components/heroParallax.js';

import { renderOccasions } from './render/renderOccasions.js';
import { renderWhyCards } from './render/renderWhyCards.js';
import { renderPackaging } from './render/renderPackaging.js';
import { renderTestimonials } from './render/renderTestimonials.js';
import { renderFaq } from './render/renderFaq.js';

async function renderHomeContent() {
  await Promise.all([
    renderOccasions(qs('#occasionsGrid')),
    renderWhyCards(qs('#whyGrid')),
    renderPackaging(qs('#packagingGrid')),
    renderTestimonials(qs('#testimonialsGrid')),
    renderFaq(qs('#faqList'))
  ]);
}

async function init() {
  initHeroParallax();
  await initSiteChrome();
  await renderHomeContent();

  // Reveal-on-scroll runs last, once every section (including the
  // JSON-driven ones) actually exists in the DOM.
  initReveal();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
