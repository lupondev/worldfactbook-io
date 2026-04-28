"use client";

type StatCardProps = {
  label: string;
  value: string;
  sub?: string;
};

export function StatCard({ label, value, sub }: StatCardProps) {
  return (
    <div className="rounded-lg border border-line bg-bg2/80 p-4 shadow-sm backdrop-blur">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">{label}</p>
      <p className="mt-3 font-display text-3xl text-cream">{value}</p>
      {sub ? <p className="mt-2 font-mono text-xs text-gold">{sub}</p> : null}
    </div>
  );
}
