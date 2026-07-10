/**
 * js/services/cart/cartService.js
 * MVP cart, backed by localStorage so "add to cart" works today with no
 * backend. The public interface (getCart/addItem/removeItem/setQuantity/
 * clearCart) is deliberately backend-agnostic: swapping the storage
 * layer for apiClient calls later (POST /cart, PATCH /cart/:itemId,
 * ...) will not require touching any calling code, since callers only
 * ever see this interface.
 *
 * Emits a `cart:updated` CustomEvent on `window` after every mutation so
 * UI (cart badge, mini-cart) can stay in sync without polling.
 */
const STORAGE_KEY = 'aurafev:cart';

function read() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('[cartService] Failed to read cart from storage', err);
    return [];
  }
}

function write(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('[cartService] Failed to persist cart', err);
  }
  window.dispatchEvent(new CustomEvent('cart:updated', { detail: { items } }));
}

/** @typedef {{ id: string, name: string, price: number, quantity: number, image?: string, giftMessage?: string }} CartItem */

/** @returns {CartItem[]} */
export function getCart() {
  return read();
}

/** @returns {number} */
export function getItemCount() {
  return read().reduce((total, item) => total + item.quantity, 0);
}

/** @returns {number} */
export function getSubtotal() {
  return read().reduce((total, item) => total + item.price * item.quantity, 0);
}

/** @param {CartItem} item */
export function addItem(item) {
  const items = read();
  const existing = items.find((i) => i.id === item.id);
  if (existing) {
    existing.quantity += item.quantity || 1;
  } else {
    items.push({ quantity: 1, ...item });
  }
  write(items);
  return items;
}

export function setQuantity(id, quantity) {
  let items = read();
  if (quantity <= 0) {
    items = items.filter((i) => i.id !== id);
  } else {
    const target = items.find((i) => i.id === id);
    if (target) target.quantity = quantity;
  }
  write(items);
  return items;
}

export function removeItem(id) {
  const items = read().filter((i) => i.id !== id);
  write(items);
  return items;
}

export function clearCart() {
  write([]);
}
