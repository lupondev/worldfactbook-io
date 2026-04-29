"use client";

import { useState } from "react";

type Props = {
  gradjanin?: string;
  politicar?: string;
  advokat?: string;
};

export function DecisionTabs({ gradjanin, politicar, advokat }: Props) {
  const [tab, setTab] = useState<"gradjanin" | "politicar" | "advokat">("gradjanin");
  return (
    <section className="mt-6 rounded-lg border border-bg4 bg-bg2/70 p-5">
      <h2 className="font-display text-2xl text-cream">Šta to znači za</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={() => setTab("gradjanin")} className={`rounded border px-3 py-1.5 font-mono text-xs ${tab === "gradjanin" ? "border-gold text-gold" : "border-bg4 text-muted"}`}>Građanina</button>
        <button type="button" onClick={() => setTab("politicar")} className={`rounded border px-3 py-1.5 font-mono text-xs ${tab === "politicar" ? "border-gold text-gold" : "border-bg4 text-muted"}`}>Političara</button>
        <button type="button" onClick={() => setTab("advokat")} className={`rounded border px-3 py-1.5 font-mono text-xs ${tab === "advokat" ? "border-gold text-gold" : "border-bg4 text-muted"}`}>Advokata</button>
      </div>
      <p className="mt-4 text-sm text-cream/90">
        {tab === "gradjanin" ? gradjanin || "N/A" : tab === "politicar" ? politicar || "N/A" : advokat || "N/A"}
      </p>
    </section>
  );
}
