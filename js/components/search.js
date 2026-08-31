/**
 * js/components/search.js
 * Wires the header search icon to an actual search: click reveals an
 * inline input docked under the header; submitting it navigates to
 * /catalogo.html?buscar=<query>, which renderCatalog.js then uses to
 * filter products.json by name/description/variant match.
 */
import { qs } from '../utils/dom.js';

export function initSearch() {
  const toggle = qs('#searchToggle');
  const header = qs('#siteHeader');
  if (!toggle || !header) return;

  const form = document.createElement('form');
  form.className = 'search-bar';
  form.setAttribute('role', 'search');
  form.hidden = true;
  form.innerHTML = `
    <div class="container search-bar-inner">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
      <input type="search" name="buscar" placeholder="Buscar por línea, ocasión o detalle..." aria-label="Buscar en el catálogo" autocomplete="off">
      <button type="button" class="search-bar-close" aria-label="Cerrar búsqueda">&times;</button>
    </div>
  `;
  header.appendChild(form);

  const input = form.querySelector('input');
  const closeBtn = form.querySelector('.search-bar-close');

  function openSearch() {
    form.hidden = false;
    requestAnimationFrame(() => form.classList.add('is-open'));
    input.focus();
  }

  function closeSearch() {
    form.classList.remove('is-open');
    setTimeout(() => { form.hidden = true; }, 200);
  }

  toggle.addEventListener('click', (e) => {
    e.preventDefault();
    if (form.hidden) openSearch(); else closeSearch();
  });

  closeBtn.addEventListener('click', closeSearch);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !form.hidden) closeSearch();
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = input.value.trim();
    if (!q) return;
    window.location.href = `/catalogo.html?buscar=${encodeURIComponent(q)}`;
  });

  // If we're already on the catalog page with a ?buscar= param, prefill
  // the box so re-opening the search shows what's currently filtered.
  const current = new URLSearchParams(window.location.search).get('buscar');
  if (current) input.value = current;
}
