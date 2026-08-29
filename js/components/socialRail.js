/**
 * js/components/socialRail.js
 * Injects a fixed vertical rail of social links on the left edge of the
 * viewport, visible at all times regardless of scroll position — same
 * links as the footer (kept in sync manually, there are only 5), just
 * always within reach instead of buried at the bottom of the page.
 * Hidden on narrow/mobile widths via CSS; the footer icons remain the
 * fallback there, where a fixed side rail would eat into content width.
 */
export function initSocialRail() {
  if (document.querySelector('.social-rail')) return; // avoid double-injection

  const rail = document.createElement('aside');
  rail.className = 'social-rail';
  rail.setAttribute('aria-label', 'Síguenos en redes sociales');
  rail.innerHTML = `
    <a href="https://www.instagram.com/aura.fev" target="_blank" rel="noopener" aria-label="Instagram">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/></svg>
    </a>
    <a href="https://www.tiktok.com/@aura.fev" target="_blank" rel="noopener" aria-label="TikTok">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M14 3v11a3 3 0 1 1-3-3"/><path d="M14 3c0 3 2 5 5 5"/></svg>
    </a>
    <a href="https://www.facebook.com/profile.php?id=61591765464248" target="_blank" rel="noopener" aria-label="Facebook">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M15 3h-2a4 4 0 0 0-4 4v3H7v4h2v7h4v-7h3l1-4h-4V7a1 1 0 0 1 1-1h3V3z"/></svg>
    </a>
    <a href="#" data-whatsapp-link target="_blank" rel="noopener" aria-label="WhatsApp">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M4 20l1.4-4.2A8 8 0 1 1 9 19.6L4 20z"/><path d="M9 10c0 3 2.5 5 5 5"/></svg>
    </a>
    <a href="mailto:aurafev@gmail.com" aria-label="Correo">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>
    </a>
    <span class="social-rail-line" aria-hidden="true"></span>
  `;
  document.body.appendChild(rail);
}
