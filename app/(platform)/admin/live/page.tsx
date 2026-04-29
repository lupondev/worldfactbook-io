import Link from "next/link";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminLivePage() {
  const blogs = await prisma.liveBlog.findMany({
    where: { deletedAt: null },
    orderBy: [{ startedAt: "desc" }, { createdAt: "desc" }],
    take: 100,
  });
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:px-6">
      <h1 className="font-display text-4xl text-cream">Live Blog Admin</h1>
      <p className="mt-2 text-sm text-muted">CRUD + manual updates (simple view).</p>
      <ul className="mt-6 space-y-2">
        {blogs.map((b) => (
          <li key={b.id} className="rounded border border-bg4 bg-bg2/70 p-4">
            <p className="font-display text-lg text-cream">{b.title}</p>
            <p className="mt-1 font-mono text-xs text-muted">
              {b.slug} · {b.status} · updates {b.updateCount}
            </p>
            <Link href={`/api/live/${b.slug}`} className="mt-2 inline-block font-mono text-xs text-gold hover:underline">
              Open API payload
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
