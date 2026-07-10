/**
 * js/render/renderFaq.js
 */
import { fetchJSON } from '../utils/dom.js';

export async function renderFaq(container) {
  if (!container) return;
  try {
    const items = await fetchJSON('/js/data/faq.json');
    container.innerHTML = items.map(({ q, a }) => `
      <details class="faq-item">
        <summary>${q}<span class="faq-plus"></span></summary>
        <p>${a}</p>
      </details>
    `).join('');
  } catch (err) {
    console.error('[renderFaq]', err);
  }
}
