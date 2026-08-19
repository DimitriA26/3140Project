"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

function AccountContent() {
  const router = useRouter();
  const { currentUser, signOut } = useAuth();

  function handleSignOut() {
    signOut();
    router.push("/");
  }

  return (
    <main style={styles.page}>
      <section style={styles.container}>
        <div style={styles.header}>
          <p style={styles.eyebrow}>My account</p>
          <h1 style={styles.title}>Account overview</h1>
          <p style={styles.subtitle}>
            Manage your profile and view your shopping activity.
          </p>
        </div>

        <div style={styles.grid}>
          <article style={styles.card}>
            <h2 style={styles.cardTitle}>Profile</h2>
            <p style={styles.cardText}>
              View and manage your account information.
            </p>

            <div style={styles.profileRow}>
              <span style={styles.label}>Name</span>
              <span>{currentUser.name}</span>
            </div>

            <div style={styles.profileRow}>
              <span style={styles.label}>Email</span>
              <span>{currentUser.email}</span>
            </div>

            <div style={styles.profileRow}>
              <span style={styles.label}>Role</span>
              <span>{currentUser.role}</span>
            </div>
          </article>

          <article style={styles.card}>
            <h2 style={styles.cardTitle}>Orders</h2>
            <p style={styles.cardText}>
              Review your recent purchases and order status.
            </p>

            <Link href="/order-history" style={styles.button}>
              View order history
            </Link>
          </article>
        </div>

        <div style={styles.actions}>
          <Link href="/products" style={styles.secondaryButton}>
            Continue shopping
          </Link>

          <button type="button" onClick={handleSignOut} style={styles.signOut}>
            Sign out
          </button>
        </div>
      </section>
    </main>
  );
}

export default function AccountPage() {
  return (
    <ProtectedRoute>
      <AccountContent />
    </ProtectedRoute>
  );
}

const styles = {
  page: {
    minHeight: "calc(100vh - 140px)",
    background: "#f7f7f8",
    padding: "56px 20px",
  },

  container: {
    maxWidth: "1000px",
    margin: "0 auto",
  },

  header: {
    marginBottom: "32px",
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
    margin: 0,
    color: "#6b7280",
    fontSize: "17px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "24px",
  },

  card: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "16px",
    padding: "28px",
    boxShadow: "0 10px 24px rgba(0, 0, 0, 0.04)",
  },

  cardTitle: {
    margin: "0 0 8px",
    fontSize: "22px",
  },

  cardText: {
    margin: "0 0 24px",
    color: "#6b7280",
    lineHeight: "1.6",
  },

  profileRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
    padding: "12px 0",
    borderBottom: "1px solid #e5e7eb",
  },

  label: {
    fontWeight: "600",
  },

  button: {
    display: "inline-block",
    padding: "12px 18px",
    borderRadius: "8px",
    background: "#111827",
    color: "#ffffff",
    textDecoration: "none",
    fontWeight: "600",
  },

  actions: {
    marginTop: "28px",
    display: "flex",
    alignItems: "center",
    gap: "18px",
    flexWrap: "wrap",
  },

  secondaryButton: {
    padding: "11px 18px",
    border: "1px solid #111827",
    borderRadius: "8px",
    color: "#111827",
    textDecoration: "none",
    fontWeight: "600",
  },

  signOut: {
    color: "#6b7280",
    textDecoration: "none",
    fontWeight: "600",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    padding: 0,
  },
};