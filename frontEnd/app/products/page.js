"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./page.module.css";

const sampleProducts = [
  {
    id: "PROD001",
    name: "College Textbook",
    description: "A required textbook for introductory college courses.",
    category: "Textbooks",
    price: 89.99,
    inventory: 14,
  },
  {
    id: "PROD002",
    name: "Scientific Calculator",
    description: "A scientific calculator for math and science classes.",
    category: "Electronics",
    price: 34.99,
    inventory: 20,
  },
  {
    id: "PROD003",
    name: "College Backpack",
    description: "A durable backpack with space for books and a laptop.",
    category: "Backpacks",
    price: 49.99,
    inventory: 25,
  },
  {
    id: "PROD004",
    name: "Notebook Pack",
    description: "A multi-pack of notebooks for classes and study notes.",
    category: "Office Supplies",
    price: 12.99,
    inventory: 0,
  },
  {
    id: "PROD005",
    name: "Wireless Mouse",
    description: "A compact wireless mouse for laptops and study setups.",
    category: "Electronics",
    price: 24.99,
    inventory: 9,
  },
  {
    id: "PROD006",
    name: "Academic Planner",
    description: "A semester planner for assignments, exams, and deadlines.",
    category: "Office Supplies",
    price: 18.99,
    inventory: 11,
  },
];

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

  const filteredProducts = sampleProducts
    .filter((product) => {
      const searchValue = debouncedSearch.toLowerCase();

      const matchesSearch =
        !searchValue ||
        product.name.toLowerCase().includes(searchValue) ||
        product.description.toLowerCase().includes(searchValue);

      const matchesCategory =
        !category || product.category === category;

      const matchesMinPrice =
        !minPrice || product.price >= Number(minPrice);

      const matchesMaxPrice =
        !maxPrice || product.price <= Number(maxPrice);

      const matchesStock =
        !inStock || product.inventory > 0;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesMinPrice &&
        matchesMaxPrice &&
        matchesStock
      );
    })
    .sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return a.price - b.price;

        case "price-desc":
          return b.price - a.price;

        case "name-desc":
          return b.name.localeCompare(a.name);

        case "name-asc":
        default:
          return a.name.localeCompare(b.name);
      }
    });

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
              <option value="Textbooks">Textbooks</option>
              <option value="Office Supplies">
                Office Supplies
              </option>
              <option value="Electronics">Electronics</option>
              <option value="Backpacks">Backpacks</option>
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

              <p>
                {filteredProducts.length} product
                {filteredProducts.length === 1 ? "" : "s"} found
              </p>
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className={styles.productGrid}>
              {filteredProducts.map((product) => (
                <article
                  key={product.id}
                  className={styles.productCard}
                >
                  <div className={styles.productImage}>
                    <span>No image</span>
                  </div>

                  <div className={styles.productBody}>
                    <p className={styles.productCategory}>
                      {product.category}
                    </p>

                    <h3>{product.name}</h3>

                    <p className={styles.productDescription}>
                      {product.description}
                    </p>

                    <div className={styles.productFooter}>
                      <strong className={styles.productPrice}>
                        ${product.price.toFixed(2)}
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
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <h3>No products found</h3>

              <p>
                Try changing your search or filter options.
              </p>
            </div>
          )}

          <p className={styles.apiNote}>
            Product results are using temporary frontend data until the
            PostgreSQL API connection is available.
          </p>
        </section>
      </div>
    </div>
  );
}