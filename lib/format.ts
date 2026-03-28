export function formatBillions(n: number | null | undefined): string {
  if (n == null || Number.isNaN(n)) return "—";
  if (n >= 1000) return `$${(n / 1000).toFixed(2)}T`;
  return `$${n.toFixed(2)}B`;
}

export function formatInt(n: bigint | number | string | null | undefined): string {
  if (n == null) return "—";
  const x =
    typeof n === "bigint"
      ? n.toString()
      : typeof n === "string"
        ? Math.round(Number(n)).toString()
        : Math.round(n).toString();
  if (x === "NaN") return "—";
  return x.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function formatDaysAgo(d: Date): string {
  const ms = Date.now() - d.getTime();
  const days = Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));
  if (days === 0) return "today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}
