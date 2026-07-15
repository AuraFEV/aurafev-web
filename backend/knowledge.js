/**
 * backend/knowledge.js
 * ---------------------------------------------------------------------
 * Builds Laura's grounding context directly from the SAME JSON files
 * the website itself uses to render its content (js/data/*.json, one
 * directory up). This is deliberate: there is exactly one source of
 * truth for "what Aura Fev's site says" — if a occasion, FAQ answer or
 * packaging item changes there, Laura's knowledge changes with it
 * automatically on the next deploy. Nothing is duplicated by hand.
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

  const occasionsText = occasions.map((o) => `- ${o.label}`).join('\n');
  const whyText = whyCards.map((w) => `- ${w.title}: ${w.text}`).join('\n');
  const packagingText = packaging.map((p) => `- ${p.title}: ${p.text}`).join('\n');
  const faqText = faq.map((f) => `P: ${f.q}\nR: ${f.a}`).join('\n\n');
  const paymentText = paymentMethods.map((p) => p.label).join(', ');

  return `
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
