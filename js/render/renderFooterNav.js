/**
 * js/render/renderFooterNav.js
 * Renders the three footer link columns from a single JSON source so
 * site information architecture lives in one place.
 */
import { fetchJSON } from '../utils/dom.js';

function renderList(links) {
  return links.map(({ label, href }) => `<li><a href="${href}">${label}</a></li>`).join('');
}

export async function renderFooterNav({ tienda, ayuda, empresa }) {
  try {
    const nav = await fetchJSON('/js/data/footer-nav.json');
    if (tienda) tienda.innerHTML = renderList(nav.tienda);
    if (ayuda) ayuda.innerHTML = renderList(nav.ayuda);
    if (empresa) empresa.innerHTML = renderList(nav.empresa);
  } catch (err) {
    console.error('[renderFooterNav]', err);
  }
}
