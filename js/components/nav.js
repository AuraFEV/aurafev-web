/**
 * js/components/nav.js
 * Header scroll state + mobile menu toggle.
 */
import { qs, qsa, on } from '../utils/dom.js';

export function initNav() {
  const header = qs('#siteHeader');
  const menuToggle = qs('#menuToggle');
  const navLinks = qs('#navLinks');
  if (!header) return;

  on(window, 'scroll', () => {
    header.classList.toggle('is-scrolled', window.scrollY > 40);
  }, { passive: true });

  if (menuToggle && navLinks) {
    on(menuToggle, 'click', () => {
      const open = navLinks.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(open));
    });

    qsa('a', navLinks).forEach((link) => {
      on(link, 'click', () => {
        navLinks.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }
}
