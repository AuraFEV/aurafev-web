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
 * @param {{role: 'user'|'assistant', content: string}[]} messages
 * @returns {Promise<string>} Laura's reply text
 */
export async function sendChatMessage(messages) {
  const res = await fetch(`${config.API_BASE_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages })
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || `Chat backend respondió ${res.status}`);
  }

  return data.reply;
}
