"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./page.module.css";

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
    searchParams.get("sort") || "newest"
  );

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

    if (sort && sort !== "newest") {
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
              <option value="Electronics">Electronics</option>
              <option value="Books">Books</option>
              <option value="Clothing">Clothing</option>
              <option value="Home">Home</option>
              <option value="Sports">Sports</option>
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
              <option value="newest">Newest</option>
              <option value="price-asc">
                Price: Low to High
              </option>
              <option value="price-desc">
                Price: High to Low
              </option>
              <option value="name-asc">
                Name: A-Z
              </option>
              <option value="name-desc">
                Name: Z-A
              </option>
            </select>
          </div>
        </aside>

        <section className={styles.results}>
          <div className={styles.resultsHeader}>
            <div>
              <h2>Product Results</h2>

              <p>
                Use the filters to narrow down the catalog.
              </p>
            </div>
          </div>

          <div className={styles.placeholder}>
            <p>
              Products will appear here once the API is connected.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}