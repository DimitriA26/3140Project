const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

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

  const url = queryString
    ? `${API_BASE_URL}/api/products?${queryString}`
    : `${API_BASE_URL}/api/products`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to load products.");
  }

  return response.json();
}