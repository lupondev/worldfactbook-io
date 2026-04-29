import Link from "next/link";
import { notFound } from "next/navigation";

import { DecisionTabs } from "@/app/odluke/[slug]/DecisionTabs";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

export const revalidate = 300;

type DecisionDetail = {
  id?: string;
  slug?: string;
  titleBs?: string;
  summaryBs?: string[];
  decisionType?: string;
  impactScore?: number;
  publishedAt?: string;
  sourceUrl?: string;
  aiConfidence?: number;
  affectedEntities?: string[];
  whyShouldICare?: {
    gradjanin?: string;
    politicar?: string;
    advokat?: string;
  };
};

function getDiurnaBase() {
  return process.env.NEXT_PUBLIC_DIURNA_URL || "https://diurna.vercel.app";
}

function dateBs(value?: string) {
  if (!value) return "Nepoznat datum";
  const d = new Date(value);
  if (!Number.isFinite(d.getTime())) return "Nepoznat datum";
  return `${d.toLocaleDateString("bs-BA", { day: "numeric", month: "long", year: "numeric" })}.`;
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  let decision: DecisionDetail | null = null;
  try {
    const res = await fetch(`${getDiurnaBase()}/api/public/decisions/${params.slug}`, {
      next: { revalidate: 300 },
    });
    if (res.ok) decision = (await res.json()) as DecisionDetail;
  } catch {}
  return {
    title: `${decision?.titleBs || "Odluka"} | novi.ba`,
    description: decision?.summaryBs?.[0] || "OHR odluka",
    openGraph: {
      title: `${decision?.titleBs || "Odluka"} | novi.ba`,
      description: decision?.summaryBs?.[0] || "OHR odluka",
      images: [{ url: "https://noviba-v0-design.vercel.app/og-default.jpg" }],
    },
  };
}

export default async function OdlukaDetailPage({ params }: { params: { slug: string } }) {
  let decision: DecisionDetail | null = null;
  try {
    const res = await fetch(`${getDiurnaBase()}/api/public/decisions/${params.slug}`, {
      next: { revalidate: 300 },
    });
    if (res.ok) decision = (await res.json()) as DecisionDetail;
  } catch {}
  if (!decision) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LegalCase",
    name: decision.titleBs || "OHR odluka",
    dateCreated: decision.publishedAt || undefined,
    description: decision.summaryBs?.[0] || "",
    publisher: {
      "@type": "Organization",
      name: "Office of the High Representative",
      url: "https://www.ohr.int",
    },
    url: `https://noviba-v0-design.vercel.app/odluke/${decision.slug || params.slug}/`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-10 md:px-6">
        <p className="font-mono text-xs uppercase tracking-wider text-muted">
          <Link href="/" className="text-gold hover:underline">Naslovna</Link> &gt;{" "}
          <Link href="/odluke/" className="text-gold hover:underline">Odluke</Link> &gt; {decision.titleBs || "Odluka"}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span className="rounded bg-red-700/90 px-2 py-1 font-mono text-xs font-bold text-red-100">
            {(decision.impactScore || 0).toFixed(1)}/10 IMPACT
          </span>
          <span className="rounded border border-bg4 px-2 py-1 font-mono text-[10px] uppercase tracking-wide text-muted">
            {decision.decisionType || "Decision"}
          </span>
          <span className="font-mono text-xs text-muted">{dateBs(decision.publishedAt)}</span>
        </div>

        <h1 className="mt-4 font-display text-[clamp(2.25rem,4vw,3rem)] text-cream">{decision.titleBs || "OHR odluka"}</h1>

        <section className="mt-8 rounded-lg border border-bg4 bg-bg2/70 p-5">
          <h2 className="font-display text-2xl text-cream">Sažetak za 30 sekundi</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-cream/90">
            {(decision.summaryBs || []).slice(0, 5).map((line, i) => (
              <li key={`${params.slug}-summary-${i}`}>{line}</li>
            ))}
          </ul>
        </section>

        <DecisionTabs
          gradjanin={decision.whyShouldICare?.gradjanin}
          politicar={decision.whyShouldICare?.politicar}
          advokat={decision.whyShouldICare?.advokat}
        />

        <section className="mt-6 rounded-lg border border-bg4 bg-bg2/70 p-5">
          <h2 className="font-display text-2xl text-cream">Pogođeni entiteti</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {(decision.affectedEntities || []).map((e) => (
              <span key={e} className="rounded border border-bg4 px-2 py-1 font-mono text-xs text-muted">
                {e}
              </span>
            ))}
          </div>
        </section>

        {decision.sourceUrl ? (
          <a href={decision.sourceUrl} target="_blank" rel="noreferrer" className="mt-6 inline-block font-mono text-xs font-bold uppercase tracking-wide text-gold hover:underline">
            Originalni dokument (OHR.int)
          </a>
        ) : null}

        <p className="mt-6 font-mono text-xs text-muted">
          Generirano AI-jem · Confidence {Math.round((decision.aiConfidence || 0) * 100)}%
        </p>
        <p className="mt-2 font-mono text-xs text-muted">Tekst generisan AI-jem na osnovu OHR dokumenta.</p>
      </main>
      <Footer />
    </>
  );
}
