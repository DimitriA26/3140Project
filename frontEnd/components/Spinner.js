import styles from "./Spinner.module.css";

// Shared loading indicator. Use `fullPage` for route-level loading (protected
// pages restoring a session), and the default inline size inside cards/lists.
export default function Spinner({ label = "Loading…", fullPage = false }) {
  const spinner = (
    <span className={styles.spinner} role="status" aria-live="polite">
      <span className={styles.circle} aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </span>
  );

  if (!fullPage) {
    return spinner;
  }

  return <div className={styles.fullPage}>{spinner}</div>;
}
