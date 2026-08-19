"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import styles from "./page.module.css";
import Spinner from "@/components/Spinner";
import ErrorBanner from "@/components/ErrorBanner";
import AddToCartButton from "@/components/AddToCartButton";
import { formatCurrency } from "@/lib/formatCurrency";
import { getProductById } from "@/services/productService";

export default function ProductDetailPage() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadProduct() {
      setIsLoading(true);
      setError("");

      try {
        const data = await getProductById(id);

        if (!cancelled) {
          setProduct(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Failed to load this product.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadProduct();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (isLoading) {
    return <Spinner fullPage label="Loading product…" />;
  }

  if (error) {
    return (
      <div className={`container ${styles.page}`}>
        <ErrorBanner message={error} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className={`container ${styles.page}`}>
        <ErrorBanner message="Product not found." />
      </div>
    );
  }

  return (
    <div className={`container ${styles.page}`}>
      <Link href="/products" className={styles.back}>
        ← Back to products
      </Link>

      <div className={styles.layout}>
        <div className={styles.image}>
          {product.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.image_url} alt={product.name} />
          ) : (
            <span>No image</span>
          )}
        </div>

        <div className={styles.details}>
          <p className={styles.category}>{product.category_name}</p>
          <h1>{product.name}</h1>
          <p className={styles.description}>{product.description}</p>

          <div className={styles.priceRow}>
            <strong className={styles.price}>
              {formatCurrency(product.price)}
            </strong>

            <span
              className={
                product.inventory > 0 ? styles.inStock : styles.outOfStock
              }
            >
              {product.inventory > 0
                ? `${product.inventory} in stock`
                : "Out of stock"}
            </span>
          </div>

          <AddToCartButton
            productId={product.id}
            inventory={product.inventory}
          />
        </div>
      </div>
    </div>
  );
}
