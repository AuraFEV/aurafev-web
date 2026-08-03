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
import { isChatConfigured, sendChatMessage, getPageContext } from '../services/chat/chatService.js';
import { getSupportLink } from '../services/whatsapp/whatsappService.js';

const GREETING = '¡Hola! Soy Laura, la asesora virtual de Aura Fev 💛 ¿Para qué ocasión estás pensando regalar algo?';

/**
 * Laura's replies come back as plain text from Claude, but she
 * naturally writes **bold** and drops page links like
 * /producto.html?linea=signature. The chat bubble used to render both
 * as literal characters (textContent). This escapes the text first
 * (so nothing from the model can inject arbitrary markup), then
 * enables exactly two safe patterns: **bold** and links to this
 * site's own product/catalog pages.
 */
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatLauraMessage(text) {
  let safe = escapeHtml(text);
  safe = safe.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  safe = safe.replace(/(https?:\/\/[^\s]+)/g, (url) => `<a href="${url}" target="_blank" rel="noopener">${url}</a>`);
  safe = safe.replace(/(^|[\s(])(\/(?:producto|catalogo)\.html[^\s)]*)/g, (_m, pre, path) => `${pre}<a href="${path}">${path}</a>`);
  return safe;
}

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
        <div class="chat-whatsapp-bar" id="chatWhatsappBar" hidden>
          <a href="#" id="chatWhatsappLink" target="_blank" rel="noopener">
            ${icon('chat-bubble')}
            <span>¿Prefieres hablar directo? Escríbenos por WhatsApp</span>
          </a>
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
  const whatsappBar = qs('#chatWhatsappBar', root);
  const whatsappLink = qs('#chatWhatsappLink', root);

  function buildWhatsappMessage() {
    const userMessages = history.filter((m) => m.role === 'user').map((m) => m.content);
    if (userMessages.length === 0) {
      return 'Hola, vengo del chat de la web de Aura Fev.';
    }
    // Carry what the person already told Laura, so they don't have to
    // retype it for a human. Capped so the WhatsApp link doesn't break.
    const resumen = userMessages.slice(-3).join(' / ').slice(0, 300);
    return `Hola, vengo del chat de la web de Aura Fev. Le comenté a Laura: "${resumen}"`;
  }

  function refreshWhatsappLink() {
    const href = getSupportLink(buildWhatsappMessage());
    if (href) {
      whatsappLink.href = href;
      whatsappBar.hidden = false;
    }
  }

  refreshWhatsappLink();

  function addBubble(role, text) {
    const bubble = createElement('div', { class: `chat-bubble from-${role === 'user' ? 'user' : 'laura'}` });
    if (role === 'user') {
      bubble.textContent = text;
    } else {
      bubble.innerHTML = formatLauraMessage(text);
    }
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
    bubble.textContent = '¡Uy, se me cruzó un cable justo ahora! 💛 No quiero dejarte sin respuesta — ';
    const link = getSupportLink(buildWhatsappMessage());
    if (link) {
      const a = createElement('a', { class: 'whatsapp-fallback', href: link, target: '_blank', rel: 'noopener' });
      a.textContent = 'sigamos por WhatsApp →';
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
    // Also add it to history — otherwise Claude has no idea a greeting
    // was already shown and re-introduces itself on the first reply.
    history.push({ role: 'assistant', content: GREETING });
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
    refreshWhatsappLink();

    const typingBubble = addTypingBubble();
    const sendBtn = qs('.chat-send-btn', form);
    sendBtn.disabled = true;

    try {
      const reply = await sendChatMessage(history, getPageContext());
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
