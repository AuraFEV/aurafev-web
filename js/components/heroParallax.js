/**
 * js/components/heroParallax.js
 * Very subtle ambient drift on the hero's aura rings — purely
 * decorative, disabled entirely under prefers-reduced-motion.
 */
import { qs, on } from '../utils/dom.js';

export function initHeroParallax() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const rings = qs('.aura-rings');
  const glow = qs('.aura-glow');
  if (!rings || !glow) return;

  on(window, 'scroll', () => {
    const y = window.scrollY;
    if (y < window.innerHeight) {
      rings.style.transform = `translate(-50%, calc(-50% + ${y * 0.12}px))`;
      glow.style.opacity = String(Math.max(0, 1 - y / 600));
    }
  }, { passive: true });
}
