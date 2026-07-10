/**
 * js/render/renderOccasions.js
 * Populates the "¿Para quién es este momento?" grid from
 * js/data/occasions.json — editing the JSON is enough to add, remove or
 * reorder occasions; no HTML/JS changes required.
 */
import { fetchJSON } from '../utils/dom.js';
import { icon } from '../utils/icons.js';

export async function renderOccasions(container) {
  if (!container) return;
  try {
    const occasions = await fetchJSON('/js/data/occasions.json');
    container.innerHTML = occasions.map(({ label, icon: iconName, href }) => `
      <a href="${href}" class="occ-card">
        <svg class="card-texture" viewBox="0 0 200 200"><rect width="200" height="200" fill="url(#topo-lines)"/></svg>
        ${icon(iconName, 'occ-icon')}
        <span>${label}</span>
      </a>
    `).join('');
  } catch (err) {
    console.error('[renderOccasions]', err);
  }
}
