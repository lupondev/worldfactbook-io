import Link from "next/link";

import { formatDaysAgo } from "@/lib/format";

const LINKS = [
  { id: "introduction", label: "Overview" },
  { id: "geography", label: "Geography" },
  { id: "economy", label: "Economy" },
  { id: "government", label: "Government" },
  { id: "people", label: "People" },
  { id: "military", label: "Military" },
  { id: "energy", label: "Energy" },
];

export function ProfileSidebar({ slug, dataUpdatedAt }: { slug: string; dataUpdatedAt: Date }) {
  return (
    <aside className="w-full shrink-0 md:w-[260px] md:sticky md:top-24 md:self-start">
      <nav className="space-y-1 rounded-lg border-[0.5px] border-[color:var(--line)] bg-bg2/90 p-4 backdrop-blur-sm">
        <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.2em] text-muted">On this page</p>
        {LINKS.map((l) => (
          <Link
            key={l.id}
            href={`/countries/${slug}/#${l.id}`}
            className="block rounded px-2 py-2 font-mono text-xs text-cream/85 transition-colors hover:bg-bg3 hover:text-gold"
          >
            <span className="text-muted">—</span> {l.label}
          </Link>
        ))}
        <div className="mt-6 border-t border-[color:var(--line)] pt-4">
          <p className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-wider text-live">
            <span className="live-dot inline-block h-2 w-2 rounded-full bg-live" aria-hidden />
            Live
          </p>
          <p className="mt-2 font-mono text-[10px] text-muted">Updated: {formatDaysAgo(dataUpdatedAt)}</p>
        </div>
      </nav>
    </aside>
  );
}
