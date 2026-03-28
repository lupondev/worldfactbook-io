import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function BlogMarkdown({ content }: { content: string }) {
  return (
    <div className="blog-md">
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => (
          <h1 className="mb-6 mt-10 font-display text-3xl font-semibold tracking-tight text-cream first:mt-0">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="mb-4 mt-10 font-display text-2xl font-semibold text-cream">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="mb-3 mt-8 font-display text-xl font-semibold text-cream">{children}</h3>
        ),
        p: ({ children }) => <p className="mb-5 font-sans text-base leading-[1.8] text-cream/90">{children}</p>,
        ul: ({ children }) => <ul className="mb-5 list-disc space-y-2 pl-6 font-sans text-base leading-[1.8] text-cream/90">{children}</ul>,
        ol: ({ children }) => <ol className="mb-5 list-decimal space-y-2 pl-6 font-sans text-base leading-[1.8] text-cream/90">{children}</ol>,
        li: ({ children }) => <li className="marker:text-gold">{children}</li>,
        a: ({ href, children }) => (
          <a href={href} className="text-gold underline decoration-gold/40 underline-offset-2 hover:decoration-gold">
            {children}
          </a>
        ),
        strong: ({ children }) => <strong className="font-semibold text-cream">{children}</strong>,
        em: ({ children }) => <em className="italic text-cream/90">{children}</em>,
        hr: () => <hr className="my-10 border-[color:var(--line)]" />,
        blockquote: ({ children }) => (
          <blockquote className="my-6 border-l-4 border-gold bg-bg3/40 py-3 pl-5 pr-4 font-sans text-base italic leading-[1.8] text-cream/85">
            {children}
          </blockquote>
        ),
        code: ({ className, children }) => {
          const isBlock = Boolean(className?.includes("language-"));
          if (isBlock) {
            return <code className={`${className} font-mono text-[13px] text-cream`}>{children}</code>;
          }
          return (
            <code className="rounded bg-bg3 px-1.5 py-0.5 font-mono text-[0.9em] text-gold2">{children}</code>
          );
        },
        pre: ({ children }) => (
          <pre className="mb-6 overflow-x-auto rounded-lg border-[0.5px] border-[color:var(--line)] bg-bg p-4 font-mono text-[13px] leading-relaxed text-cream [&>code]:bg-transparent [&>code]:p-0">
            {children}
          </pre>
        ),
        table: ({ children }) => (
          <div className="mb-6 overflow-x-auto">
            <table className="w-full border-collapse border-[0.5px] border-[color:var(--line)] text-left text-sm">{children}</table>
          </div>
        ),
        thead: ({ children }) => <thead className="bg-bg3">{children}</thead>,
        th: ({ children }) => (
          <th className="border-[0.5px] border-[color:var(--line)] px-3 py-2 font-mono text-xs uppercase tracking-wide text-gold">{children}</th>
        ),
        td: ({ children }) => (
          <td className="border-[0.5px] border-[color:var(--line)] px-3 py-2 font-sans text-cream/90">{children}</td>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
    </div>
  );
}
