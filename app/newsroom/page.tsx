import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { AutopilotStatusBar } from "@/components/newsroom/AutopilotStatusBar";
import { WatchdogStatus } from "@/components/newsroom/WatchdogStatus";

type Cluster = {
  id: string;
  title?: string;
  headline?: string;
  category?: string;
  score?: number;
};

type SearchParams = {
  timeFilter?: string;
  category?: string;
};

function parseClusters(payload: unknown): Cluster[] {
  const data = payload as { clusters?: Cluster[]; data?: { clusters?: Cluster[] }; items?: Cluster[] };
  if (Array.isArray(data?.clusters)) return data.clusters;
  if (Array.isArray(data?.data?.clusters)) return data.data.clusters;
  if (Array.isArray(data?.items)) return data.items;
  return [];
}

function filterClusters(clusters: Cluster[], category: string): Cluster[] {
  const normalized = clusters.filter(Boolean).map((item) => ({ ...item, category: String(item.category || "").toUpperCase() }));
  const visible = normalized.filter((item) => !item.category.includes("OFF.TOPIC"));
  if (category === "TRANSFERI") return visible.filter((item) => item.category.includes("TRANSFER"));
  if (category === "VIJESTI") {
    const news = visible.filter((item) => item.category.includes("NEWS") || item.category.includes("BREAKING") || item.category.includes("UPDATE"));
    return news.length > 0 ? news : visible;
  }
  const analysis = visible.filter((item) => item.category.includes("ANALYSIS") || item.category.includes("ECONOMY") || item.category.includes("GOVERNMENT"));
  return analysis.length > 0 ? analysis : visible;
}

export const dynamic = "force-dynamic";

export default async function NewsroomPage({ searchParams }: { searchParams?: SearchParams }) {
  const todayCount = 0;
  const dailyTarget = 24;
  const timeFilter = searchParams?.timeFilter === "ALL" ? "ALL" : "24H";
  const category = searchParams?.category === "VIJESTI" || searchParams?.category === "TRANSFERI" ? searchParams.category : "ANALIZE";

  let clusters: Cluster[] = [];
  try {
    const res = await fetch(`${process.env.SITE_URL ?? "http://localhost:3000"}/api/newsroom/clusters?timeFilter=${timeFilter}`, {
      cache: "no-store",
    });
    if (res.ok) {
      const payload = (await res.json()) as unknown;
      clusters = parseClusters(payload);
    }
  } catch {}

  const filtered = filterClusters(clusters, category);

  const buildHref = (nextTimeFilter: "24H" | "ALL", nextCategory: "ANALIZE" | "VIJESTI" | "TRANSFERI") =>
    `/newsroom/?timeFilter=${nextTimeFilter}&category=${nextCategory}`;

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <h1 className="font-display text-4xl text-cream">Newsroom</h1>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <AutopilotStatusBar isActive={false} todayCount={todayCount} dailyTarget={dailyTarget} />
          <WatchdogStatus status="healthy" checkedAt="Checking..." />
        </div>
        <section className="mt-8 rounded-xl border border-bg4 bg-bg2/60 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-2xl text-cream">Stories</h2>
            <div className="flex gap-2">
              <a
                href={buildHref("24H", category)}
                className={`rounded border px-3 py-1.5 font-mono text-xs ${timeFilter === "24H" ? "border-gold text-gold" : "border-bg4 text-muted"}`}
              >
                24H
              </a>
              <a
                href={buildHref("ALL", category)}
                className={`rounded border px-3 py-1.5 font-mono text-xs ${timeFilter === "ALL" ? "border-gold text-gold" : "border-bg4 text-muted"}`}
              >
                ALL
              </a>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href={buildHref(timeFilter, "ANALIZE")}
              className={`rounded border px-3 py-1.5 font-mono text-xs ${category === "ANALIZE" ? "border-gold text-gold" : "border-bg4 text-muted"}`}
            >
              Analize
            </a>
            <a
              href={buildHref(timeFilter, "VIJESTI")}
              className={`rounded border px-3 py-1.5 font-mono text-xs ${category === "VIJESTI" ? "border-gold text-gold" : "border-bg4 text-muted"}`}
            >
              Vijesti
            </a>
            <a
              href={buildHref(timeFilter, "TRANSFERI")}
              className={`rounded border px-3 py-1.5 font-mono text-xs ${category === "TRANSFERI" ? "border-gold text-gold" : "border-bg4 text-muted"}`}
            >
              Transferi
            </a>
          </div>

          <p className="mt-4 font-mono text-xs text-muted">{filtered.length} stories</p>

          {filtered.length === 0 ? (
            <p className="mt-4 text-sm text-muted">No stories for this filter</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {filtered.map((item) => (
                <li key={item.id || item.title || item.headline} className="rounded border border-bg4 bg-bg3/70 px-3 py-2">
                  <p className="font-display text-base text-cream">{item.title || item.headline || "Untitled story"}</p>
                  <p className="mt-1 font-mono text-xs text-muted">
                    {item.category || "UNKNOWN"} · score {typeof item.score === "number" ? item.score : 0}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
