"use client";

// Global cart state. Mounted in app/layout.js inside <AuthProvider> because the
// cart API requires a signed-in user.
//
//   const { items, itemCount, subtotal, addToCart } = useCart();
//
// The cart loads when someone signs in and clears when they sign out, so the
// header badge is always correct without each page refetching.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import * as cartService from "@/services/cartService";
import { useAuth } from "@/context/AuthContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isAuthenticated, isLoading: authLoading, signOut } = useAuth();

  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  // Item ids with a request in flight, so rows can disable their own controls
  // instead of freezing the whole page.
  const [pendingItemIds, setPendingItemIds] = useState([]);

  // A 401 here means the token expired while the tab was open. Sign out so the
  // rest of the app agrees about who is logged in.
  const handleError = useCallback(
    (err) => {
      if (err?.status === 401) {
        signOut();
        return;
      }

      setError(err?.message || "Something went wrong with your cart.");
    },
    [signOut]
  );

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const cart = await cartService.getCart();
      setItems(cart.items);
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  // Load on sign-in, clear on sign-out. Waits for the auth restore to finish so
  // we do not fire a request before we know whether there is a token.
  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!isAuthenticated) {
      setItems([]);
      setError("");
      return;
    }

    refresh();
  }, [authLoading, isAuthenticated, refresh]);

  function markPending(itemId, pending) {
    setPendingItemIds((current) =>
      pending
        ? [...current, itemId]
        : current.filter((id) => id !== itemId)
    );
  }

  // Adding returns only the cart_items row, with no product name or price, so
  // we refetch to get a complete cart back.
  const addToCart = useCallback(
    async (productId, quantity = 1) => {
      setError("");

      try {
        await cartService.addItem(productId, quantity);
        await refresh();
        return true;
      } catch (err) {
        handleError(err);
        return false;
      }
    },
    [handleError, refresh]
  );

  const setQuantity = useCallback(
    async (itemId, quantity) => {
      if (quantity < 1) {
        return false;
      }

      setError("");
      markPending(itemId, true);

      // Update locally first so the stepper feels immediate, then roll back if
      // the request fails.
      const previous = items;

      setItems((current) =>
        current.map((item) =>
          item.id === itemId ? { ...item, quantity } : item
        )
      );

      try {
        await cartService.updateItemQuantity(itemId, quantity);
        return true;
      } catch (err) {
        setItems(previous);
        handleError(err);
        return false;
      } finally {
        markPending(itemId, false);
      }
    },
    [handleError, items]
  );

  const removeFromCart = useCallback(
    async (itemId) => {
      setError("");
      markPending(itemId, true);

      const previous = items;

      setItems((current) => current.filter((item) => item.id !== itemId));

      try {
        await cartService.removeItem(itemId);
        return true;
      } catch (err) {
        setItems(previous);
        handleError(err);
        return false;
      } finally {
        markPending(itemId, false);
      }
    },
    [handleError, items]
  );

  // Returns the created order so the cart page can route to it.
  const checkout = useCallback(async () => {
    setError("");

    const order = await cartService.checkout();

    // The backend empties the cart as part of creating the order.
    setItems([]);

    return order;
  }, []);

  const itemCount = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((total, item) => total + item.price * item.quantity, 0),
    [items]
  );

  const value = {
    items,
    itemCount,
    subtotal,
    isLoading,
    error,
    pendingItemIds,
    refresh,
    addToCart,
    setQuantity,
    removeFromCart,
    checkout,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (context === null) {
    throw new Error("useCart must be used inside a <CartProvider>");
  }

  return context;
}
