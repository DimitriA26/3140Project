"use client";

import { useState } from "react";
import Link from "next/link";

export default function NewProductPage() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    inventory: "",
    imageUrl: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (
      !formData.name ||
      !formData.description ||
      !formData.category ||
      !formData.price ||
      !formData.inventory
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

    // Backend product creation will be connected later.
    console.log("Product submitted:", formData);

    setSuccess("Product form is valid and ready to be submitted.");
  }

  return (
    <main style={styles.page}>
      <section style={styles.container}>
        <div style={styles.header}>
          <div>
            <p style={styles.eyebrow}>Admin</p>
            <h1 style={styles.title}>Add product</h1>
            <p style={styles.subtitle}>
              Create a new product for the store catalog.
            </p>
          </div>

          <Link href="/admin/products" style={styles.backLink}>
            Back to products
          </Link>
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
              placeholder="Enter product name"
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
              placeholder="Describe the product"
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
                name="category"
                value={formData.category}
                onChange={handleChange}
                style={styles.input}
              >
                <option value="">Select category</option>
                <option value="Textbooks">Textbooks</option>
                <option value="Office Supplies">Office Supplies</option>
                <option value="Electronics">Electronics</option>
                <option value="Backpacks">Backpacks</option>
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
                placeholder="0.00"
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
                placeholder="0"
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

          {error && <p style={styles.error}>{error}</p>}
          {success && <p style={styles.success}>{success}</p>}

          <div style={styles.actions}>
            <button type="submit" style={styles.primaryButton}>
              Add product
            </button>

            <Link href="/admin/products" style={styles.cancelButton}>
              Cancel
            </Link>
          </div>
        </form>

        <p style={styles.note}>
          Product creation will be connected to the admin product API once the
          backend is available.
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
    maxWidth: "900px",
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

  backLink: {
    color: "#111827",
    fontWeight: "600",
    textDecoration: "none",
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

  success: {
    color: "#047857",
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

  note: {
    marginTop: "20px",
    color: "#6b7280",
    fontSize: "14px",
  },
};