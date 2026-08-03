/**
 * backend/knowledge.js
 * ---------------------------------------------------------------------
 * Builds Laura's grounding context directly from the SAME JSON files
 * the website itself uses to render its content (js/data/*.json, one
 * directory up). This is deliberate: there is exactly one source of
 * truth for "what Aura Fev's site says" — if an occasion, FAQ answer,
 * packaging item, or catalog price/variant changes there, Laura's
 * knowledge changes with it automatically on the next deploy. Nothing
 * is duplicated by hand.
 *
 * products.json only ever contains public-safe fields (price, name,
 * description, variants) — no internal costs — so including it here
 * is safe by construction, not something this file needs to filter.
 *
 * Deliberately NOT included: testimonials.json. Those are known
 * placeholder copy (not real customer testimonials yet — see the main
 * README), and Laura must never repeat them as if they were real
 * quotes from real customers.
 * ---------------------------------------------------------------------
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, '..', 'js', 'data');

function loadJSON(filename) {
  const raw = readFileSync(path.join(dataDir, filename), 'utf8');
  return JSON.parse(raw);
}

function buildKnowledgeText() {
  const occasions = loadJSON('occasions.json');
  const whyCards = loadJSON('why-cards.json');
  const packaging = loadJSON('packaging.json');
  const faq = loadJSON('faq.json');
  const paymentMethods = loadJSON('payment-methods.json');
  const products = loadJSON('products.json');

  const occasionsText = occasions.map((o) => `- ${o.label}`).join('\n');
  const whyText = whyCards.map((w) => `- ${w.title}: ${w.text}`).join('\n');
  const packagingText = packaging.map((p) => `- ${p.title}: ${p.text}`).join('\n');
  const faqText = faq.map((f) => `P: ${f.q}\nR: ${f.a}`).join('\n\n');
  const paymentText = paymentMethods.map((p) => p.label).join(', ');

  const productsText = products.map((p) => {
    const variantsText = p.variants
      .map((v) => `${v.label}${v.priceOverride && v.priceOverride !== p.price ? ` (S/${v.priceOverride})` : ''}`)
      .join(', ');
    const messagesText = Array.isArray(p.messageOptions)
      ? `\n  Mensaje personalizado disponible hoy: ${p.messageOptions.filter((m) => m.available).map((m) => m.label).join(', ') || 'ninguno todavía'}. Las demás opciones del selector (${p.messageOptions.filter((m) => !m.available).map((m) => m.label).join(', ')}) aparecen pero NO están disponibles todavía — no ofrecerlas como si ya se pudieran elegir.`
      : '';
    return `- ${p.line} (S/${p.price})${p.badge ? ` — ${p.badge}` : ''}: ${p.tagline} Incluye: ${p.includes.join(', ')}. Variantes: ${variantsText}. Ficha: /producto.html?linea=${p.slug}${messagesText}`;
  }).join('\n');

  return `
CATÁLOGO PUBLICADO (5 líneas, cada una con variantes — SÍ puedes hablar de precios y composición con confianza, es la información real del sitio):
${productsText}

Cada línea tiene su propia página con selector de variante y botón "Agregar al carrito" (el carrito funciona y se guarda en el navegador de la persona). El pago todavía se coordina de forma manual por WhatsApp / Yape / Plin — no hay checkout automático con tarjeta todavía, así que para cerrar una compra siempre conviene invitar a WhatsApp.

OCASIONES QUE CUBRE AURA FEV:
${occasionsText}

POR QUÉ ELEGIR AURA FEV (experiencia, no solo producto):
${whyText}

EXPERIENCIA DE EMPAQUE:
${packagingText}

PREGUNTAS FRECUENTES:
${faqText}

MÉTODOS DE PAGO PREVISTOS (nota: mostrados en el sitio, integración de cobro real todavía en construcción):
${paymentText}
`.trim();
}

export function getKnowledgeText() {
  return buildKnowledgeText();
}
