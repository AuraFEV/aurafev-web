/**
 * js/services/analytics/analyticsService.js
 * Thin wrapper around Google Analytics 4 (gtag.js). No-ops safely if
 * GA_MEASUREMENT_ID isn't configured, so the rest of the app can call
 * trackEvent() unconditionally without checking config first.
 *
 * Swap or extend this file when adding Meta Pixel, server-side
 * analytics, etc. — callers only ever see trackPageView/trackEvent.
 */
import { config } from '../../config/index.js';

let initialized = false;

export function initAnalytics() {
  const id = config.GA_MEASUREMENT_ID;
  if (!id || initialized) return;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', id, { send_page_view: false });

  initialized = true;
}

export function trackPageView(path = window.location.pathname) {
  if (!initialized || !window.gtag) return;
  window.gtag('event', 'page_view', { page_path: path });
}

/** @param {string} name @param {Record<string, unknown>} [params] */
export function trackEvent(name, params = {}) {
  if (!initialized || !window.gtag) return;
  window.gtag('event', name, params);
}
