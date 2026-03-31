"use client";

import { useMemo, useState } from "react";

export type NewsroomCluster = {
  id: string;
  title?: string;
  headline?: string;
  category?: string;
  score?: number;
  articleId?: string | null;
  eventType?: string | null;
  firstSeen?: string | null;
  primaryEntityType?: string | null;
};

type Props = {
  initialClusters: NewsroomCluster[];
};

type ActiveTab = "all" | "pending" | "written" | "analize" | "vijesti" | "transferi" | "utakmice" | "povrede" | "igraci" | "klubovi";
type ActiveTimeFilter = "1H" | "6H" | "12H" | "24H" | "ALL";

function norm(value: string | null | undefined): string {
  return (value || "").toLowerCase();
}

function matchCategory(cluster: NewsroomCluster, activeTab: ActiveTab): boolean {
  const category = norm(cluster.category);
  const eventType = (cluster.eventType || "").toUpperCase();
  const entityType = (cluster.primaryEntityType || "").toUpperCase();
  if (activeTab === "all") return true;
  if (activeTab === "pending") return !cluster.articleId;
  if (activeTab === "written") return Boolean(cluster.articleId);
  if (activeTab === "analize") return category === "analize" || eventType === "ANALYSIS";
  if (activeTab === "vijesti") {
    return category === "aktuelno" || category === "vijesti" || category === "bih" || category === "svijet";
  }
  if (activeTab === "transferi") return category === "transferi" || eventType === "TRANSFER";
  if (activeTab === "utakmice") return category === "utakmice" || eventType === "MATCH";
  if (activeTab === "povrede") return category === "povrede" || eventType === "INJURY";
  if (activeTab === "igraci") return entityType === "PLAYER";
  if (activeTab === "klubovi") return entityType === "CLUB";
  return true;
}

function matchTime(cluster: NewsroomCluster, activeTimeFilter: ActiveTimeFilter): boolean {
  if (activeTimeFilter === "ALL") return true;
  const raw = cluster.firstSeen;
  if (!raw) return true;
  const date = new Date(raw).getTime();
  if (!Number.isFinite(date)) return true;
  const hours = { "1H": 1, "6H": 6, "12H": 12, "24H": 24 }[activeTimeFilter] || 24;
  const cutoff = Date.now() - hours * 60 * 60 * 1000;
  return date > cutoff;
}

export default function NewsroomClient({ initialClusters }: Props) {
  const [activeTab, setActiveTab] = useState<ActiveTab>("all");
  const [activeTimeFilter, setActiveTimeFilter] = useState<ActiveTimeFilter>("24H");

  const filteredByTab = useMemo(
    () => initialClusters.filter((cluster) => matchCategory(cluster, activeTab)),
    [initialClusters, activeTab],
  );

  const visible = useMemo(
    () => filteredByTab.filter((cluster) => matchTime(cluster, activeTimeFilter)),
    [filteredByTab, activeTimeFilter],
  );

  const tabs: Array<{ id: ActiveTab; label: string }> = [
    { id: "all", label: "Sve" },
    { id: "pending", label: "Pending" },
    { id: "written", label: "Written" },
    { id: "analize", label: "Analize" },
    { id: "vijesti", label: "Vijesti" },
    { id: "transferi", label: "Transferi" },
    { id: "utakmice", label: "Utakmice" },
    { id: "povrede", label: "Povrede" },
    { id: "igraci", label: "Igraci" },
    { id: "klubovi", label: "Klubovi" },
  ];

  const timeTabs: ActiveTimeFilter[] = ["1H", "6H", "12H", "24H", "ALL"];

  return (
    <section className="mt-8 rounded-xl border border-bg4 bg-bg2/60 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-2xl text-cream">All Stories {visible.length}</h2>
        <div className="flex flex-wrap gap-2">
          {timeTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTimeFilter(tab)}
              className={`rounded border px-3 py-1.5 font-mono text-xs ${activeTimeFilter === tab ? "border-gold text-gold" : "border-bg4 text-muted"}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`rounded border px-3 py-1.5 font-mono text-xs ${activeTab === tab.id ? "border-gold text-gold" : "border-bg4 text-muted"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="mt-4 text-sm text-muted">Nema priča za ovaj filter</p>
      ) : (
        <ul className="mt-4 space-y-2">
          {visible.map((item) => (
            <li key={item.id || item.title || item.headline} className="rounded border border-bg4 bg-bg3/70 px-3 py-2">
              <p className="font-display text-base text-cream">{item.title || item.headline || "Untitled story"}</p>
              <p className="mt-1 font-mono text-xs text-muted">
                {item.category || "unknown"} · {item.eventType || "N/A"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
