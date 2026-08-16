"use client";

// Drop this on a product card or product detail page:
//
//   <AddToCartButton productId={product.id} inventory={product.inventory} />
//
// Handles the signed-out case by sending people to login and back, so callers
// do not need to know anything about auth.

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Check, ShoppingBag } from "lucide-react";

import styles from "./AddToCartButton.module.css";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

export default function AddToCartButton({
  productId,
  quantity = 1,
  inventory = null,
  label = "Add to cart",
}) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { addToCart } = useCart();
  const router = useRouter();
  const pathname = usePathname();

  const [status, setStatus] = useState("idle"); // idle | adding | added

  const outOfStock = inventory !== null && Number(inventory) <= 0;

  async function handleClick() {
    if (!isAuthenticated) {
      router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    setStatus("adding");

    const succeeded = await addToCart(productId, quantity);

    if (!succeeded) {
      setStatus("idle");
      return;
    }

    // Brief confirmation, then back to normal. The cart error itself surfaces
    // through useCart().error wherever the caller chooses to render it.
    setStatus("added");
    setTimeout(() => setStatus("idle"), 1800);
  }

  if (outOfStock) {
    return (
      <button type="button" className={styles.button} disabled>
        Out of stock
      </button>
    );
  }

  return (
    <button
      type="button"
      className={`${styles.button} ${status === "added" ? styles.added : ""}`}
      onClick={handleClick}
      disabled={authLoading || status === "adding"}
    >
      {status === "added" ? (
        <>
          <Check size={16} strokeWidth={2.2} />
          Added
        </>
      ) : (
        <>
          <ShoppingBag size={16} strokeWidth={1.9} />
          {status === "adding" ? "Adding…" : label}
        </>
      )}
    </button>
  );
}
