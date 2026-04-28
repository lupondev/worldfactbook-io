"use client";

import { useCallback, useEffect, useState } from "react";

export type AuditItem = {
  id: string;
  decisionId: string;
  action: string;
  actor: string;
  actorLabel: string | null;
  metadata: unknown;
  createdAt: string;
  decision: { id: string; title: string | null; slug: string | null; trustStatus: string } | null;
};

type Props = {
  className?: string;
};

export function AuditLogList({ className }: Props) {
  const [action, setAction] = useState<string>("");
  const [actor, setActor] = useState<string>("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<AuditItem[]>([]);
  const pageSize = 40;

  const fetchPage = useCallback(async () => {
    setLoading(true);
    try {
      const qs = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
      });
      if (action) qs.set("action", action);
      if (actor) qs.set("actor", actor);

      const res = await fetch(`/api/admin/trust/audit-log?${qs}`, { credentials: "include" });
      const json = (await res.json()) as {
        ok?: boolean;
        items?: AuditItem[];
        total?: number;
      };
      if (json.ok && json.items) {
        setItems(json.items);
        setTotal(json.total ?? 0);
      }
    } finally {
      setLoading(false);
    }
  }, [page, action, actor]);

  useEffect(() => {
    void fetchPage();
  }, [fetchPage]);

  return (
    <div className={className}>
      <div className="mb-4 flex flex-wrap items-end gap-3">
        <label className="font-mono text-xs text-muted">
          Action
          <select
            className="ml-2 rounded border border-line bg-bg3 px-2 py-1.5 font-sans text-sm text-cream outline-none focus:border-gold"
            value={action}
            onChange={(e) => {
              setPage(1);
              setAction(e.target.value);
            }}
          >
            <option value="">Any</option>
            <option value="fetched">fetched</option>
            <option value="ai_summarized">ai_summarized</option>
            <option value="validated">validated</option>
            <option value="edited">edited</option>
            <option value="published">published</option>
          </select>
        </label>
        <label className="font-mono text-xs text-muted">
          Actor
          <select
            className="ml-2 rounded border border-line bg-bg3 px-2 py-1.5 font-sans text-sm text-cream outline-none focus:border-gold"
            value={actor}
            onChange={(e) => {
              setPage(1);
              setActor(e.target.value);
            }}
          >
            <option value="">Any</option>
            <option value="system">system</option>
            <option value="user">user</option>
          </select>
        </label>
      </div>

      {loading ? (
        <p className="font-mono text-sm text-muted">Loading audit log…</p>
      ) : items.length === 0 ? (
        <p className="font-mono text-sm text-muted">No entries yet.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((row) => (
            <li
              key={row.id}
              className="rounded border border-bg4 bg-bg2/70 px-3 py-2 font-mono text-xs md:text-[13px]"
            >
              <span className="text-gold">{row.action}</span>
              <span className="mx-2 text-muted">•</span>
              <span className="text-cream">{row.actor}</span>
              <span className="mx-2 text-muted">{new Date(row.createdAt).toLocaleString()}</span>
              {row.decision?.title ? (
                <span className="block text-muted sm:inline sm:before:mx-2 sm:before:content-['—']">
                  {row.decision.title}
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      )}

      {total > pageSize ? (
        <div className="mt-6 flex items-center gap-4 font-mono text-xs text-muted">
          <button
            type="button"
            disabled={page <= 1}
            className="rounded border border-line px-3 py-1 text-cream enabled:hover:border-gold disabled:opacity-40"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </button>
          <span>
            Page {page} of {Math.ceil(total / pageSize)}
          </span>
          <button
            type="button"
            disabled={page * pageSize >= total}
            className="rounded border border-line px-3 py-1 text-cream enabled:hover:border-gold disabled:opacity-40"
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      ) : null}
    </div>
  );
}
