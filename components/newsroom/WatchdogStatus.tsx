type Props = {
  status: "healthy" | "warning" | "down";
  checkedAt: string;
};

export function WatchdogStatus({ status, checkedAt }: Props) {
  const tone = status === "healthy" ? "text-live" : status === "warning" ? "text-gold" : "text-red-400";
  const checkedAtLabel = checkedAt === "Checking..." ? checkedAt : new Date(checkedAt).toLocaleString("en-US");
  return (
    <div className="rounded-lg border border-bg4 bg-bg2/70 p-4">
      <p className="font-mono text-xs uppercase tracking-wider text-muted">WatchdogStatus</p>
      <p className={`mt-2 font-display text-lg ${tone}`}>{status.toUpperCase()}</p>
      <p className="mt-1 font-mono text-xs text-muted">{checkedAtLabel}</p>
    </div>
  );
}
