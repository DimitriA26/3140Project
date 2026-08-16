// Shared money formatting so prices look the same on every page.
// Postgres NUMERIC columns come back from node-postgres as strings, so this
// coerces before formatting — passing "89.99" or 89.99 both work.
export function formatCurrency(value) {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return "$0.00";
  }

  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}
