"use client";

// Global "who is signed in" state. Mounted once in app/layout.js so every page
// can read it with useAuth().
//
//   const { currentUser, isLoading, signIn, signUp, signOut } = useAuth();
//
// currentUser is { id, email, name, role } or null.
// isLoading is true only while we are restoring the session on first load —
// check it before deciding someone is signed out, otherwise protected pages
// will bounce people to the login screen on every refresh.

import { createContext, useCallback, useContext, useEffect, useState } from "react";

import * as authService from "@/services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // On first mount, try to restore the session from the stored token.
  // If the token is missing, expired, or rejected, we quietly sign out.
  useEffect(() => {
    let cancelled = false;

    async function restoreSession() {
      try {
        const user = await authService.getCurrentUser();

        if (!cancelled) {
          setCurrentUser(user);
        }
      } catch {
        if (!cancelled) {
          authService.logout();
          setCurrentUser(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    restoreSession();

    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = useCallback(async ({ email, password }) => {
    const user = await authService.login({ email, password });
    setCurrentUser(user);
    return user;
  }, []);

  const signUp = useCallback(async ({ name, email, password }) => {
    const user = await authService.register({ name, email, password });
    setCurrentUser(user);
    return user;
  }, []);

  const signOut = useCallback(() => {
    authService.logout();
    setCurrentUser(null);
  }, []);

  const value = {
    currentUser,
    isLoading,
    isAuthenticated: currentUser !== null,
    isAdmin: currentUser?.role === "admin",
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === null) {
    throw new Error("useAuth must be used inside an <AuthProvider>");
  }

  return context;
}
