"use client";

import Link from "next/link";
import { useState } from "react";

export default function AdminProductsPage() {
  const [products] = useState([
    {
      id: "PROD001",
      name: "Sample Laptop",
      category: "Electronics",
      price: 899.99,
      inventory: 12,
    },
    {
      id: "PROD002",
      name: "College Backpack",
      category: "Backpacks",
      price: 49.99,
      inventory: 25,
    },
    {
      id: "PROD003",
      name: "Notebook Set",
      category: "Office Supplies",
      price: 14.99,
      inventory: 0,
    },
  ]);

  return (
    <main style={styles.page}>
      <section style={styles.container}>
        <div style={styles.header}>
          <div>
            <p style={styles.eyebrow}>Admin</p>
            <h1 style={styles.title}>Product management</h1>
            <p style={styles.subtitle}>
              Add, edit, review, and manage store inventory.
            </p>
          </div>

          <Link href="/admin/products/new" style={styles.primaryButton}>
            Add product
          </Link>
        </div>

        <div style={styles.tableCard}>
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Product</th>
                  <th style={styles.th}>Category</th>
                  <th style={styles.th}>Price</th>
                  <th style={styles.th}>Inventory</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td style={styles.td}>
                      <strong>{product.name}</strong>
                      <div style={styles.productId}>{product.id}</div>
                    </td>

                    <td style={styles.td}>{product.category}</td>

                    <td style={styles.td}>${product.price.toFixed(2)}</td>

                    <td style={styles.td}>{product.inventory}</td>

                    <td style={styles.td}>
                      <span
                        style={
                          product.inventory > 0
                            ? styles.inStock
                            : styles.outOfStock
                        }
                      >
                        {product.inventory > 0 ? "In stock" : "Out of stock"}
                      </span>
                    </td>

                    <td style={styles.td}>
                      <div style={styles.actions}>
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          style={styles.editLink}
                        >
                          Edit
                        </Link>

                        <button
                          type="button"
                          style={styles.deleteButton}
                          onClick={() =>
                            window.alert(
                              `Delete action for ${product.name} will be connected to the backend later.`
                            )
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p style={styles.note}>
          Product data is temporary frontend data until the admin product API is
          connected.
        </p>
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "calc(100vh - 140px)",
    background: "#f7f7f8",
    padding: "56px 20px",
  },

  container: {
    maxWidth: "1180px",
    margin: "0 auto",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: "24px",
    marginBottom: "32px",
    flexWrap: "wrap",
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

  primaryButton: {
    display: "inline-block",
    padding: "12px 18px",
    borderRadius: "8px",
    background: "#111827",
    color: "#ffffff",
    textDecoration: "none",
    fontWeight: "600",
  },

  tableCard: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 10px 24px rgba(0, 0, 0, 0.04)",
  },

  tableWrapper: {
    width: "100%",
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "800px",
  },

  th: {
    textAlign: "left",
    padding: "16px 18px",
    background: "#f9fafb",
    borderBottom: "1px solid #e5e7eb",
    fontSize: "13px",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    color: "#6b7280",
  },

  td: {
    padding: "18px",
    borderBottom: "1px solid #e5e7eb",
    verticalAlign: "middle",
  },

  productId: {
    marginTop: "4px",
    color: "#9ca3af",
    fontSize: "13px",
  },

  inStock: {
    display: "inline-block",
    padding: "5px 9px",
    borderRadius: "999px",
    background: "#ecfdf5",
    color: "#047857",
    fontSize: "13px",
    fontWeight: "600",
  },

  outOfStock: {
    display: "inline-block",
    padding: "5px 9px",
    borderRadius: "999px",
    background: "#fef2f2",
    color: "#b91c1c",
    fontSize: "13px",
    fontWeight: "600",
  },

  actions: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  editLink: {
    color: "#111827",
    fontWeight: "600",
    textDecoration: "none",
  },

  deleteButton: {
    border: "none",
    background: "transparent",
    color: "#b91c1c",
    fontWeight: "600",
    cursor: "pointer",
    padding: 0,
  },

  note: {
    marginTop: "20px",
    color: "#6b7280",
    fontSize: "14px",
  },
};