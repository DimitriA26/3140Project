"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

import styles from "./page.module.css";
import ProtectedRoute from "@/components/ProtectedRoute";
import Spinner from "@/components/Spinner";
import ErrorBanner from "@/components/ErrorBanner";
import { formatCurrency } from "@/lib/formatCurrency";
import { getOrderById } from "@/services/orderService";

function OrderConfirmationContent() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadOrder() {
      setIsLoading(true);
      setError("");

      try {
        const data = await getOrderById(id);

        if (!cancelled) {
          setOrder(data.order);
          setItems(data.items);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Could not load this order.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadOrder();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (isLoading) {
    return <Spinner fullPage label="Loading your order…" />;
  }

  if (error || !order) {
    return (
      <div className={`container ${styles.page}`}>
        <ErrorBanner message={error || "Order not found."} />
      </div>
    );
  }

  return (
    <div className={`container ${styles.page}`}>
      <div className={styles.confirmation}>
        <CheckCircle2 size={40} className={styles.icon} strokeWidth={1.6} />
        <h1>Order confirmed</h1>
        <p>Thanks for your purchase. A summary of your order is below.</p>
      </div>

      <section className={styles.card}>
        <div className={styles.summaryHeader}>
          <div>
            <p className={styles.label}>Order</p>
            <h2>#{order.id}</h2>
          </div>

          <div>
            <p className={styles.label}>Status</p>
            <span className={styles.status}>{order.status}</span>
          </div>
        </div>

        <ul className={styles.items}>
          {items.map((item, index) => (
            <li key={`${item.name}-${index}`} className={styles.item}>
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>{formatCurrency(item.price_at_purchase * item.quantity)}</span>
            </li>
          ))}
        </ul>

        <div className={styles.total}>
          <span>Total</span>
          <strong>{formatCurrency(order.total_price)}</strong>
        </div>
      </section>

      <div className={styles.actions}>
        <Link href="/order-history" className={styles.secondary}>
          View order history
        </Link>

        <Link href="/products" className={styles.primary}>
          Continue shopping
        </Link>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <ProtectedRoute>
      <OrderConfirmationContent />
    </ProtectedRoute>
  );
}
