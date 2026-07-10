/**
 * js/render/renderWhyCards.js
 */
import { fetchJSON } from '../utils/dom.js';
import { icon } from '../utils/icons.js';

export async function renderWhyCards(container) {
  if (!container) return;
  try {
    const cards = await fetchJSON('/js/data/why-cards.json');
    container.innerHTML = cards.map(({ icon: iconName, title, text }) => `
      <div class="why-card">
        ${icon(iconName, 'why-icon')}
        <h3>${title}</h3>
        <p>${text}</p>
      </div>
    `).join('');
  } catch (err) {
    console.error('[renderWhyCards]', err);
  }
}
