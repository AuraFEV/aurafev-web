/**
 * js/services/chat/chatService.js
 * Talks to the Laura backend (backend/server.js — a separate Render
 * service, see its own README). Pure networking, no DOM — the widget
 * component owns rendering.
 */
import { config } from '../../config/index.js';

export function isChatConfigured() {
  return Boolean(config.API_BASE_URL);
}

/**
 * Reads what page/product/variant the person is looking at right now,
 * so Laura doesn't have to ask "which one?" when they say "este" or
 * "esta variante". Purely a snapshot of the DOM/URL at send-time —
 * nothing persisted, nothing sent unless a message is actually sent.
 */
export function getPageContext() {
  const params = new URLSearchParams(window.location.search);
  const selectedVariant = document.querySelector('input[name="variant"]:checked');
  return {
    path: window.location.pathname,
    linea: params.get('linea') || null,
    variant: selectedVariant ? selectedVariant.value : null
  };
}

/**
 * @param {{role: 'user'|'assistant', content: string}[]} messages
 * @param {{path: string, linea: string|null, variant: string|null}} [pageContext]
 * @returns {Promise<string>} Laura's reply text
 */
export async function sendChatMessage(messages, pageContext) {
  const res = await fetch(`${config.API_BASE_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, pageContext })
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || `Chat backend respondió ${res.status}`);
  }

  return data.reply;
}
