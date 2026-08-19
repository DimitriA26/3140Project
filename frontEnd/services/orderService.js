// Talks to /api/orders for the signed-in customer's own order history.
// Checkout itself lives in cartService.js — see the note there.
import { apiClient } from "@/lib/apiClient";

// GET /api/orders/my-orders -> { orders }
export async function getMyOrders() {
  const data = await apiClient.get("/api/orders/my-orders", { auth: true });
  return data.orders;
}

// GET /api/orders/:id -> { order, items }
export async function getOrderById(id) {
  return apiClient.get(`/api/orders/${id}`, { auth: true });
}
