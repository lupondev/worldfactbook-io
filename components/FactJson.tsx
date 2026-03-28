function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function stripHtml(s: string) {
  return s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export function FactJson({ value, depth = 0 }: { value: unknown; depth?: number }) {
  if (value == null) return <span className="text-muted">—</span>;

  if (typeof value === "string") {
    return <p className="whitespace-pre-wrap text-cream/90">{stripHtml(value)}</p>;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return <span className="font-mono text-gold2">{String(value)}</span>;
  }

  if (Array.isArray(value)) {
    return (
      <ul className="list-disc space-y-2 pl-5">
        {value.map((item, i) => (
          <li key={i}>
            <FactJson value={item} depth={depth + 1} />
          </li>
        ))}
      </ul>
    );
  }

  if (isPlainObject(value)) {
    if ("text" in value && typeof (value as { text?: unknown }).text === "string") {
      const note = (value as { note?: string }).note;
      return (
        <div className="space-y-2">
          <p className="whitespace-pre-wrap text-cream/90">{stripHtml((value as { text: string }).text)}</p>
          {note ? (
            <p className="text-xs text-muted [&_strong]:text-cream/80" dangerouslySetInnerHTML={{ __html: note }} />
          ) : null}
        </div>
      );
    }

    const entries = Object.entries(value).filter(([k]) => k !== "note" || depth > 0);
    return (
      <div className={depth === 0 ? "space-y-4" : "ml-0 space-y-3 border-l border-bg4 pl-3"}>
        {entries.map(([k, v]) => (
          <div key={k}>
            <h4 className="font-mono text-xs font-bold uppercase tracking-wide text-gold">{k}</h4>
            <div className="mt-1">
              <FactJson value={v} depth={depth + 1} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return <span className="text-muted">{String(value)}</span>;
}
