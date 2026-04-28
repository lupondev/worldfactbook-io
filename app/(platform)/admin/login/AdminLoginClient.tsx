"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function AdminLoginClient() {
  const sp = useSearchParams();
  const next = sp.get("next") || "/admin/trust";
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ password, next }),
      });
      const json = (await res.json()) as { ok?: boolean; next?: string; error?: string; dev?: boolean };
      if (!res.ok) {
        setErr(json.error || "Login failed");
        return;
      }
      window.location.href = json.next || next;
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16">
      <h1 className="font-display text-3xl text-cream">Admin sign-in</h1>
      <p className="mt-2 font-mono text-xs text-muted">Password matches ADMIN_SECRET (when configured).</p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <input
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded border border-line bg-bg2 px-3 py-2 font-mono text-sm text-cream outline-none focus:border-gold"
          placeholder="Password"
        />
        {err ? <p className="font-mono text-xs text-red-400">{err}</p> : null}
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded border border-gold bg-bg3 py-2 font-mono text-sm text-gold hover:bg-bg4 disabled:opacity-40"
        >
          {busy ? "…" : "Continue"}
        </button>
      </form>
    </main>
  );
}
