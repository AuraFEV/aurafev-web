/**
 * backend/server.js
 * ---------------------------------------------------------------------
 * The entire job of this service: hold ANTHROPIC_API_KEY safely on the
 * server, and proxy chat messages to Claude with Laura's system prompt.
 * One route. No database, no accounts, no orders — those belong to the
 * bigger backend described in the main README's "Backend futuro"
 * section, whenever that gets built.
 *
 * Conversation history is kept client-side (the browser sends the full
 * recent history with each request) — there is no server-side chat
 * storage in this MVP. Simple, stateless, nothing to lose if this
 * service restarts.
 * ---------------------------------------------------------------------
 */
import express from 'express';
import cors from 'cors';
import Anthropic from '@anthropic-ai/sdk';
import { buildSystemPrompt } from './systemPrompt.js';

const PORT = process.env.PORT || 3001;
// ALLOWED_ORIGIN accepts a comma-separated list, because the site is
// reachable both as www.aurafev.com and the naked aurafev.com — a
// visitor on either one needs the chat to work.
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGIN || 'https://www.aurafev.com')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
const MODEL_ID = process.env.MODEL_ID || 'claude-sonnet-5';
const MAX_OUTPUT_TOKENS = 400;
const MAX_HISTORY_MESSAGES = 20; // trims runaway-long conversations before they reach the API

if (!process.env.ANTHROPIC_API_KEY) {
  console.warn('[server] ANTHROPIC_API_KEY is not set. /api/chat will fail until it is.');
}

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const systemPrompt = buildSystemPrompt();

const app = express();
app.use(express.json({ limit: '32kb' }));
app.use(cors({
  origin(origin, callback) {
    // No origin header = server-to-server or curl/health-check calls; allow those.
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origin no permitido: ${origin}`));
    }
  }
}));

// --- very small in-memory rate limiter -------------------------------
// Good enough for this scale (single instance, low volume). If this
// service ever needs multiple instances or a real quota system, swap
// this for a shared store (e.g. Redis) — the interface below is the
// only thing that would need to change.
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX_MESSAGES = 30; // per IP, per window
const requestLog = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const timestamps = (requestLog.get(ip) || []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  timestamps.push(now);
  requestLog.set(ip, timestamps);
  return timestamps.length > RATE_LIMIT_MAX_MESSAGES;
}

app.get('/health', (_req, res) => {
  res.json({ ok: true, configured: Boolean(process.env.ANTHROPIC_API_KEY) });
});

app.post('/api/chat', async (req, res) => {
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket.remoteAddress;

  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Estoy conversando con muchas personas a la vez justo ahora 💛 Intenta de nuevo en un momento, o escríbenos por WhatsApp.' });
  }

  const { messages } = req.body || {};
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Falta el historial de conversación (messages).' });
  }

  const trimmedHistory = messages.slice(-MAX_HISTORY_MESSAGES).map((m) => ({
    role: m.role === 'assistant' ? 'assistant' : 'user',
    content: String(m.content || '').slice(0, 4000)
  }));

  try {
    const response = await anthropic.messages.create({
      model: MODEL_ID,
      max_tokens: MAX_OUTPUT_TOKENS,
      system: systemPrompt,
      messages: trimmedHistory
    });

    const text = response.content
      .map((block) => (block.type === 'text' ? block.text : ''))
      .filter(Boolean)
      .join('\n');

    res.json({ reply: text });
  } catch (err) {
    console.error('[api/chat] Anthropic API error:', err.message);
    res.status(502).json({ error: 'Se me cruzó un cable justo ahora. Intenta de nuevo en un momento, o escríbenos por WhatsApp.' });
  }
});

app.listen(PORT, () => {
  console.log(`[server] Laura backend listening on port ${PORT}`);
  console.log(`[server] Allowed origins: ${ALLOWED_ORIGINS.join(', ')}`);
  console.log(`[server] Model: ${MODEL_ID}`);
});
