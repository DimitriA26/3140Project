import Link from "next/link";

import styles from "./SiteFooter.module.css";
import { siteConfig } from "@/lib/siteConfig";

export default function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.main}>
          <div className={styles.brand}>
            <Link href="/" className={styles.logo}>
              {siteConfig.name}
            </Link>

            <p>
              Thoughtful products, effortless shopping, and a cleaner way to
              discover what matters.
            </p>
          </div>

          <div className={styles.links}>
            <div>
              <h2>Shop</h2>
              <Link href="/products">All products</Link>
              <Link href="/products?sort=newest">New arrivals</Link>
              <Link href="/products?featured=true">Featured</Link>
              <Link href="/wishlist">Wishlist</Link>
            </div>

            <div>
              <h2>Account</h2>
              <Link href="/auth/login">Sign in</Link>
              <Link href="/auth/register">Create account</Link>
              <Link href="/orders">Orders</Link>
              <Link href="/account">Profile</Link>
            </div>

            <div>
              <h2>Help</h2>
              <Link href="/contact">Contact</Link>
              <Link href="/shipping">Shipping</Link>
              <Link href="/returns">Returns</Link>
              <Link href="/faq">FAQ</Link>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>
            © {currentYear} {siteConfig.name}. All rights reserved.
          </p>

          <div className={styles.footerLegal}>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}