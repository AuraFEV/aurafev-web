/**
 * js/render/renderTestimonials.js
 */
import { fetchJSON } from '../utils/dom.js';

export async function renderTestimonials(container) {
  if (!container) return;
  try {
    const testimonials = await fetchJSON('/js/data/testimonials.json');
    container.innerHTML = testimonials.map(({ initial, quote, name, location }) => `
      <div class="test-card">
        <p class="test-quote">${quote}</p>
        <div class="test-who">
          <div class="avatar">${initial}</div>
          <div>
            <div class="name">${name}</div>
            <div class="loc">${location}</div>
          </div>
        </div>
      </div>
    `).join('');
  } catch (err) {
    console.error('[renderTestimonials]', err);
  }
}
