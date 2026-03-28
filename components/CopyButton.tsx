"use client";

import { useState } from "react";

export function CopyButton({ text }: { text: string }) {
  const [done, setDone] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setDone(true);
      setTimeout(() => setDone(false), 2000);
    } catch {
      /* ignore */
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="rounded border border-[color:var(--line)] bg-bg px-3 py-1 font-mono text-[9px] font-bold uppercase tracking-wider text-gold transition-colors hover:border-gold/40"
    >
      {done ? "Copied" : "Copy"}
    </button>
  );
}
