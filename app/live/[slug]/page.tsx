import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const blog = await prisma.liveBlog.findUnique({ where: { slug: params.slug } });
  if (!blog) return { title: "Live not found" };
  return {
    title: blog.title,
    description: blog.description,
  };
}

export default async function LiveBlogPage({ params }: { params: { slug: string } }) {
  const blog = await prisma.liveBlog.findUnique({
    where: { slug: params.slug },
    include: {
      updates: {
        where: { status: "published", deletedAt: null },
        orderBy: [{ pinned: "desc" }, { publishedAt: "desc" }],
        take: 300,
      },
    },
  });
  if (!blog) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LiveBlogPosting",
    headline: blog.title,
    description: blog.description,
    datePublished: blog.startedAt?.toISOString() || blog.createdAt.toISOString(),
    dateModified: blog.updatedAt.toISOString(),
    url: `https://worldfactbook.io/live/${blog.slug}/`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-10 md:px-6">
        <p className="font-mono text-xs uppercase tracking-wider text-muted">
          <Link href="/" className="text-gold hover:underline">Naslovna</Link> &gt; Live &gt; {blog.title}
        </p>
        <h1 className="mt-3 font-display text-4xl text-cream">{blog.title}</h1>
        <p className="mt-2 text-sm text-muted">{blog.subtitle || blog.description}</p>
        <ul className="mt-6 space-y-3">
          {blog.updates.map((u) => (
            <li key={u.id} className="rounded border border-bg4 bg-bg2/70 p-4">
              <p className="font-mono text-xs text-muted">{u.publishedAt.toISOString()}</p>
              <p className="mt-1 font-display text-xl text-cream">{u.headline || "Update"}</p>
              <p className="mt-2 text-sm text-cream/90 whitespace-pre-line">{u.body}</p>
              {u.relatedArticleSlug ? (
                <Link href={`/article/${u.relatedArticleSlug}/`} className="mt-2 inline-block font-mono text-xs text-gold hover:underline">
                  Pročitaj više →
                </Link>
              ) : null}
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </>
  );
}
