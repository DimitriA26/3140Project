// Talks to /api/auth on the backend.
// Prefer using the `useAuth()` hook in components — it wraps these calls and
// keeps the shared currentUser state in sync. Use this module directly only if
// you need a one-off call outside of React.

import { apiClient } from "@/lib/apiClient";
import { clearToken, getToken, setToken } from "@/lib/tokenStorage";

// POST /api/auth/register
//
// Note: the backend's register endpoint returns the new user but NOT a token,
// so we immediately log in afterwards. That way registering signs you in,
// which is what both the register page and the plan expect.
export async function register({ name, email, password }) {
  await apiClient.post("/api/auth/register", { name, email, password });

  return login({ email, password });
}

// POST /api/auth/login -> { token, user }
export async function login({ email, password }) {
  const data = await apiClient.post("/api/auth/login", { email, password });

  if (data && data.token) {
    setToken(data.token);
  }

  return data.user;
}

// GET /api/auth/me -> { user }
// Returns null when there is no stored token, so callers can treat "signed out"
// and "token rejected" the same way.
export async function getCurrentUser() {
  if (!getToken()) {
    return null;
  }

  const data = await apiClient.get("/api/auth/me", { auth: true });

  return data.user;
}

export function logout() {
  clearToken();
}
