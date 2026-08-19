"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import AdminRoute from "@/components/AdminRoute";
import Spinner from "@/components/Spinner";
import {
  getCategories,
  getProductById,
  updateProduct,
} from "@/services/productService";

const emptyForm = {
  name: "",
  description: "",
  category_id: "",
  price: "",
  inventory: "",
  imageUrl: "",
};

function EditProductContent() {
  const params = useParams();
  const router = useRouter();

  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError("");

      try {
        const [product, categoryList] = await Promise.all([
          getProductById(params.id),
          getCategories(),
        ]);

        if (!cancelled) {
          setCategories(categoryList);
          setFormData({
            name: product.name,
            description: product.description || "",
            category_id: product.category_id || "",
            price: product.price,
            inventory: product.inventory,
            imageUrl: product.image_url || "",
          });
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Could not load this product.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [params.id]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    if (
      !formData.name ||
      !formData.description ||
      !formData.category_id ||
      formData.price === "" ||
      formData.inventory === ""
    ) {
      setError("Please complete all required fields.");
      return;
    }

    const price = Number(formData.price);
    const inventory = Number(formData.inventory);

    if (Number.isNaN(price) || price < 0) {
      setError("Price must be a valid non-negative number.");
      return;
    }

    if (
      Number.isNaN(inventory) ||
      inventory < 0 ||
      !Number.isInteger(inventory)
    ) {
      setError("Inventory must be a non-negative whole number.");
      return;
    }

    setIsSubmitting(true);

    try {
      await updateProduct(params.id, {
        name: formData.name,
        description: formData.description,
        category_id: Number(formData.category_id),
        price,
        inventory,
        image_url: formData.imageUrl || null,
      });

      router.push("/admin/products");
    } catch (err) {
      setError(err.message || "Could not save these changes.");
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return <Spinner fullPage label="Loading product…" />;
  }

  return (
    <main style={styles.page}>
      <section style={styles.container}>
        <div style={styles.header}>
          <div>
            <p style={styles.eyebrow}>Admin</p>

            <h1 style={styles.title}>Edit product</h1>

            <p style={styles.subtitle}>
              Update product details and inventory.
            </p>
          </div>

          <Link href="/admin/products" style={styles.backLink}>
            Back to products
          </Link>
        </div>

        <div style={styles.productId}>
          Product ID: <strong>{params.id}</strong>
        </div>

        <form onSubmit={handleSubmit} style={styles.card}>
          <div style={styles.field}>
            <label htmlFor="name" style={styles.label}>
              Product name *
            </label>

            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label htmlFor="description" style={styles.label}>
              Description *
            </label>

            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              style={styles.textarea}
            />
          </div>

          <div style={styles.row}>
            <div style={styles.field}>
              <label htmlFor="category" style={styles.label}>
                Category *
              </label>

              <select
                id="category"
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                style={styles.input}
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.field}>
              <label htmlFor="price" style={styles.label}>
                Price *
              </label>

              <input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.field}>
              <label htmlFor="inventory" style={styles.label}>
                Inventory quantity *
              </label>

              <input
                id="inventory"
                name="inventory"
                type="number"
                min="0"
                step="1"
                value={formData.inventory}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label htmlFor="imageUrl" style={styles.label}>
                Image URL
              </label>

              <input
                id="imageUrl"
                name="imageUrl"
                type="url"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://example.com/product.jpg"
                style={styles.input}
              />
            </div>
          </div>

          {error && (
            <p style={styles.error} role="alert">
              {error}
            </p>
          )}

          <div style={styles.actions}>
            <button
              type="submit"
              style={styles.primaryButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save changes"}
            </button>

            <Link
              href="/admin/products"
              style={styles.cancelButton}
            >
              Cancel
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}

export default function EditProductPage() {
  return (
    <AdminRoute>
      <EditProductContent />
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

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: "24px",
    marginBottom: "20px",
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

  backLink: {
    color: "#111827",
    fontWeight: "600",
    textDecoration: "none",
  },

  productId: {
    marginBottom: "20px",
    color: "#6b7280",
    fontSize: "14px",
  },

  card: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "16px",
    padding: "30px",
    boxShadow: "0 10px 24px rgba(0, 0, 0, 0.04)",
  },

  row: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "20px",
  },

  field: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginBottom: "20px",
  },

  label: {
    fontSize: "14px",
    fontWeight: "600",
  },

  input: {
    width: "100%",
    padding: "12px 14px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "16px",
  },

  textarea: {
    width: "100%",
    padding: "12px 14px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "16px",
    resize: "vertical",
  },

  error: {
    color: "#b91c1c",
    fontSize: "14px",
    margin: "0 0 20px",
  },

  actions: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },

  primaryButton: {
    border: "none",
    borderRadius: "8px",
    padding: "12px 18px",
    background: "#111827",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
  },

  cancelButton: {
    color: "#6b7280",
    textDecoration: "none",
    fontWeight: "600",
  },

};