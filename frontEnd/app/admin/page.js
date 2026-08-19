"use client";

import Link from "next/link";
import { Package, ClipboardList } from "lucide-react";

import AdminRoute from "@/components/AdminRoute";

function AdminDashboardContent() {
  return (
    <main style={styles.page}>
      <section style={styles.container}>
        <p style={styles.eyebrow}>Admin</p>
        <h1 style={styles.title}>Dashboard</h1>
        <p style={styles.subtitle}>Manage the store catalog and customer orders.</p>

        <div style={styles.grid}>
          <Link href="/admin/products" style={styles.card}>
            <Package size={28} strokeWidth={1.6} />
            <h2>Products</h2>
            <p>Add, edit, and remove products from the catalog.</p>
          </Link>

          <Link href="/admin/orders" style={styles.card}>
            <ClipboardList size={28} strokeWidth={1.6} />
            <h2>Orders</h2>
            <p>Review customer orders and update their status.</p>
          </Link>
        </div>
      </section>
    </main>
  );
}

export default function AdminDashboardPage() {
  return (
    <AdminRoute>
      <AdminDashboardContent />
    </AdminRoute>
  );
}

const styles = {
  page: {
    minHeight: "calc(100vh - 140px)",
    background: "#f7f7f8",
    padding: "56px 20px",
  },
  container: {
    maxWidth: "900px",
    margin: "0 auto",
  },
  eyebrow: {
    margin: "0 0 8px",
    color: "#6b7280",
    fontSize: "14px",
    fontWeight: "600",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  title: {
    margin: "0 0 10px",
    fontSize: "36px",
  },
  subtitle: {
    margin: "0 0 32px",
    color: "#6b7280",
    fontSize: "17px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "20px",
  },
  card: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "16px",
    padding: "28px",
    boxShadow: "0 10px 24px rgba(0, 0, 0, 0.04)",
    color: "#111827",
    textDecoration: "none",
  },
};
