import type { Metadata } from "next";
import Link from "next/link";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { getAllPosts } from "@/lib/blog";
import { SITE_URL } from "@/lib/site";

const DESC = "Updates on WorldFactbook.io data pipelines, methodology, and the free country intelligence API.";

export const metadata: Metadata = {
  title: "Blog",
  description: DESC,
  alternates: { canonical: "/blog/" },
  openGraph: {
    title: "Blog | WorldFactbook.io",
    description: DESC,
    url: `${SITE_URL}/blog/`,
  },
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "WorldFactbook.io Blog",
    description: DESC,
    url: `${SITE_URL}/blog/`,
    blogPost: posts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: `${SITE_URL}/blog/${p.slug}/`,
      datePublished: p.date,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <header className="mb-12 border-b border-[0.5px] border-[color:var(--line)] pb-10">
          <p className="font-mono text-xs uppercase tracking-widest text-muted">WorldFactbook.io</p>
          <h1 className="mt-3 font-display text-[40px] font-semibold text-cream">Blog</h1>
          <p className="mt-4 max-w-2xl font-sans text-sm leading-relaxed text-muted">{DESC}</p>
        </header>

        <ul className="grid gap-8 sm:grid-cols-2">
          {posts.map((post) => (
            <li key={post.slug}>
              <article className="flex h-full flex-col rounded-lg border-[0.5px] border-[color:var(--line)] bg-bg2/80 p-6 transition-colors hover:border-gold/30">
                <time dateTime={post.date} className="font-mono text-xs uppercase tracking-wide text-gold">
                  {post.date}
                </time>
                <h2 className="mt-3 font-display text-[22px] font-semibold leading-snug text-cream">
                  <Link href={`/blog/${post.slug}/`} className="hover:text-gold">
                    {post.title}
                  </Link>
                </h2>
                <p className="mt-3 flex-1 font-sans text-sm leading-relaxed text-muted">{post.description}</p>
                {post.tags.length ? (
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <li
                        key={tag}
                        className="rounded-full border border-bg4 bg-bg3/80 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide text-cream/80"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                ) : null}
                <Link
                  href={`/blog/${post.slug}/`}
                  className="mt-5 inline-flex font-mono text-sm font-bold text-gold hover:underline"
                >
                  Read more →
                </Link>
              </article>
            </li>
          ))}
        </ul>

        {posts.length === 0 ? (
          <p className="font-sans text-sm text-muted">No posts yet. Add markdown files under content/blog/.</p>
        ) : null}
      </main>
      <Footer />
    </>
  );
}
