"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./page.module.css";
import Spinner from "@/components/Spinner";
import ErrorBanner from "@/components/ErrorBanner";
import EmptyState from "@/components/EmptyState";
import AddToCartButton from "@/components/AddToCartButton";
import { formatCurrency } from "@/lib/formatCurrency";
import { getProducts } from "@/services/productService";

const CATEGORIES = ["Electronics", "Books", "Clothing", "Home", "Sports"];

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialSearch = searchParams.get("search") || "";

  const [searchInput, setSearchInput] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);

  const [category, setCategory] = useState(
    searchParams.get("category") || ""
  );

  const [minPrice, setMinPrice] = useState(
    searchParams.get("minPrice") || ""
  );

  const [maxPrice, setMaxPrice] = useState(
    searchParams.get("maxPrice") || ""
  );

  const [inStock, setInStock] = useState(
    searchParams.get("inStock") === "true"
  );

  const [sort, setSort] = useState(
    searchParams.get("sort") || "name-asc"
  );

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    const params = new URLSearchParams();

    if (debouncedSearch) {
      params.set("search", debouncedSearch);
    }

    if (category) {
      params.set("category", category);
    }

    if (minPrice) {
      params.set("minPrice", minPrice);
    }

    if (maxPrice) {
      params.set("maxPrice", maxPrice);
    }

    if (inStock) {
      params.set("inStock", "true");
    }

    if (sort && sort !== "name-asc") {
      params.set("sort", sort);
    }

    const queryString = params.toString();

    const nextUrl = queryString
      ? `/products?${queryString}`
      : "/products";

    const currentQueryString = searchParams.toString();

    const currentUrl = currentQueryString
      ? `/products?${currentQueryString}`
      : "/products";

    if (nextUrl !== currentUrl) {
      router.replace(nextUrl, { scroll: false });
    }
  }, [
    debouncedSearch,
    category,
    minPrice,
    maxPrice,
    inStock,
    sort,
    router,
    searchParams,
  ]);

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      setIsLoading(true);
      setError("");

      try {
        const data = await getProducts({
          search: debouncedSearch,
          category,
          minPrice,
          maxPrice,
          inStock,
          sort,
          limit: 50,
        });

        if (!cancelled) {
          setProducts(data.products);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Failed to load products.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, [debouncedSearch, category, minPrice, maxPrice, inStock, sort]);

  return (
    <div className={`container ${styles.page}`}>
      <header className={styles.header}>
        <h1>Products</h1>

        <p>
          Browse and discover products that match what you are looking for.
        </p>
      </header>

      <div className={styles.content}>
        <aside className={styles.filters}>
          <div className={styles.filterGroup}>
            <label htmlFor="search">Search</label>

            <input
              id="search"
              type="text"
              placeholder="Search products..."
              value={searchInput}
              onChange={(event) =>
                setSearchInput(event.target.value)
              }
            />
          </div>

          <div className={styles.filterGroup}>
            <label htmlFor="category">Category</label>

            <select
              id="category"
              value={category}
              onChange={(event) =>
                setCategory(event.target.value)
              }
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>Price Range</label>

            <div className={styles.priceRow}>
              <input
                aria-label="Minimum price"
                type="number"
                min="0"
                placeholder="Min"
                value={minPrice}
                onChange={(event) =>
                  setMinPrice(event.target.value)
                }
              />

              <input
                aria-label="Maximum price"
                type="number"
                min="0"
                placeholder="Max"
                value={maxPrice}
                onChange={(event) =>
                  setMaxPrice(event.target.value)
                }
              />
            </div>
          </div>

          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={inStock}
              onChange={(event) =>
                setInStock(event.target.checked)
              }
            />

            In stock only
          </label>

          <div className={styles.filterGroup}>
            <label htmlFor="sort">Sort By</label>

            <select
              id="sort"
              value={sort}
              onChange={(event) =>
                setSort(event.target.value)
              }
            >
              <option value="name-asc">
                Name: A-Z
              </option>

              <option value="name-desc">
                Name: Z-A
              </option>

              <option value="price-asc">
                Price: Low to High
              </option>

              <option value="price-desc">
                Price: High to Low
              </option>
            </select>
          </div>
        </aside>

        <section className={styles.results}>
          <div className={styles.resultsHeader}>
            <div>
              <h2>Product Results</h2>

              {!isLoading && !error && (
                <p>
                  {products.length} product
                  {products.length === 1 ? "" : "s"} found
                </p>
              )}
            </div>
          </div>

          {isLoading ? (
            <Spinner label="Loading products…" />
          ) : error ? (
            <ErrorBanner message={error} />
          ) : products.length > 0 ? (
            <div className={styles.productGrid}>
              {products.map((product) => (
                <article
                  key={product.id}
                  className={styles.productCard}
                >
                  <Link
                    href={`/products/${product.id}`}
                    className={styles.productImage}
                  >
                    {product.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={product.image_url} alt={product.name} />
                    ) : (
                      <span>No image</span>
                    )}
                  </Link>

                  <div className={styles.productBody}>
                    <p className={styles.productCategory}>
                      {product.category_name}
                    </p>

                    <h3>
                      <Link href={`/products/${product.id}`}>
                        {product.name}
                      </Link>
                    </h3>

                    <p className={styles.productDescription}>
                      {product.description}
                    </p>

                    <div className={styles.productFooter}>
                      <strong className={styles.productPrice}>
                        {formatCurrency(product.price)}
                      </strong>

                      <span
                        className={
                          product.inventory > 0
                            ? styles.inStock
                            : styles.outOfStock
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
                </article>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No products found"
              description="Try changing your search or filter options."
            />
          )}
        </section>
      </div>
    </div>
  );
}
