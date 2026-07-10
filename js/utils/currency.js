/**
 * js/utils/currency.js
 * Shared PEN currency formatting, ready for the product/cart/checkout
 * pages so every price on the site is formatted identically.
 */
const formatter = new Intl.NumberFormat('es-PE', {
  style: 'currency',
  currency: 'PEN',
  minimumFractionDigits: 2
});

export function formatPEN(amount) {
  const value = Number(amount);
  if (Number.isNaN(value)) return 'S/ 0.00';
  return formatter.format(value);
}
