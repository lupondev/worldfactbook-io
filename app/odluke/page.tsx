import Link from "next/link";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type SearchParams = {
  source?: string;
};

export default async function OdlukePage({ searchParams }: { searchParams?: SearchParams }) {
  const source = (searchParams?.source || "ALL").toUpperCase();
  const where = source === "ALL" ? {} : { source };
  const decisions = await prisma.decision.findMany({
    where,
    orderBy: [{ decisionDate: "desc" }, { createdAt: "desc" }],
    take: 250,
    select: {
      id: true,
      title: true,
      source: true,
      sourceCaseId: true,
      defendant: true,
      decisionType: true,
      decisionDate: true,
      pdfBlobUrl: true,
      pdfUrl: true,
    },
  });

  const filters = ["ALL", "OHR", "ICTY", "IRMCT"] as const;

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <h1 className="font-display text-4xl text-cream">Odluke</h1>
        <p className="mt-2 text-sm text-muted">Source filter i pregled presuda.</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {filters.map((f) => (
            <Link
              key={f}
              href={f === "ALL" ? "/odluke/" : `/odluke/?source=${f}`}
              className={`rounded border px-3 py-1.5 font-mono text-xs ${source === f ? "border-gold text-gold" : "border-bg4 text-muted"}`}
            >
              {f}
            </Link>
          ))}
        </div>
        <p className="mt-4 font-mono text-xs text-muted">{decisions.length} results</p>
        <ul className="mt-6 space-y-2">
          {decisions.map((d) => (
            <li key={d.id} className="rounded border border-bg4 bg-bg2/70 p-4">
              <p className="font-display text-lg text-cream">{d.title || d.sourceCaseId || d.id}</p>
              <p className="mt-1 font-mono text-xs text-muted">
                {d.source} · {d.decisionType || "Decision"} · {d.defendant || "Unknown defendant"} ·{" "}
                {d.decisionDate ? new Date(d.decisionDate).toISOString().slice(0, 10) : "Unknown date"}
              </p>
              {d.pdfBlobUrl || d.pdfUrl ? (
                <a
                  href={d.pdfBlobUrl || d.pdfUrl || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-block font-mono text-xs text-gold hover:underline"
                >
                  Open PDF
                </a>
              ) : null}
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </>
  );
}
