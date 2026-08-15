import styles from "./EmptyState.module.css";

// Shared "nothing here" state — no search results, no orders, no products.
// `action` takes a Link or button, e.g. <Link href="/products">Browse</Link>.
export default function EmptyState({ title, description, action }) {
  return (
    <div className={styles.empty}>
      <h2 className={styles.title}>{title}</h2>

      {description && <p className={styles.description}>{description}</p>}

      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}
