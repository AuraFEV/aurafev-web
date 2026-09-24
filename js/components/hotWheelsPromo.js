/**
 * js/components/hotWheelsPromo.js
 * Home-only welcome popup for "Día de Regalar Hot Wheels" (30 de
 * setiembre) — the viral male counterpart to Flores Amarillas. Same
 * pattern as floresPromo.js (kept as a reference, not shared code,
 * since the two ran in different seasons and it's simpler to let each
 * one be self-contained than to generalize prematurely).
 *
 * Unlike Flores Amarillas, these 3 photos are landscape stills (no
 * video this time) — see hotwheels-promo.css for the 3:2 aspect ratio
 * instead of the 9:16 used for the flowers video/photos.
 *
 * NOTE: the primary CTA points to WhatsApp for now, not a product
 * page — there's no /producto.html?linea=hot-wheels yet since price
 * and box composition aren't confirmed. Swap the primary button's
 * href to the real product page once that exists, same as the Flores
 * Amarillas popup does.
 */
import { getSupportLink } from '../services/whatsapp/whatsappService.js';

const PROMO_END = new Date('2026-10-01T00:00:00');
const STORAGE_KEY = 'aura_hotwheels_promo_seen';

export function initHotWheelsPromo() {
  const path = window.location.pathname;
  if (path !== '/' && path !== '/index.html') return;
  if (new Date() >= PROMO_END) return;

  const todayStr = new Date().toISOString().slice(0, 10);
  if (localStorage.getItem(STORAGE_KEY) === todayStr) return;

  const overlay = document.createElement('div');
  overlay.className = 'hw-promo-overlay';
  overlay.innerHTML = `
    <div class="hw-promo-card">
      <button type="button" class="hw-promo-close" aria-label="Cerrar">&times;</button>

      <p class="hw-promo-eyebrow">Pre-venta · Día de Regalar Hot Wheels</p>

      <div class="hw-promo-collage">
        <div class="hw-media hw-media--left">
          <img src="/images/products/hotwheels-bouquet.jpg" alt="Ramo Hot Wheels — Aura Fev">
        </div>
        <div class="hw-media hw-media--center">
          <img src="/images/products/hotwheels-hero.jpg" alt="Hot Wheels — Aura Fev">
        </div>
        <div class="hw-media hw-media--right">
          <img src="/images/products/hotwheels-box.jpg" alt="Caja Hot Wheels — Aura Fev">
        </div>
      </div>

      <h2 class="hw-promo-title">Ya abrimos la temporada de<br><em>Hot Wheels</em></h2>
      <p class="hw-promo-sub">El 30 de setiembre es el Día de Regalar Hot Wheels — el gesto espejo de las flores amarillas, para él. Separa el tuyo con tiempo.</p>

      <div class="hw-promo-ctas">
        <a href="#" class="btn btn-primary" data-whatsapp-hotwheels target="_blank" rel="noopener">Consultar por WhatsApp</a>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';

  const waLink = overlay.querySelector('[data-whatsapp-hotwheels]');
  const link = getSupportLink('Hola! Quiero más información sobre las cajas de Hot Wheels para el 30 de setiembre.');
  if (link) waLink.href = link; else waLink.hidden = true;

  function close() {
    overlay.remove();
    document.body.style.overflow = '';
    localStorage.setItem(STORAGE_KEY, todayStr);
  }

  overlay.querySelector('.hw-promo-close').addEventListener('click', close);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', function onEsc(e) {
    if (e.key === 'Escape') { close(); document.removeEventListener('keydown', onEsc); }
  });

  requestAnimationFrame(() => overlay.classList.add('is-open'));
}
