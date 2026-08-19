"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus, Plus, Trash2, ArrowRight, Lock } from "lucide-react";

import styles from "./page.module.css";
import ProtectedRoute from "@/components/ProtectedRoute";
import Spinner from "@/components/Spinner";
import ErrorBanner from "@/components/ErrorBanner";
import EmptyState from "@/components/EmptyState";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/formatCurrency";

function CartContents() {
  const {
    items,
    itemCount,
    subtotal,
    isLoading,
    error,
    pendingItemIds,
    refresh,
    setQuantity,
    removeFromCart,
    checkout,
  } = useCart();

  const router = useRouter();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  async function handleCheckout() {
    setCheckoutError("");
    setIsCheckingOut(true);

    try {
      const order = await checkout();
      router.push(`/orders/${order.id}`);
    } catch (err) {
      setCheckoutError(err.message || "Could not place your order.");
      setIsCheckingOut(false);
    }
  }

  if (isLoading && items.length === 0) {
    return <Spinner fullPage label="Loading your cart…" />;
  }

  return (
    <div className={`container ${styles.page}`}>
      <header className={styles.header}>
        <h1>Your cart</h1>
        <p>
          {itemCount === 0
            ? "Nothing here yet."
            : `${itemCount} ${itemCount === 1 ? "item" : "items"}`}
        </p>
      </header>

      {error && (
        <div className={styles.alert}>
          <ErrorBanner message={error} onRetry={refresh} />
        </div>
      )}

      {items.length === 0 && !error ? (
        <EmptyState
          title="Your cart is empty"
          description="Once you add something, it will show up here ready for checkout."
          action={<Link href="/products">Browse products</Link>}
        />
      ) : (
        <div className={styles.layout}>
          <ul className={styles.items}>
            {items.map((item) => {
              const isPending = pendingItemIds.includes(item.id);

              return (
                <li key={item.id} className={styles.item} data-pending={isPending}>
                  <div className={styles.thumbnail}>
                    {item.imageUrl ? (
                      // Product images come from arbitrary URLs in the database,
                      // so next/image would need a remotePatterns entry per host.
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.imageUrl} alt={item.name} />
                    ) : (
                      <span aria-hidden="true" />
                    )}
                  </div>

                  <div className={styles.details}>
                    <h2>{item.name}</h2>
                    <span className={styles.unitPrice}>
                      {formatCurrency(item.price)} each
                    </span>
                  </div>

                  <div className={styles.quantity}>
                    <button
                      type="button"
                      aria-label={`Decrease quantity of ${item.name}`}
                      disabled={isPending || item.quantity <= 1}
                      onClick={() => setQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus size={15} strokeWidth={2} />
                    </button>

                    <span aria-live="polite">{item.quantity}</span>

                    <button
                      type="button"
                      aria-label={`Increase quantity of ${item.name}`}
                      disabled={isPending}
                      onClick={() => setQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus size={15} strokeWidth={2} />
                    </button>
                  </div>

                  <div className={styles.lineTotal}>
                    {formatCurrency(item.price * item.quantity)}
                  </div>

                  <button
                    type="button"
                    className={styles.remove}
                    aria-label={`Remove ${item.name} from cart`}
                    disabled={isPending}
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Trash2 size={16} strokeWidth={1.8} />
                  </button>
                </li>
              );
            })}
          </ul>

          <aside className={styles.summary}>
            <h2>Order summary</h2>

            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <strong>{formatCurrency(subtotal)}</strong>
            </div>

            <p className={styles.summaryNote}>
              Shipping and tax are not calculated in this project.
            </p>

            {checkoutError && <ErrorBanner message={checkoutError} />}

            <button
              type="button"
              className={styles.checkout}
              disabled={isCheckingOut || items.length === 0}
              onClick={handleCheckout}
            >
              {isCheckingOut ? "Placing order…" : "Place order"}
              {!isCheckingOut && <ArrowRight size={16} />}
            </button>

            <p className={styles.secureNote}>
              <Lock size={13} strokeWidth={1.9} />
              Your order total is calculated on the server.
            </p>

            <Link href="/products" className={styles.continue}>
              Continue shopping
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}

export default function CartPage() {
  return (
    <ProtectedRoute>
      <CartContents />
    </ProtectedRoute>
  );
}
