import Link from "next/link";

export type RelationEnd = { slug: string; nameBs: string };

export type RelationRow = {
  id: string;
  relationType: string;
  label: string;
  from: RelationEnd;
  to: RelationEnd;
};

export function RelationsList({
  currentSlug,
  incoming,
  outgoing,
}: {
  currentSlug: string;
  incoming: RelationRow[];
  outgoing: RelationRow[];
}) {
  return (
    <div className="space-y-10">
      <section aria-labelledby="rel-out">
        <h3 id="rel-out" className="font-display text-lg font-semibold text-cream">
          Outgoing
        </h3>
        <ul className="mt-4 space-y-3">
          {outgoing.length === 0 ? (
            <li className="text-sm text-muted">No outgoing relations.</li>
          ) : (
            outgoing.map((r) => (
              <li
                key={r.id}
                className="rounded-lg border-[0.5px] border-[color:var(--line)] bg-bg2/60 px-4 py-3 font-sans text-sm leading-relaxed text-cream/90"
              >
                <RelationLine row={r} currentSlug={currentSlug} />
              </li>
            ))
          )}
        </ul>
      </section>
      <section aria-labelledby="rel-in">
        <h3 id="rel-in" className="font-display text-lg font-semibold text-cream">
          Incoming
        </h3>
        <ul className="mt-4 space-y-3">
          {incoming.length === 0 ? (
            <li className="text-sm text-muted">No incoming relations.</li>
          ) : (
            incoming.map((r) => (
              <li
                key={r.id}
                className="rounded-lg border-[0.5px] border-[color:var(--line)] bg-bg2/60 px-4 py-3 font-sans text-sm leading-relaxed text-cream/90"
              >
                <RelationLine row={r} currentSlug={currentSlug} />
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
}

function RelationLine({ row, currentSlug }: { row: RelationRow; currentSlug: string }) {
  const mid = row.relationType.toUpperCase();
  const peerSlug = row.from.slug === currentSlug ? row.to.slug : row.from.slug;
  return (
    <span className="inline-flex flex-wrap items-baseline gap-x-2 gap-y-1">
      <EntityRef end={row.from} currentSlug={currentSlug} />
      <span className="text-muted">→</span>
      <span className="font-mono text-[11px] font-bold uppercase tracking-wide text-gold2">{mid}</span>
      <span className="text-muted">→</span>
      <Link href={`/entitet/${peerSlug}/`} className="text-gold underline decoration-gold/35 underline-offset-2 hover:decoration-gold">
        {row.label}
      </Link>
    </span>
  );
}

function EntityRef({ end, currentSlug }: { end: RelationEnd; currentSlug: string }) {
  if (end.slug === currentSlug) {
    return <span className="font-semibold text-cream">{end.nameBs}</span>;
  }
  return (
    <Link href={`/entitet/${end.slug}/`} className="font-semibold text-gold hover:text-gold2">
      {end.nameBs}
    </Link>
  );
}
