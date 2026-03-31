"use client";

import { useEffect, useMemo, useState } from "react";

type Cluster = {
  id: string;
  title: string;
  category: string;
  score: number;
};

type TimeFilter = "24H" | "ALL";
type CategoryFilter = "ANALYSIS" | "NEWS" | "TRANSFERS";

function byCategory(list: Cluster[], filter: CategoryFilter): Cluster[] {
  const normalized = list.map((item) => ({ ...item, category: item.category.toUpperCase() }));
  const nonTransfer = normalized.filter((item) => !item.category.includes("TRANSFER") && !item.category.includes("OFF.TOPIC"));
  if (filter === "ANALYSIS") {
    const analysis = normalized.filter((item) => {
      return item.category.includes("ANALYSIS") || item.category.includes("ECONOMY") || item.category.includes("GOVERNMENT");
    });
    return analysis.length > 0 ? analysis : nonTransfer;
  }
  if (filter === "TRANSFERS") {
    return normalized.filter((item) => item.category.includes("TRANSFER"));
  }
  const news = normalized.filter((item) => {
    return item.category.includes("NEWS") || item.category.includes("BREAKING") || item.category.includes("UPDATE");
  });
  return news.length > 0 ? news : nonTransfer;
}

export function NewsroomClusters() {
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("24H");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("ANALYSIS");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      try {
        const res = await fetch(`/api/newsroom/clusters?timeFilter=${timeFilter}`, { signal: controller.signal });
        if (!res.ok) {
          setError(`Unable to refresh (${res.status}). Showing last data.`);
          setLoading(false);
          return;
        }
        const payload = (await res.json()) as {
          clusters?: Cluster[];
          data?: { clusters?: Cluster[] };
          items?: Cluster[];
        };
        const nextClusters = Array.isArray(payload.clusters)
          ? payload.clusters
          : Array.isArray(payload.data?.clusters)
            ? payload.data.clusters
            : Array.isArray(payload.items)
              ? payload.items
              : null;
        if (Array.isArray(nextClusters)) {
          setClusters(nextClusters);
          setError("");
        }
      } catch (e) {
        const err = e as { name?: string; message?: string };
        if (err.name !== "AbortError") {
          setError("Unable to refresh. Showing last data.");
        }
      } finally {
        setLoading(false);
      }
    };
    void load();
    return () => controller.abort();
  }, [timeFilter]);

  const filtered = useMemo(() => byCategory(clusters, categoryFilter), [clusters, categoryFilter]);

  return (
    <section className="mt-8 rounded-xl border border-bg4 bg-bg2/60 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-2xl text-cream">Stories</h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setTimeFilter("24H")}
            className={`rounded border px-3 py-1.5 font-mono text-xs ${timeFilter === "24H" ? "border-gold text-gold" : "border-bg4 text-muted"}`}
          >
            24H
          </button>
          <button
            type="button"
            onClick={() => setTimeFilter("ALL")}
            className={`rounded border px-3 py-1.5 font-mono text-xs ${timeFilter === "ALL" ? "border-gold text-gold" : "border-bg4 text-muted"}`}
          >
            ALL
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setCategoryFilter("ANALYSIS")}
          className={`rounded border px-3 py-1.5 font-mono text-xs ${categoryFilter === "ANALYSIS" ? "border-gold text-gold" : "border-bg4 text-muted"}`}
        >
          Analize
        </button>
        <button
          type="button"
          onClick={() => setCategoryFilter("NEWS")}
          className={`rounded border px-3 py-1.5 font-mono text-xs ${categoryFilter === "NEWS" ? "border-gold text-gold" : "border-bg4 text-muted"}`}
        >
          Vijesti
        </button>
        <button
          type="button"
          onClick={() => setCategoryFilter("TRANSFERS")}
          className={`rounded border px-3 py-1.5 font-mono text-xs ${categoryFilter === "TRANSFERS" ? "border-gold text-gold" : "border-bg4 text-muted"}`}
        >
          Transferi
        </button>
      </div>

      <p className="mt-4 font-mono text-xs text-muted">
        {loading ? "Checking..." : `${filtered.length} stories`}
      </p>
      {error ? <p className="mt-1 font-mono text-xs text-gold">{error}</p> : null}

      {filtered.length === 0 && !loading ? (
        <p className="mt-4 text-sm text-muted">No stories for this filter</p>
      ) : (
        <ul className="mt-4 space-y-2">
          {filtered.map((item) => (
            <li key={item.id} className="rounded border border-bg4 bg-bg3/70 px-3 py-2">
              <p className="font-display text-base text-cream">{item.title}</p>
              <p className="mt-1 font-mono text-xs text-muted">
                {item.category} · score {item.score}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
