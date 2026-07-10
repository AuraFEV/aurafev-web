/**
 * js/render/renderPackaging.js
 */
import { fetchJSON } from '../utils/dom.js';
import { icon } from '../utils/icons.js';

export async function renderPackaging(container) {
  if (!container) return;
  try {
    const items = await fetchJSON('/js/data/packaging.json');
    container.innerHTML = items.map(({ icon: iconName, title, text }) => `
      <div class="pack-card">
        ${icon(iconName, 'pack-icon')}
        <div>
          <h4>${title}</h4>
          <p>${text}</p>
        </div>
      </div>
    `).join('');
  } catch (err) {
    console.error('[renderPackaging]', err);
  }
}
