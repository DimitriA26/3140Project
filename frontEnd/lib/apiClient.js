// Single place where the frontend talks to the Express backend.
// Every service file (authService, productService, orderService, adminService)
// should go through this so the base URL, auth header, and error shape stay
// consistent across all five slices.

import { getToken } from "@/lib/tokenStorage";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

// The backend always reports failures as { error: "message" }, so we normalize
// everything into this one error type. `status` lets callers special-case
// things like 401 (expired token) or 404 (not found).
export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request(path, options = {}) {
  const { method = "GET", body, auth = false, headers = {} } = options;

  const requestHeaders = { ...headers };

  if (body !== undefined) {
    requestHeaders["Content-Type"] = "application/json";
  }

  if (auth) {
    const token = getToken();

    if (token) {
      requestHeaders.Authorization = `Bearer ${token}`;
    }
  }

  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: requestHeaders,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    // fetch only rejects when the network itself failed — usually the backend
    // is not running, which is the most common thing to hit in development.
    throw new ApiError(
      "Could not reach the server. Is the backend running?",
      0
    );
  }

  // 204 has no body to parse.
  if (response.status === 204) {
    return null;
  }

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message =
      (data && data.error) || `Request failed (${response.status})`;

    throw new ApiError(message, response.status);
  }

  return data;
}

export const apiClient = {
  get: (path, options) => request(path, { ...options, method: "GET" }),
  post: (path, body, options) =>
    request(path, { ...options, method: "POST", body }),
  put: (path, body, options) =>
    request(path, { ...options, method: "PUT", body }),
  patch: (path, body, options) =>
    request(path, { ...options, method: "PATCH", body }),
  delete: (path, options) => request(path, { ...options, method: "DELETE" }),
};
