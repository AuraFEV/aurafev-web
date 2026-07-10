/**
 * js/components/newsletterForm.js
 * Newsletter capture. Currently stores nothing and just confirms
 * submission — swap the TODO for a real request once
 * js/services/api/apiClient.js has a live backend to call
 * (POST /newsletter/subscribe).
 */
import { qs, on } from '../utils/dom.js';

export function initNewsletterForm() {
  const form = qs('#newsletterForm');
  if (!form) return;

  const message = qs('#newsletterMessage');

  on(form, 'submit', async (event) => {
    event.preventDefault();
    const input = qs('input[type="email"]', form);
    const email = input?.value.trim();

    if (!email) return;

    // TODO(backend): replace with apiClient.post('/newsletter/subscribe', { email })
    // once the backend module described in README.md#future-backend exists.
    if (message) {
      message.textContent = 'Gracias por suscribirte. Pronto tendrás noticias nuestras.';
      message.dataset.state = 'success';
    }
    form.reset();
  });
}
