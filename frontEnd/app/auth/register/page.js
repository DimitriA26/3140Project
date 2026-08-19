"use client";

import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

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

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please complete all fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Backend registration will be connected later.
    console.log("Registration submitted:", {
      name: formData.name,
      email: formData.email,
    });
  }

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <div style={styles.heading}>
          <p style={styles.eyebrow}>Join NEXA</p>

          <h1 style={styles.title}>Create your account</h1>

          <p style={styles.subtitle}>
            Create an account to manage orders and keep track of your shopping.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label htmlFor="name" style={styles.label}>
              Full name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              style={styles.input}
              autoComplete="name"
            />
          </div>

          <div style={styles.field}>
            <label htmlFor="email" style={styles.label}>
              Email address
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              style={styles.input}
              autoComplete="email"
            />
          </div>

          <div style={styles.field}>
            <label htmlFor="password" style={styles.label}>
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              style={styles.input}
              autoComplete="new-password"
            />
          </div>

          <div style={styles.field}>
            <label htmlFor="confirmPassword" style={styles.label}>
              Confirm password
            </label>

            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              style={styles.input}
              autoComplete="new-password"
            />
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" style={styles.button}>
            Create account
          </button>
        </form>

        <p style={styles.footerText}>
          Already have an account?{" "}
          <Link href="/auth/login" style={styles.link}>
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "calc(100vh - 140px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "48px 20px",
    background: "#f7f7f8",
  },

  card: {
    width: "100%",
    maxWidth: "480px",
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "16px",
    padding: "36px",
    boxShadow: "0 12px 30px rgba(0, 0, 0, 0.06)",
  },

  heading: {
    marginBottom: "28px",
  },

  eyebrow: {
    margin: "0 0 8px",
    fontSize: "14px",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "#6b7280",
  },

  title: {
    margin: "0 0 10px",
    fontSize: "32px",
    lineHeight: "1.2",
  },

  subtitle: {
    margin: 0,
    color: "#6b7280",
    lineHeight: "1.6",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  field: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  label: {
    fontWeight: "600",
    fontSize: "14px",
  },

  input: {
    width: "100%",
    padding: "12px 14px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "16px",
    outline: "none",
  },

  error: {
    margin: 0,
    color: "#b91c1c",
    fontSize: "14px",
  },

  button: {
    border: "none",
    borderRadius: "8px",
    padding: "13px 18px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    background: "#111827",
    color: "#ffffff",
  },

  footerText: {
    margin: "24px 0 0",
    textAlign: "center",
    color: "#6b7280",
  },

  link: {
    color: "#111827",
    fontWeight: "600",
    textDecoration: "none",
  },
};