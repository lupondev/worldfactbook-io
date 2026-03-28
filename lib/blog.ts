import fs from "fs";
import matter from "gray-matter";
import path from "path";

const BLOG_DIR = path.join(process.cwd(), "content/blog");

export type BlogFrontmatter = {
  title: string;
  date: string;
  description: string;
  slug: string;
  tags: string[];
};

export type BlogPostMeta = BlogFrontmatter;

export type BlogPost = BlogFrontmatter & { content: string };

function listMarkdownFiles(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"));
}

function parseFile(file: string): { meta: BlogFrontmatter; content: string } {
  const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf8");
  const { data, content } = matter(raw);
  const d = data as Record<string, unknown>;
  const fileSlug = file.replace(/\.md$/i, "");
  const slug = typeof d.slug === "string" && d.slug ? d.slug : fileSlug;
  const tags = Array.isArray(d.tags) ? d.tags.filter((t): t is string => typeof t === "string") : [];
  const meta: BlogFrontmatter = {
    title: String(d.title ?? ""),
    date: String(d.date ?? ""),
    description: String(d.description ?? ""),
    slug,
    tags,
  };
  return { meta, content };
}

export function getAllPosts(): BlogPostMeta[] {
  const posts: BlogPostMeta[] = [];
  for (const file of listMarkdownFiles()) {
    const { meta } = parseFile(file);
    if (!meta.title || !meta.slug) continue;
    posts.push(meta);
  }
  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return posts;
}

export function getPostBySlug(slug: string): BlogPost | null {
  for (const file of listMarkdownFiles()) {
    const { meta, content } = parseFile(file);
    if (meta.slug === slug && meta.title) {
      return { ...meta, content };
    }
  }
  return null;
}

export function getPostSlugs(): string[] {
  return getAllPosts().map((p) => p.slug);
}

export function getRelatedPosts(currentSlug: string, tags: string[], limit = 3): BlogPostMeta[] {
  const all = getAllPosts().filter((p) => p.slug !== currentSlug);
  const scored = all.map((p) => ({
    post: p,
    score: p.tags.filter((t) => tags.includes(t)).length,
  }));
  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return new Date(b.post.date).getTime() - new Date(a.post.date).getTime();
  });
  return scored.slice(0, limit).map((s) => s.post);
}
