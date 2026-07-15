/**
 * js/components/chatWidget.js
 * Builds and wires the entire "Laura" chat widget into whatever
 * element has id="chatWidgetRoot". Renders nothing at all if the chat
 * backend isn't configured yet (API_BASE_URL empty) — no dead button
 * on a deploy that hasn't wired up backend/ yet.
 *
 * Conversation history lives only in memory for this page view — no
 * localStorage, no server-side storage. Refreshing the page starts a
 * fresh conversation with Laura.
 */
import { qs, createElement, on } from '../utils/dom.js';
import { icon } from '../utils/icons.js';
import { isChatConfigured, sendChatMessage } from '../services/chat/chatService.js';
import { getSupportLink } from '../services/whatsapp/whatsappService.js';

const GREETING = '¡Hola! Soy Laura, la asesora virtual de Aura Fev 💛 ¿En qué ocasión estás pensando regalar algo?';

export function initChatWidget() {
  const root = qs('#chatWidgetRoot');
  if (!root || !isChatConfigured()) return;

  const history = [];

  root.innerHTML = `
    <div class="chat-widget" id="chatWidget">
      <div class="chat-panel" role="dialog" aria-label="Chat con Laura, asesora virtual de Aura Fev">
        <div class="chat-header">
          <div class="avatar">L</div>
          <div class="chat-header-text">
            <div class="name">Laura · Aura Fev</div>
            <div class="status">En línea</div>
          </div>
        </div>
        <div class="chat-messages" id="chatMessages" aria-live="polite"></div>
        <form class="chat-input-row" id="chatForm">
          <textarea id="chatInput" rows="1" placeholder="Escribe tu mensaje..." aria-label="Tu mensaje"></textarea>
          <button class="chat-send-btn" type="submit" aria-label="Enviar">${icon('send')}</button>
        </form>
      </div>
      <button class="chat-launcher" id="chatLauncher" aria-label="Abrir chat con Laura" aria-expanded="false">
        <span class="icon-chat">${icon('chat-bubble')}</span>
        <span class="icon-close">${icon('close')}</span>
      </button>
    </div>
  `;

  const widget = qs('#chatWidget', root);
  const launcher = qs('#chatLauncher', root);
  const messagesEl = qs('#chatMessages', root);
  const form = qs('#chatForm', root);
  const input = qs('#chatInput', root);

  function addBubble(role, text) {
    const bubble = createElement('div', { class: `chat-bubble from-${role === 'user' ? 'user' : 'laura'}` });
    bubble.textContent = text;
    messagesEl.appendChild(bubble);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return bubble;
  }

  function addTypingBubble() {
    const bubble = createElement('div', { class: 'chat-bubble from-laura is-typing' }, '<span></span><span></span><span></span>');
    messagesEl.appendChild(bubble);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return bubble;
  }

  function addErrorBubble() {
    const bubble = createElement('div', { class: 'chat-bubble from-laura' });
    bubble.textContent = 'No pude responder justo ahora. ';
    const link = getSupportLink('Hola, vengo del chat de la web y necesito ayuda.');
    if (link) {
      const a = createElement('a', { class: 'whatsapp-fallback', href: link, target: '_blank', rel: 'noopener' });
      a.textContent = 'Escríbenos por WhatsApp →';
      bubble.appendChild(document.createElement('br'));
      bubble.appendChild(a);
    }
    messagesEl.appendChild(bubble);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  let hasGreeted = false;
  function ensureGreeting() {
    if (hasGreeted) return;
    hasGreeted = true;
    addBubble('assistant', GREETING);
  }

  on(launcher, 'click', () => {
    const isOpen = widget.classList.toggle('is-open');
    launcher.setAttribute('aria-expanded', String(isOpen));
    if (isOpen) {
      ensureGreeting();
      input.focus();
    }
  });

  on(input, 'keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      form.requestSubmit();
    }
  });

  on(form, 'submit', async (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    input.value = '';
    addBubble('user', text);
    history.push({ role: 'user', content: text });

    const typingBubble = addTypingBubble();
    const sendBtn = qs('.chat-send-btn', form);
    sendBtn.disabled = true;

    try {
      const reply = await sendChatMessage(history);
      typingBubble.remove();
      addBubble('assistant', reply);
      history.push({ role: 'assistant', content: reply });
    } catch (err) {
      console.error('[chatWidget]', err);
      typingBubble.remove();
      addErrorBubble();
    } finally {
      sendBtn.disabled = false;
    }
  });
}
