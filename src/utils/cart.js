const KEY = "cbc_cart";

export function getCart() {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}

function emit() { window.dispatchEvent(new CustomEvent("cbc-cart-updated")); }

export function addToCart(product, quantity = 1) {
  const cart = getCart();
  const id = product.productId;
  const existing = cart.find((item) => item.productId === id);
  const max = Number(product.stock || 999);
  if (existing) existing.quantity = Math.min(max, existing.quantity + quantity);
  else cart.push({ productId: id, name: product.name, price: Number(product.price), labelledPrice: Number(product.labelledPrice), images: product.images || [], quantity: Math.min(max, quantity), stock: max });
  localStorage.setItem(KEY, JSON.stringify(cart)); emit(); return cart;
}

export function removeFromCart(productId) {
  const next = getCart().filter((item) => item.productId !== productId);
  localStorage.setItem(KEY, JSON.stringify(next)); emit(); return next;
}

export function updateCartQuantity(productId, quantity) {
  const next = getCart().map((item) => item.productId === productId ? { ...item, quantity: Math.max(1, Math.min(Number(item.stock || 999), quantity)) } : item);
  localStorage.setItem(KEY, JSON.stringify(next)); emit(); return next;
}

export function clearCart() { localStorage.removeItem(KEY); emit(); }
export function cartCount() { return getCart().reduce((sum, item) => sum + Number(item.quantity || 0), 0); }
export function cartTotal() { return getCart().reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0); }
