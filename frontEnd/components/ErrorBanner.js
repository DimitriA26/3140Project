import styles from "./ErrorBanner.module.css";

// Shared error display for failed requests and form submissions.
// Pass `onRetry` to show a retry button (useful for failed GETs).
export default function ErrorBanner({ message, onRetry }) {
  if (!message) {
    return null;
  }

  return (
    <div className={styles.banner} role="alert">
      <p className={styles.message}>{message}</p>

      {onRetry && (
        <button type="button" className={styles.retry} onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
