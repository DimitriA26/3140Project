// Small wrapper around localStorage for the auth token.
// Everything here is guarded with a `typeof window` check because Next renders
// these modules on the server too, where localStorage does not exist.

const TOKEN_KEY = "nexa_token";

export function getToken() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    // Private browsing modes can throw on localStorage access.
    return null;
  }
}

export function setToken(token) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // Nothing we can do — the user just will not stay signed in.
  }
}

export function clearToken() {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.removeItem(TOKEN_KEY);
  } catch {
    // Ignore.
  }
}
