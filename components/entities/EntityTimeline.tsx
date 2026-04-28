import type { TimelineEvent } from "@/lib/entity-timeline";

function formatWhen(iso: string) {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function EntityTimeline({ events, dense }: { events: TimelineEvent[]; dense?: boolean }) {
  if (events.length === 0) {
    return <p className="text-sm text-muted">No timeline events yet.</p>;
  }
  return (
    <ol className={dense ? "space-y-3" : "space-y-4"}>
      {events.map((ev, i) => (
        <li key={ev.id} className="relative flex gap-4 pl-1">
          <div className="flex flex-col items-center">
            <span className="h-2 w-2 shrink-0 rounded-full bg-gold" aria-hidden />
            {i < events.length - 1 ? (
              <span className="mt-1 w-px grow min-h-[1.25rem] bg-[color:var(--line)]" aria-hidden />
            ) : null}
          </div>
          <div className="min-w-0 pb-2">
            <div className="font-mono text-[10px] uppercase tracking-wider text-muted">{formatWhen(ev.at)}</div>
            <div className="mt-1 font-sans text-sm font-medium text-cream">{ev.title}</div>
            {ev.detail ? <div className="mt-1 text-xs text-cream/70">{ev.detail}</div> : null}
            <div className="mt-1 inline-flex rounded border border-[color:var(--line)] bg-bg3/50 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-gold/90">
              {ev.kind}
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
