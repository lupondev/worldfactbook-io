export function AiSummaryBlock({ aiSummary }: { aiSummary: string | null }) {
  const paragraphs = aiSummary
    ? aiSummary
        .split(/\n\n+/)
        .map((p) => p.trim())
        .filter(Boolean)
    : [];

  return (
    <div className="rounded-lg border-[0.5px] border-[color:var(--line)] bg-bg2/80 p-5">
      <div className="mb-4 flex items-center gap-3">
        <span className="rounded border border-gold/40 bg-bg3 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest text-gold">
          AI Intel
        </span>
      </div>
      {paragraphs.length > 0 ? (
        <div className="space-y-4 text-sm leading-relaxed text-cream/90">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      ) : (
        <div className="flex items-center gap-3 text-sm text-muted">
          <span
            className="inline-block h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-gold border-t-transparent"
            aria-hidden
          />
          <span>Analysis generating…</span>
        </div>
      )}
    </div>
  );
}
