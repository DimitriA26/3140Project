"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import AdminRoute from "@/components/AdminRoute";
import { formatCurrency } from "@/lib/formatCurrency";
import { getProducts, deleteProduct } from "@/services/productService";

function AdminProductsContent() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadProducts() {
    setIsLoading(true);
    setError("");

    try {
      const data = await getProducts({ limit: 50 });
      setProducts(data.products);
    } catch (err) {
      setError(err.message || "Could not load products.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function handleDelete(product) {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) {
      return;
    }

    try {
      await deleteProduct(product.id);
      setProducts((current) => current.filter((p) => p.id !== product.id));
    } catch (err) {
      window.alert(err.message || "Could not delete this product.");
    }
  }

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

        {error && <p style={styles.error}>{error}</p>}

        {isLoading ? (
          <p style={styles.message}>Loading products...</p>
        ) : (
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
                        <div style={styles.productId}>#{product.id}</div>
                      </td>

                      <td style={styles.td}>{product.category_name}</td>

                      <td style={styles.td}>{formatCurrency(product.price)}</td>

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
                            onClick={() => handleDelete(product)}
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

            {products.length === 0 && (
              <p style={styles.message}>No products yet.</p>
            )}
          </div>
        )}
      </section>
    </main>
  );
}

export default function AdminProductsPage() {
  return (
    <AdminRoute>
      <AdminProductsContent />
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

  message: {
    color: "#6b7280",
    padding: "24px",
  },

  error: {
    color: "#b91c1c",
    marginBottom: "16px",
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
};
