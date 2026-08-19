import { apiClient } from "@/lib/apiClient";

export async function getAllOrders({ status, sort } = {}) {
  const params = new URLSearchParams();

  if (status) {
    params.set("status", status);
  }

  if (sort) {
    params.set("sort", sort);
  }

  const query = params.toString();

  return apiClient.get(
    query ? `/api/admin/orders?${query}` : "/api/admin/orders",
    { auth: true }
  );
}

export async function getOrderById(orderId) {
  return apiClient.get(`/api/admin/orders/${orderId}`, {
    auth: true,
  });
}

export async function updateOrderStatus(orderId, status) {
  return apiClient.patch(
    `/api/admin/orders/${orderId}/status`,
    { status },
    { auth: true }
  );
}