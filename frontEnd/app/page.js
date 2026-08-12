import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  RefreshCcw,
  PackageCheck,
  Sparkles,
} from "lucide-react";

import styles from "./page.module.css";

export default function Home() {
  return (
    <>
      <section className={styles.hero}>
        <div className={`container ${styles.heroGrid}`}>
          <div className={styles.heroContent}>
            <span className={styles.eyebrow}>
              <Sparkles size={14} />
              Curated for everyday living
            </span>

            <h1>
              Discover products
              <span> worth keeping.</span>
            </h1>

            <p>
              A carefully selected collection of quality products designed to
              make everyday life simpler, better, and a little more beautiful.
            </p>

            <div className={styles.heroActions}>
              <Link href="/products" className={styles.primaryButton}>
                Shop collection
                <ArrowRight size={17} />
              </Link>

              <Link
                href="/products?sort=newest"
                className={styles.secondaryButton}
              >
                Explore new arrivals
              </Link>
            </div>

            <div className={styles.heroTrust}>
              <div>
                <strong>Quality</strong>
                <span>Thoughtfully selected</span>
              </div>

              <div>
                <strong>Secure</strong>
                <span>Protected checkout</span>
              </div>

              <div>
                <strong>Simple</strong>
                <span>Easy returns</span>
              </div>
            </div>
          </div>

          <div className={styles.heroVisual} aria-hidden="true">
            <div className={styles.visualMain}>
              <div className={styles.visualLabel}>
                <span>Featured collection</span>
                <strong>Essentials</strong>
              </div>

              <div className={styles.visualObject}>
                <div className={styles.visualObjectInner} />
              </div>

              <div className={styles.visualMeta}>
                <span>Selected with intention</span>
                <span>01 / 04</span>
              </div>
            </div>

            <div className={styles.floatingCard}>
              <span>New this week</span>
              <strong>Fresh arrivals</strong>
              <Link href="/products?sort=newest">
                Discover
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.benefits} aria-label="Shopping benefits">
        <div className={`container ${styles.benefitGrid}`}>
          <article>
            <PackageCheck size={22} strokeWidth={1.6} />
            <div>
              <h2>Fast delivery</h2>
              <p>Reliable shipping with clear order updates.</p>
            </div>
          </article>

          <article>
            <RefreshCcw size={21} strokeWidth={1.6} />
            <div>
              <h2>Easy returns</h2>
              <p>A straightforward return experience.</p>
            </div>
          </article>

          <article>
            <ShieldCheck size={22} strokeWidth={1.6} />
            <div>
              <h2>Secure shopping</h2>
              <p>Your checkout experience stays protected.</p>
            </div>
          </article>
        </div>
      </section>

      <section className={styles.discovery}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <div>
              <span>Discover</span>
              <h2>Shop your way.</h2>
            </div>

            <Link href="/products">
              View all products
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className={styles.discoveryGrid}>
            <Link
              href="/products?featured=true"
              className={`${styles.discoveryCard} ${styles.largeCard}`}
            >
              <div className={styles.cardDecoration}>
                <span />
              </div>

              <div className={styles.cardContent}>
                <span>Curated picks</span>
                <h3>Featured</h3>
                <p>Our standout products, selected for quality and design.</p>

                <span className={styles.cardLink}>
                  Explore collection
                  <ArrowRight size={16} />
                </span>
              </div>
            </Link>

            <Link
              href="/products?sort=newest"
              className={`${styles.discoveryCard} ${styles.newCard}`}
            >
              <div className={styles.cardContent}>
                <span>Just landed</span>
                <h3>New arrivals</h3>
                <p>See the newest additions to our collection.</p>

                <span className={styles.cardLink}>
                  Shop new
                  <ArrowRight size={16} />
                </span>
              </div>
            </Link>

            <Link
              href="/products"
              className={`${styles.discoveryCard} ${styles.allCard}`}
            >
              <div className={styles.cardContent}>
                <span>Everything</span>
                <h3>The collection</h3>
                <p>Browse the complete catalog and find your next favorite.</p>

                <span className={styles.cardLink}>
                  Browse all
                  <ArrowRight size={16} />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.statement}>
        <div className="container">
          <span>Our approach</span>

          <p>
            Great shopping should feel <strong>simple</strong>. We focus on
            thoughtful products, clear information, and an experience that gets
            out of your way.
          </p>

          <Link href="/products">
            Start exploring
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}