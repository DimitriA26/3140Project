"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import styles from "./page.module.css";
import { getAllOrders, updateOrderStatus } from "@/services/adminService";

const STATUS_OPTIONS = ["pending", "confirmed", "shipped", "delivered"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [sort, setSort] = useState("date-desc");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function fetchOrders() {
      try {
        const data = await getAllOrders({
          status: statusFilter,
          sort,
        });

        if (!cancelled) {
          setOrders(data.orders || []);
          setError("");
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Could not load orders.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    fetchOrders();

    return () => {
      cancelled = true;
    };
  }, [statusFilter, sort]);

  async function handleStatusChange(orderId, status) {
    setError("");

    try {
      const data = await updateOrderStatus(orderId, status);

      setOrders((current) =>
        current.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status: data.order.status,
              }
            : order
        )
      );
    } catch (err) {
      setError(err.message || "Could not update order status.");
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>Order Management</h1>
          <p>View and manage customer orders.</p>
        </div>
      </div>

      <div className={styles.controls}>
        <label>
          Status
          <select
            value={statusFilter}
            onChange={(event) => {
              setIsLoading(true);
              setStatusFilter(event.target.value);
            }}
          >
            <option value="">All statuses</option>

            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>

        <label>
          Sort
          <select
            value={sort}
            onChange={(event) => {
              setIsLoading(true);
              setSort(event.target.value);
            }}
          >
            <option value="date-desc">Newest first</option>
            <option value="date-asc">Oldest first</option>
            <option value="customer-asc">Customer A-Z</option>
            <option value="customer-desc">Customer Z-A</option>
            <option value="total-desc">Highest total</option>
            <option value="total-asc">Lowest total</option>
          </select>
        </label>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {isLoading ? (
        <p className={styles.message}>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className={styles.message}>No orders found.</p>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>

                  <td>
                    <strong>{order.customer_name}</strong>
                    <span>{order.customer_email}</span>
                  </td>

                  <td>
                    {order.created_at
                      ? new Date(order.created_at).toLocaleDateString()
                      : "Unknown"}
                  </td>

                  <td>${Number(order.total_price || 0).toFixed(2)}</td>

                  <td>
                    <select
                      value={order.status}
                      onChange={(event) =>
                        handleStatusChange(order.id, event.target.value)
                      }
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td>
                    <Link href={`/admin/orders/${order.id}`}>View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}