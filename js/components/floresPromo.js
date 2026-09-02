/**
 * js/components/floresPromo.js
 * Home-only welcome popup for the "Día de las Flores Amarillas" pre-sale
 * (21 de setiembre — see the note in the modal copy about why not the 23,
 * which is the official "Día de la Primavera" but not the date the viral
 * gifting tradition is actually tied to). Shows once per calendar day
 * (not once-ever — this is a short, active sales push, a daily reminder
 * makes sense for the ~3 weeks it runs), only on the homepage, and stops
 * showing entirely after PROMO_END so nobody has to remember to come
 * back and turn it off manually once the date passes.
 */
import { getSupportLink } from '../services/whatsapp/whatsappService.js';

const PROMO_END = new Date('2026-09-22T00:00:00');
const STORAGE_KEY = 'aura_flores_promo_seen';

export function initFloresPromo() {
  const path = window.location.pathname;
  if (path !== '/' && path !== '/index.html') return;
  if (new Date() >= PROMO_END) return;

  const todayStr = new Date().toISOString().slice(0, 10);
  if (localStorage.getItem(STORAGE_KEY) === todayStr) return;

  const overlay = document.createElement('div');
  overlay.className = 'flores-promo-overlay';
  overlay.innerHTML = `
    <div class="flores-promo-card">
      <button type="button" class="flores-promo-close" aria-label="Cerrar">&times;</button>

      <p class="flores-promo-eyebrow">Pre-venta · Día de las Flores Amarillas</p>

      <div class="flores-promo-collage">
        <div class="fp-media fp-media--left">
          <img src="/images/products/flores-amarillas-blanco.jpg" alt="Flores Amarillas — Aura Fev">
        </div>
        <div class="fp-media fp-media--center">
          <video autoplay muted loop playsinline src="/videos/flores-amarillas-reveal.mp4"></video>
        </div>
        <div class="fp-media fp-media--right">
          <img src="/images/products/flores-amarillas-negro.jpg" alt="Flores Amarillas — Aura Fev">
        </div>
      </div>

      <h2 class="flores-promo-title">Iniciamos la pre-venta de<br><em>nuestras Flores Amarillas</em></h2>
      <p class="flores-promo-sub">El 21 de setiembre es el Día de las Flores Amarillas. Separa la tuya con tiempo — se agotan rápido.</p>

      <div class="flores-promo-ctas">
        <a href="/producto.html?linea=flores-amarillas" class="btn btn-primary">Ver Flores Amarillas</a>
        <a href="#" class="btn btn-ghost" data-whatsapp-preventa target="_blank" rel="noopener">Aparta la tuya por WhatsApp</a>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';

  const waLink = overlay.querySelector('[data-whatsapp-preventa]');
  const link = getSupportLink('Hola! Quiero apartar mi caja de Flores Amarillas para el 21 de setiembre.');
  if (link) waLink.href = link; else waLink.hidden = true;

  function close() {
    overlay.remove();
    document.body.style.overflow = '';
    localStorage.setItem(STORAGE_KEY, todayStr);
  }

  overlay.querySelector('.flores-promo-close').addEventListener('click', close);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', function onEsc(e) {
    if (e.key === 'Escape') { close(); document.removeEventListener('keydown', onEsc); }
  });

  requestAnimationFrame(() => overlay.classList.add('is-open'));
}
