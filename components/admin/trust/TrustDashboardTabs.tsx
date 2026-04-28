"use client";

import { useCallback, useEffect, useState } from "react";

import { AuditLogList } from "@/components/admin/trust/AuditLogList";
import { StatCard } from "@/components/admin/trust/StatCard";
import { TrustChart } from "@/components/admin/trust/TrustChart";

type Totals = {
  totalDecisions: number;
  editorValidatedPct: number;
  aiConfidenceAvg: number | null;
  trustScore: number;
  pendingValidations: number;
  validatedDecisions: number;
};

type StatsPayload = {
  ok: boolean;
  totals: Totals;
  charts: {
    dailyDecisionsIngested: { date: string; count: number }[];
    validationBacklog: { date: string; backlog: number }[];
  };
};

type DecisionRow = {
  id: string;
  title: string | null;
  slug: string | null;
  trustStatus: string;
  impactScore: number;
  aiConfidence: number | null;
  version: number;
  needsDiffReview: boolean;
  diffUrl?: string;
  editorUrl: string;
  updatedAt: string;
};

const TABS = [
  { id: "overview", label: "📊 OVERVIEW" },
  { id: "review", label: "⚠️ NEEDS REVIEW" },
  { id: "changes", label: "🔄 CHANGE DETECTION" },
  { id: "audit", label: "📝 AUDIT TRAIL" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function TrustDashboardTabs() {
  const [tab, setTab] = useState<TabId>("overview");
  const [stats, setStats] = useState<StatsPayload | null>(null);
  const [statsErr, setStatsErr] = useState<string | null>(null);
  const [review, setReview] = useState<DecisionRow[]>([]);
  const [changes, setChanges] = useState<DecisionRow[]>([]);
  const [listErr, setListErr] = useState<string | null>(null);
  const [diffBusy, setDiffBusy] = useState<string | null>(null);

  const loadStats = useCallback(async () => {
    setStatsErr(null);
    try {
      const res = await fetch("/api/admin/trust/stats", { credentials: "include" });
      const json = (await res.json()) as StatsPayload & { error?: string };
      if (!res.ok) throw new Error(json.error || "Failed to load stats");
      setStats(json);
    } catch (e) {
      setStatsErr(e instanceof Error ? e.message : "Error");
    }
  }, []);

  const loadReview = useCallback(async () => {
    setListErr(null);
    try {
      const res = await fetch("/api/admin/trust/decisions?queue=review", { credentials: "include" });
      const json = (await res.json()) as { ok?: boolean; items?: DecisionRow[]; error?: string };
      if (!res.ok) throw new Error(json.error || "Failed");
      setReview(json.items ?? []);
    } catch (e) {
      setListErr(e instanceof Error ? e.message : "Error");
    }
  }, []);

  const loadChanges = useCallback(async () => {
    setListErr(null);
    try {
      const res = await fetch("/api/admin/trust/decisions?queue=changes", { credentials: "include" });
      const json = (await res.json()) as { ok?: boolean; items?: DecisionRow[]; error?: string };
      if (!res.ok) throw new Error(json.error || "Failed");
      setChanges(json.items ?? []);
    } catch (e) {
      setListErr(e instanceof Error ? e.message : "Error");
    }
  }, []);

  useEffect(() => {
    void loadStats();
  }, [loadStats]);

  useEffect(() => {
    if (tab === "review") void loadReview();
    if (tab === "changes") void loadChanges();
  }, [tab, loadReview, loadChanges]);

  const onDiff = async (id: string, outcome: "approve" | "reject") => {
    setDiffBusy(id + outcome);
    try {
      const res = await fetch(`/api/admin/trust/decisions/${id}/diff`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ outcome }),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(json.error || "Request failed");
      await loadChanges();
      await loadStats();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Error");
    } finally {
      setDiffBusy(null);
    }
  };

  const totals = stats?.totals;

  return (
    <div>
      <div className="flex flex-wrap gap-2 border-b border-line pb-3">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded px-3 py-2 font-mono text-xs uppercase tracking-wider transition-colors ${
              tab === t.id
                ? "bg-bg4 text-gold"
                : "text-muted hover:bg-bg3 hover:text-cream"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="mt-8 space-y-8">
          {statsErr ? <p className="text-sm text-red-400">{statsErr}</p> : null}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Total decisions" value={totals ? String(totals.totalDecisions) : "—"} />
            <StatCard
              label="Editor validated"
              value={totals ? `${totals.editorValidatedPct}%` : "—"}
              sub={totals ? `${totals.validatedDecisions} rows` : undefined}
            />
            <StatCard
              label="AI confidence (avg)"
              value={totals?.aiConfidenceAvg != null ? String(totals.aiConfidenceAvg) : "—"}
            />
            <StatCard label="Trust score" value={totals ? String(totals.trustScore) : "—"} sub="Composite" />
          </div>
          {stats?.charts ? (
            <TrustChart
              dailyIngested={stats.charts.dailyDecisionsIngested}
              backlog={stats.charts.validationBacklog}
            />
          ) : (
            <p className="font-mono text-sm text-muted">Loading charts…</p>
          )}
        </div>
      )}

      {tab === "review" && (
        <div className="mt-8">
          {listErr ? <p className="mb-4 text-sm text-red-400">{listErr}</p> : null}
          {review.length === 0 ? (
            <p className="font-mono text-sm text-muted">No pending AI decisions (ai_generated).</p>
          ) : (
            <ul className="space-y-3">
              {review.map((row) => (
                <li
                  key={row.id}
                  className="flex flex-col gap-2 rounded-lg border border-bg4 bg-bg2/70 px-4 py-3 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="font-display text-lg text-cream">{row.title || row.slug || row.id}</p>
                    <p className="mt-1 font-mono text-xs text-muted">
                      impact {row.impactScore.toFixed(1)} · conf {row.aiConfidence ?? "—"} · v{row.version}
                    </p>
                  </div>
                  <a
                    href={row.editorUrl}
                    className="inline-flex w-fit items-center rounded border border-gold/50 bg-bg3 px-4 py-2 font-mono text-xs text-gold hover:border-gold"
                  >
                    Open editor
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {tab === "changes" && (
        <div className="mt-8">
          {listErr ? <p className="mb-4 text-sm text-red-400">{listErr}</p> : null}
          {changes.length === 0 ? (
            <p className="font-mono text-sm text-muted">No decisions with version &gt; 1.</p>
          ) : (
            <ul className="space-y-3">
              {changes.map((row) => (
                <li
                  key={row.id}
                  className="flex flex-col gap-3 rounded-lg border border-bg4 bg-bg2/70 px-4 py-3 lg:flex-row lg:items-center lg:justify-between"
                >
                  <div>
                    <p className="font-display text-lg text-cream">{row.title || row.slug || row.id}</p>
                    <p className="mt-1 font-mono text-xs text-muted">
                      v{row.version}
                      {row.needsDiffReview ? " · needs diff review" : ""} · {row.trustStatus}
                    </p>
                    <a href={row.diffUrl} className="mt-2 inline-block font-mono text-xs text-live underline">
                      View diff
                    </a>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <a
                      href={row.editorUrl}
                      className="inline-flex items-center rounded border border-gold/50 bg-bg3 px-3 py-2 font-mono text-xs text-gold hover:border-gold"
                    >
                      Editor
                    </a>
                    <button
                      type="button"
                      disabled={!!diffBusy}
                      onClick={() => void onDiff(row.id, "approve")}
                      className="rounded border border-live/50 bg-bg3 px-3 py-2 font-mono text-xs text-live hover:bg-bg4 disabled:opacity-40"
                    >
                      {diffBusy === row.id + "approve" ? "…" : "Approve diff"}
                    </button>
                    <button
                      type="button"
                      disabled={!!diffBusy}
                      onClick={() => void onDiff(row.id, "reject")}
                      className="rounded border border-red-500/40 bg-bg3 px-3 py-2 font-mono text-xs text-red-300 hover:bg-bg4 disabled:opacity-40"
                    >
                      {diffBusy === row.id + "reject" ? "…" : "Reject"}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {tab === "audit" && (
        <div className="mt-8">
          <AuditLogList />
        </div>
      )}
    </div>
  );
}
