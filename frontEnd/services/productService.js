// Talks to /api/products — public catalog browsing, search, filter, and sort.
import { apiClient } from "@/lib/apiClient";

// GET /api/products?search=&category=&minPrice=&maxPrice=&inStock=&sort=&page=&limit=
export async function getProducts(filters = {}) {
  const params = new URLSearchParams();

  if (filters.search) {
    params.set("search", filters.search);
  }

  if (filters.category) {
    params.set("category", filters.category);
  }

  if (filters.minPrice) {
    params.set("minPrice", filters.minPrice);
  }

  if (filters.maxPrice) {
    params.set("maxPrice", filters.maxPrice);
  }

  if (filters.inStock) {
    params.set("inStock", "true");
  }

  if (filters.sort) {
    params.set("sort", filters.sort);
  }

  if (filters.page) {
    params.set("page", filters.page);
  }

  if (filters.limit) {
    params.set("limit", filters.limit);
  }

  const queryString = params.toString();

  return apiClient.get(
    queryString ? `/api/products?${queryString}` : "/api/products"
  );
}

// GET /api/products/categories -> { categories }
export async function getCategories() {
  const data = await apiClient.get("/api/products/categories");
  return data.categories;
}

// GET /api/products/:id -> { product }
export async function getProductById(id) {
  const data = await apiClient.get(`/api/products/${id}`);
  return data.product;
}

// POST /api/products  (admin only) -> { product }
export async function createProduct(product) {
  const data = await apiClient.post("/api/products", product, { auth: true });
  return data.product;
}

// PUT /api/products/:id  (admin only) -> { product }
export async function updateProduct(id, product) {
  const data = await apiClient.put(`/api/products/${id}`, product, { auth: true });
  return data.product;
}

// DELETE /api/products/:id  (admin only)
export async function deleteProduct(id) {
  return apiClient.delete(`/api/products/${id}`, { auth: true });
}
