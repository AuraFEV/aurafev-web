/**
 * js/components/reveal.js
 * Scroll-triggered fade/slide-in for elements marked `.reveal` or
 * `.reveal-stagger`. Respects prefers-reduced-motion.
 */
import { qsa } from '../utils/dom.js';

export function initReveal() {
  const els = qsa('.reveal, .reveal-stagger');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReduced) {
    els.forEach((el) => el.classList.add('in'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  els.forEach((el) => io.observe(el));

  // Safety net: if for any reason the observer never fires for an
  // element (edge cases with certain mobile browsers/viewports), don't
  // leave it permanently invisible — reveal everything after 2.5s.
  setTimeout(() => {
    els.forEach((el) => el.classList.add('in'));
  }, 2500);
}
