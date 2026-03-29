import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BlogMarkdown } from "@/components/BlogMarkdown";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { getAllPosts, getPostBySlug, getRelatedPosts } from "@/lib/blog";
import { resolveFeaturedImage } from "@/lib/featured-image";
import { SITE_URL } from "@/lib/site";

type Props = { params: { slug: string } };

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPostBySlug(params.slug);
  if (!post) return { title: "Post not found" };
  const url = `${SITE_URL}/blog/${post.slug}/`;
  const featured = await resolveFeaturedImage({
    sourceUrl: post.sourceUrl,
    title: post.title,
    description: post.description,
  });
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `https://worldfactbook.io/blog/${post.slug}/` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url,
      publishedTime: post.date,
      images: [{ url: featured.url }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [featured.url],
    },
  };
}

export default async function BlogArticlePage({ params }: Props) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  const related = getRelatedPosts(post.slug, post.tags, 3);
  const url = `${SITE_URL}/blog/${post.slug}/`;
  const featured = await resolveFeaturedImage({
    sourceUrl: post.sourceUrl,
    title: post.title,
    description: post.description,
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    image: featured.url,
    author: {
      "@type": "Organization",
      name: "WorldFactbook.io",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "WorldFactbook.io",
      url: SITE_URL,
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    ...(post.tags.length ? { keywords: post.tags.join(", ") } : {}),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <main className="mx-auto max-w-[720px] px-4 py-10 md:px-6">
        <article>
          <header className="mb-10 border-b border-[0.5px] border-[color:var(--line)] pb-8">
            <p className="font-mono text-xs uppercase tracking-widest text-muted">
              <Link href="/blog/" className="text-muted hover:text-gold">
                Blog
              </Link>
            </p>
            <time dateTime={post.date} className="mt-4 block font-mono text-sm text-gold">
              {post.date}
            </time>
            <h1 className="mt-3 font-display text-4xl font-semibold leading-tight text-cream md:text-[2.5rem]">{post.title}</h1>
            <p className="mt-4 font-sans text-base leading-[1.8] text-muted">{post.description}</p>
            {post.tags.length ? (
              <ul className="mt-5 flex flex-wrap gap-2">
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
          </header>

          <BlogMarkdown content={post.content} />
        </article>

        {related.length ? (
          <section className="mt-16 border-t border-[0.5px] border-[color:var(--line)] pt-12">
            <h2 className="font-display text-2xl font-semibold text-cream">Related articles</h2>
            <ul className="mt-6 space-y-4">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link href={`/blog/${r.slug}/`} className="group block rounded-lg border-[0.5px] border-[color:var(--line)] bg-bg2/60 p-4 transition-colors hover:border-gold/30">
                    <span className="font-mono text-xs text-gold">{r.date}</span>
                    <span className="mt-1 block font-display text-lg text-cream group-hover:text-gold">{r.title}</span>
                    <span className="mt-2 block font-sans text-sm text-muted">{r.description}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </main>
      <Footer />
    </>
  );
}
