"use client";

import { useState } from "react";

export function Collapsible({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="rounded-lg border border-bg4 bg-bg2/60">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left font-display text-lg text-cream hover:bg-bg3/50"
        aria-expanded={open}
      >
        <span>{title}</span>
        <span className="font-mono text-gold">{open ? "−" : "+"}</span>
      </button>
      {open ? <div className="border-t border-bg4 px-4 py-4 text-sm text-cream/90">{children}</div> : null}
    </section>
  );
}
