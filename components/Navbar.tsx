import Link from "next/link";

export function Navbar() {
  return (
    <header className="border-b border-bg4/80 bg-bg2/90 backdrop-blur-md sticky top-0 z-40">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-4 md:px-6">
        <Link href="/" className="group flex items-center gap-3">
          <span className="font-display text-xl tracking-tight text-cream md:text-2xl">
            World<span className="text-gold">Factbook</span>.io
          </span>
          <span className="hidden items-center gap-2 rounded-full border border-live/40 bg-bg3/80 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-live sm:inline-flex">
            <span className="live-dot inline-block h-2 w-2 rounded-full bg-live" aria-hidden />
            Live
          </span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-cream/90 md:flex">
          <Link className="hover:text-gold transition-colors" href="/countries/">
            Countries
          </Link>
          <Link className="hover:text-gold transition-colors" href="/odluke/">
            Odluke
          </Link>
          <Link className="hover:text-gold transition-colors" href="/entitet/">
            Entities
          </Link>
          <Link className="hover:text-gold transition-colors" href="/rankings/">
            Rankings
          </Link>
          <Link className="hover:text-gold transition-colors" href="/compare/">
            Compare
          </Link>
          <Link className="hover:text-gold transition-colors" href="/countries/?ai=1">
            AI Intel
          </Link>
          <Link className="hover:text-gold transition-colors" href="/api-docs/">
            API
          </Link>
          <Link className="hover:text-gold transition-colors" href="/blog/">
            Blog
          </Link>
        </nav>
        <Link
          href="/api-docs/"
          className="shrink-0 rounded border-2 border-gold px-3 py-2 font-mono text-xs font-bold uppercase tracking-wide text-gold transition-colors hover:bg-gold/10"
        >
          Free API →
        </Link>
      </div>
    </header>
  );
}
