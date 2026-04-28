import Image from "next/image";
import Link from "next/link";

export type EntityCardModel = {
  slug: string;
  nameBs: string;
  type: string;
  role?: string | null;
  shortBio?: string | null;
  imageUrl?: string | null;
  avatar?: string | null;
  counts: {
    decisions: number;
    articles: number;
    relations: number;
  };
};

export function EntityCard({ e }: { e: EntityCardModel }) {
  const img = e.imageUrl || e.avatar;
  return (
    <Link
      href={`/entitet/${e.slug}/`}
      className="group block rounded-xl border-[0.5px] border-[color:var(--line)] bg-bg2/80 p-4 transition-colors hover:border-gold/35 hover:bg-bg3/60"
    >
      <div className="flex gap-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-[color:var(--line)] bg-bg3">
          {img ? (
            <Image src={img} alt={e.nameBs} fill className="object-cover" sizes="64px" unoptimized />
          ) : (
            <div className="flex h-full w-full items-center justify-center font-display text-xl text-gold/80">
              {e.nameBs.slice(0, 1).toUpperCase()}
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-lg font-semibold leading-snug text-cream group-hover:text-gold2">{e.nameBs}</h2>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-gold/90">
            {e.type}
            {e.role ? ` · ${e.role}` : ""}
          </p>
          {e.shortBio ? (
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-cream/75">{e.shortBio}</p>
          ) : null}
          <dl className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] text-muted">
            <div>
              <dt className="inline text-cream/60">Decisions </dt>
              <dd className="inline text-cream/85">{e.counts.decisions}</dd>
            </div>
            <div>
              <dt className="inline text-cream/60">Articles </dt>
              <dd className="inline text-cream/85">{e.counts.articles}</dd>
            </div>
            <div>
              <dt className="inline text-cream/60">Relations </dt>
              <dd className="inline text-cream/85">{e.counts.relations}</dd>
            </div>
          </dl>
        </div>
      </div>
    </Link>
  );
}
