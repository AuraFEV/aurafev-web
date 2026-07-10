/**
 * js/utils/icons.js
 * Centralized line-icon library. Every icon is a minimal 24x24 stroke
 * drawing that inherits color via `currentColor`, so a single source of
 * truth styles every icon on the site — no icon font, no icon library
 * dependency, no duplicated inline SVG markup across render modules.
 */
const PATHS = {
  heart: '<path d="M12 21s-7.5-4.6-10-9.3C.4 8.1 2.3 4 6.2 4c2.1 0 3.7 1.2 4.8 3 1.1-1.8 2.7-3 4.8-3 3.9 0 5.8 4.1 4.2 7.7C19.5 16.4 12 21 12 21z"/>',
  cake: '<path d="M4 21h16v-8H4v8zM4 13l8-6 8 6M12 3v4"/>',
  graduation: '<path d="M2 9l10-5 10 5-10 5-10-5zM6 11.5V17c0 1.1 2.7 3 6 3s6-1.9 6-3v-5.5"/>',
  mother: '<circle cx="12" cy="6" r="3"/><path d="M12 9v3M8 20c0-4 2-6 4-6s4 2 4 6"/>',
  father: '<circle cx="12" cy="6" r="3"/><path d="M12 9v2l-2 9h4l-2-9"/>',
  baby: '<circle cx="12" cy="9" r="4"/><path d="M9 3.5c1 1 3 1 4 0M8 21c0-3.5 1.8-6 4-6s4 2.5 4 6"/>',
  rings: '<circle cx="9" cy="12" r="5"/><circle cx="15" cy="12" r="5"/>',
  tree: '<path d="M12 2v20M6 8l6-6 6 6M4 14l8-7 8 7M2 20l10-8 10 8"/>',
  'gift-corporate': '<rect x="3" y="8" width="18" height="12" rx="1"/><path d="M3 12h18M12 8V6a2 2 0 1 1 2 2h-2zM12 8V6a2 2 0 1 0-2 2h2z"/>',
  package: '<rect x="3" y="8" width="18" height="13" rx="1"/><path d="M3 8l9-5 9 5M12 8v13"/>',
  message: '<path d="M4 4h16v13H8l-4 4V4z"/><path d="M8 9h8M8 12h5"/>',
  truck: '<path d="M3 12l4-8h10l4 8-9 9-9-9z"/><path d="M3 12h18"/>',
  shield: '<path d="M12 2l7 4v6c0 5-3.5 8-7 10-3.5-2-7-5-7-10V6l7-4z"/>',
  gem: '<circle cx="12" cy="9" r="5"/><path d="M9 13.5L7 21l5-3 5 3-2-7.5"/>',
  support: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/>',
  box: '<rect x="3" y="9" width="18" height="12" rx="1"/><path d="M3 9l9-6 9 6M12 3v18"/>',
  bag: '<path d="M6 8h12l-1.2 13H7.2L6 8z"/><path d="M9 8a3 3 0 0 1 6 0M6 8h12"/>',
  pouch: '<path d="M7 10a5 5 0 0 1 10 0v10H7V10z"/><path d="M9 9h6"/>',
  card: '<rect x="3" y="5" width="18" height="14" rx="1.5"/><path d="M3 9h18M8 14h4"/>',
  ribbon: '<path d="M12 3v4M8 5l4 2 4-2M4 21c4-3 12-3 16 0M12 7c-3 3-3 9 0 14 3-5 3-11 0-14z"/>',
  wrap: '<path d="M4 8c4-2 12-2 16 0M4 16c4 2 12 2 16 0M4 8v8M20 8v8"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
  cart: '<path d="M6 8h12l-1 12H7L6 8z"/><path d="M9 8a3 3 0 0 1 6 0"/>',
  lock: '<rect x="5" y="11" width="14" height="9" rx="1.5"/><path d="M8 11V7a4 4 0 1 1 8 0v4"/>',
  instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none"/>',
  tiktok: '<path d="M14 3v11a3 3 0 1 1-3-3"/><path d="M14 3c0 3 2 5 5 5"/>',
  facebook: '<path d="M15 3h-2a4 4 0 0 0-4 4v3H7v4h2v7h4v-7h3l1-4h-4V7a1 1 0 0 1 1-1h3V3z"/>',
  chevron: '<path d="M9 6l6 6-6 6"/>'
};

/**
 * Returns an inline <svg> string for the given icon name.
 * @param {string} name - key from PATHS
 * @param {string} [className] - extra class(es) applied to the <svg>
 */
export function icon(name, className = '') {
  const inner = PATHS[name];
  if (!inner) {
    console.warn(`[icons] Unknown icon "${name}"`);
    return '';
  }
  return `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true">${inner}</svg>`;
}

export const availableIcons = Object.keys(PATHS);
