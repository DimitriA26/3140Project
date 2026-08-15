"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  Search,
  ShoppingBag,
  Heart,
} from "lucide-react";

import styles from "./SiteHeader.module.css";
import AccountMenu from "@/components/AccountMenu";
import { siteConfig } from "@/lib/siteConfig";

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <>
      <div className={styles.announcement}>
        <div className="container">
          <p>Free shipping on orders over $75</p>
          <span>Easy returns · Secure checkout</span>
        </div>
      </div>

      <header className={styles.header}>
        <div className={`container ${styles.headerInner}`}>
          <button
            className={styles.mobileMenuButton}
            type="button"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((current) => !current)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <Link
            href="/"
            className={styles.logo}
            aria-label={`${siteConfig.name} home`}
            onClick={closeMenu}
          >
            {siteConfig.name}
          </Link>

          <nav
            className={`${styles.navigation} ${
              menuOpen ? styles.navigationOpen : ""
            }`}
            aria-label="Main navigation"
          >
            <Link href="/" onClick={closeMenu}>
              Home
            </Link>

            <Link href="/products" onClick={closeMenu}>
              Shop
            </Link>

            <Link href="/products?sort=newest" onClick={closeMenu}>
              New arrivals
            </Link>

            <Link href="/products?featured=true" onClick={closeMenu}>
              Featured
            </Link>
          </nav>

          <div className={styles.actions}>
            <Link
              href="/products"
              className={styles.iconButton}
              aria-label="Search products"
            >
              <Search size={20} strokeWidth={1.8} />
            </Link>

            <Link
              href="/wishlist"
              className={`${styles.iconButton} ${styles.optionalAction}`}
              aria-label="Wishlist"
            >
              <Heart size={20} strokeWidth={1.8} />
            </Link>

            <AccountMenu iconClassName={styles.iconButton} />

            <Link
              href="/cart"
              className={`${styles.iconButton} ${styles.cartButton}`}
              aria-label="Shopping cart"
            >
              <ShoppingBag size={20} strokeWidth={1.8} />
              <span className={styles.cartCount} aria-label="0 items">
                0
              </span>
            </Link>
          </div>
        </div>
      </header>

      {menuOpen && (
        <button
          className={styles.backdrop}
          aria-label="Close navigation menu"
          onClick={closeMenu}
        />
      )}
    </>
  );
}