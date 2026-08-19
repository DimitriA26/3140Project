// Talks to /api/cart, plus the checkout call that turns a cart into an order.
//
// Note on ownership: reading order history lives in the order-history slice's
// orderService.js. `checkout` lives here instead because it is the cart's
// terminal action, and keeping it here avoids two branches editing the same file.
//
// Prefer the `useCart()` hook in components — it wraps these and keeps the
// header badge in sync.

import { apiClient } from "@/lib/apiClient";

// The API returns raw Postgres rows, so snake_case with NUMERIC prices arriving
// as strings. Normalize once here so no page has to think about it.
function normalizeItem(row) {
  return {
    id: row.id,
    productId: row.product_id,
    name: row.name,
    price: Number(row.price),
    imageUrl: row.image_url,
    quantity: Number(row.quantity),
  };
}

// GET /api/cart -> { cartId, items }
export async function getCart() {
  const data = await apiClient.get("/api/cart", { auth: true });

  return {
    cartId: data.cartId,
    items: (data.items || []).map(normalizeItem),
  };
}

// POST /api/cart/items
// The backend merges quantities when the product is already in the cart.
export async function addItem(productId, quantity = 1) {
  return apiClient.post(
    "/api/cart/items",
    { productId, quantity },
    { auth: true }
  );
}

// PUT /api/cart/items/:itemId
export async function updateItemQuantity(itemId, quantity) {
  return apiClient.put(
    `/api/cart/items/${itemId}`,
    { quantity },
    { auth: true }
  );
}

// DELETE /api/cart/items/:itemId
export async function removeItem(itemId) {
  return apiClient.delete(`/api/cart/items/${itemId}`, { auth: true });
}

// POST /api/orders -> { order }
// Checks out whatever is currently in the cart. The backend recalculates the
// total from database prices and empties the cart, so never send a total.
export async function checkout() {
  const data = await apiClient.post("/api/orders", {}, { auth: true });

  return data.order;
}
