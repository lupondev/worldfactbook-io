import Link from "next/link";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

export const revalidate = 300;

type QuizItem = {
  slug?: string;
  id?: string;
  title?: string;
  titleBs?: string;
  summary?: string;
  summaryBs?: string;
  category?: string;
  questionCount?: number;
  playCount?: number;
  avgScore?: number;
  publishedAt?: string;
};

function getDiurnaBase() {
  return process.env.NEXT_PUBLIC_DIURNA_URL || "https://diurna.vercel.app";
}

function toDateLabel(value?: string) {
  if (!value) return "Nepoznat datum";
  const d = new Date(value);
  if (!Number.isFinite(d.getTime())) return "Nepoznat datum";
  return `${d.toLocaleDateString("bs-BA", { day: "numeric", month: "long", year: "numeric" })}.`;
}

export default async function KvizoviPage() {
  let items: QuizItem[] = [];
  try {
    const res = await fetch(`${getDiurnaBase()}/api/public/quizzes?site=novi.ba&pageSize=50`, {
      next: { revalidate: 300 },
    });
    if (res.ok) {
      const payload = (await res.json()) as { items?: QuizItem[] };
      if (Array.isArray(payload.items)) items = payload.items;
    }
  } catch {}

  const chips = ["Sve", "Politika", "Historija", "Pravo", "Društvo"] as const;
  const hero = items[0];
  const rest = items.slice(1);

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <header className="border-b border-bg4 pb-8">
          <h1 className="font-display text-4xl text-cream">Kvizovi koji testiraju znanje</h1>
          <p className="mt-2 text-sm text-muted">Interaktivni kvizovi iz aktuelnih i pravnih tema.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {chips.map((chip) => (
              <span key={chip} className="rounded border border-bg4 px-3 py-1.5 font-mono text-xs text-muted">
                {chip}
              </span>
            ))}
          </div>
        </header>

        {hero ? (
          <article className="mt-6 rounded-xl border border-bg4 bg-bg2/70 p-6">
            <p className="font-mono text-xs uppercase tracking-wide text-gold">{hero.category || "Kviz"}</p>
            <h2 className="mt-2 font-display text-3xl text-cream">{hero.titleBs || hero.title || "Kviz"}</h2>
            <p className="mt-2 text-sm text-muted">{hero.summaryBs || hero.summary || "Provjeri koliko dobro poznaješ temu."}</p>
            <p className="mt-3 font-mono text-xs text-muted">
              {hero.questionCount ?? "?"} pitanja · {hero.playCount ?? 0} igranja · prosjek {hero.avgScore ?? 0}
            </p>
            <Link
              href={`/kviz/${hero.slug || hero.id || ""}`}
              className="mt-4 inline-block font-mono text-xs font-bold uppercase tracking-wide text-gold hover:underline"
            >
              Pokreni kviz →
            </Link>
          </article>
        ) : null}

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {rest.map((q) => (
            <article key={q.slug || q.id} className="rounded-lg border border-bg4 bg-bg2/70 p-5">
              <p className="font-mono text-xs uppercase tracking-wide text-gold">{q.category || "Kviz"}</p>
              <h2 className="mt-2 font-display text-2xl text-cream">{q.titleBs || q.title || "Kviz"}</h2>
              <p className="mt-2 text-sm text-muted">{q.summaryBs || q.summary || "Provjeri koliko dobro poznaješ temu."}</p>
              <p className="mt-3 font-mono text-xs text-muted">
                {q.questionCount ?? "?"} pitanja · {q.playCount ?? 0} igranja · prosjek {q.avgScore ?? 0} · {toDateLabel(q.publishedAt)}
              </p>
              <Link
                href={`/kviz/${q.slug || q.id || ""}`}
                className="mt-4 inline-block font-mono text-xs font-bold uppercase tracking-wide text-gold hover:underline"
              >
                Pokreni kviz →
              </Link>
            </article>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
