#!/usr/bin/env node
/**
 * scripts/generate-config.js
 * ---------------------------------------------------------------------
 * Build-time step run by Render (see render.yaml -> buildCommand).
 *
 * Reads a whitelist of PUBLIC environment variables and writes them to
 * js/config/config.js as a frozen object on `window.__AURA_CONFIG__`.
 * This is how the static site reads configuration without a single
 * value being hardcoded in the repository.
 *
 * SECURITY: PUBLIC_KEYS below is an allow-list, not a deny-list, on
 * purpose. A variable only ever reaches the browser if its name is
 * explicitly added here. Never add a secret (API token, client secret,
 * access token) to this list — see .env.example for which variables are
 * public vs. server-only.
 * ---------------------------------------------------------------------
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PUBLIC_KEYS = [
  'SITE_URL',
  'SITE_NAME',
  'WHATSAPP_NUMBER',
  'API_BASE_URL',
  'PAYMENT_CARD_GATEWAY',
  'GA_MEASUREMENT_ID',
  'ENABLE_PAYMENT_VISA',
  'ENABLE_PAYMENT_MASTERCARD',
  'ENABLE_PAYMENT_YAPE',
  'ENABLE_PAYMENT_PLIN',
  'ENABLE_PAYMENT_PAYPAL',
  'ENABLE_PAYMENT_IZIPAY',
  'ENABLE_PAYMENT_NIUBIZ',
  // Public identifiers only — the matching *_SECRET_KEY variables for
  // these providers must never be added to this list.
  'IZIPAY_PUBLIC_KEY',
  'NIUBIZ_MERCHANT_ID',
  'PAYPAL_CLIENT_ID',
  'YAPE_MERCHANT_CODE',
  'PLIN_MERCHANT_CODE'
];

const DEFAULTS = {
  SITE_URL: 'https://www.aurafev.com',
  SITE_NAME: 'Aura Fev',
  PAYMENT_CARD_GATEWAY: 'izipay',
  ENABLE_PAYMENT_VISA: 'true',
  ENABLE_PAYMENT_MASTERCARD: 'true',
  ENABLE_PAYMENT_YAPE: 'true',
  ENABLE_PAYMENT_PLIN: 'true',
  ENABLE_PAYMENT_PAYPAL: 'false',
  ENABLE_PAYMENT_IZIPAY: 'true',
  ENABLE_PAYMENT_NIUBIZ: 'false'
};

const config = {};
for (const key of PUBLIC_KEYS) {
  config[key] = process.env[key] ?? DEFAULTS[key] ?? '';
}

const banner = `// AUTO-GENERATED at build time by scripts/generate-config.js — do not edit by hand.
// Only PUBLIC_KEYS (see that file) are ever written here; secrets stay server-side.
`;

const output = `${banner}window.__AURA_CONFIG__ = Object.freeze(${JSON.stringify(config, null, 2)});\n`;

const outPath = path.join(__dirname, '..', 'js', 'config', 'config.js');
fs.writeFileSync(outPath, output, 'utf8');

console.log(`[generate-config] Wrote ${PUBLIC_KEYS.length} public config values to ${path.relative(process.cwd(), outPath)}`);
