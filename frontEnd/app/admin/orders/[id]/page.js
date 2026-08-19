"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import styles from "./page.module.css";
import AdminRoute from "@/components/AdminRoute";
import {
  getOrderById,
  updateOrderStatus,
} from "@/services/adminService";

const STATUS_OPTIONS = ["pending", "confirmed", "shipped", "delivered"];

function AdminOrderDetailContent() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      return;
    }

    let cancelled = false;

    async function fetchOrder() {
      try {
        const data = await getOrderById(id);

        if (!cancelled) {
          setOrder(data.order || null);
          setItems(data.items || []);
          setCustomer(data.customer || null);
          setError("");
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Could not load order.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    fetchOrder();

    return () => {
      cancelled = true;
    };
  }, [id]);

  async function handleStatusChange(status) {
    setIsUpdating(true);
    setError("");

    try {
      const data = await updateOrderStatus(id, status);

      setOrder((current) =>
        current
          ? {
              ...current,
              status: data.order.status,
            }
          : current
      );
    } catch (err) {
      setError(err.message || "Could not update order status.");
    } finally {
      setIsUpdating(false);
    }
  }

  if (isLoading) {
    return (
      <main className={styles.page}>
        <p className={styles.message}>Loading order...</p>
      </main>
    );
  }

  if (error && !order) {
    return (
      <main className={styles.page}>
        <div className={styles.error}>{error}</div>
        <Link href="/admin/orders">Back to orders</Link>
      </main>
    );
  }

  if (!order) {
    return (
      <main className={styles.page}>
        <p className={styles.message}>Order not found.</p>
        <Link href="/admin/orders">Back to orders</Link>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.topBar}>
        <div>
          <Link href="/admin/orders" className={styles.backLink}>
            ← Back to orders
          </Link>

          <h1>Order #{order.id}</h1>

          <p>
            Placed{" "}
            {order.created_at
              ? new Date(order.created_at).toLocaleString()
              : "Unknown date"}
          </p>
        </div>

        <label className={styles.statusControl}>
          Status
          <select
            value={order.status}
            disabled={isUpdating}
            onChange={(event) =>
              handleStatusChange(event.target.value)
            }
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <section className={styles.card}>
        <h2>Customer</h2>

        <dl className={styles.infoGrid}>
          <div>
            <dt>Name</dt>
            <dd>
              {customer?.name ||
                order.customer_name ||
                "Not available"}
            </dd>
          </div>

          <div>
            <dt>Email</dt>
            <dd>
              {customer?.email ||
                order.customer_email ||
                "Not available"}
            </dd>
          </div>

          <div>
            <dt>Address</dt>
            <dd>
              {customer?.address ||
                order.customer_address ||
                "Not available"}
            </dd>
          </div>
        </dl>
      </section>

      <section className={styles.card}>
        <h2>Order Items</h2>

        {items.length === 0 ? (
          <p>No order items found.</p>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>

              <tbody>
                {items.map((item, index) => {
                  const price = Number(
                    item.price_at_purchase ?? item.price ?? 0
                  );

                  const quantity = Number(item.quantity || 0);

                  return (
                    <tr key={item.id || index}>
                      <td>
                        {item.name ||
                          item.product_name ||
                          `Product ${index + 1}`}
                      </td>

                      <td>{quantity}</td>

                      <td>${price.toFixed(2)}</td>

                      <td>${(price * quantity).toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className={styles.card}>
        <h2>Order Summary</h2>

        <div className={styles.summary}>
          <span>Total</span>

          <strong>
            ${Number(order.total_price || 0).toFixed(2)}
          </strong>
        </div>
      </section>
    </main>
  );
}

export default function AdminOrderDetailPage() {
  return (
    <AdminRoute>
      <AdminOrderDetailContent />
    </AdminRoute>
  );
}