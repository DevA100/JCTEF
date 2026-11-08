import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import type { ComponentType } from "react";

export type PostCover = {
  src: string;
  alt: string;
  /** Known for the migrated covers; optional for new ones. */
  width?: number;
  height?: number;
};

/**
 * Frontmatter at the top of each content/blog/<slug>.mdx file.
 *
 *   title: "…"
 *   date: "YYYY-MM-DD"
 *   excerpt: "…"            (used for the card, meta description and Open Graph)
 *   author: "JCTEF"
 *   cover:                  (optional; leave out or empty for a branded placeholder)
 *     src: "/images/blog/<slug>.png"   or a res.cloudinary.com URL
 *     alt: "…"
 *     width: 1273           (optional)
 *     height: 511           (optional)
 *   tags: ["…"]             (optional)
 *   oldUrl: "…"             (migrated posts only)
 *
 * The flat form `cover: "<url>"` plus `coverAlt: "…"` is accepted too. The URL
 * always comes from the file name; a `slug` field is ignored.
 */
type RawFrontmatter = {
  title: string;
  date: string | Date;
  excerpt?: string;
  author?: string;
  cover?: string | Partial<PostCover> | null;
  coverAlt?: string;
  tags?: string[] | string;
  slug?: string;
  oldUrl?: string;
};

export type PostFrontmatter = {
  title: string;
  /** YYYY-MM-DD */
  date: string;
  excerpt: string;
  author: string;
  cover?: PostCover;
  tags: string[];
  /** Where the post lived on the old WordPress site. */
  oldUrl?: string;
};

export type Post = PostFrontmatter & { slug: string; Content: ComponentType };

const DIR = path.join(process.cwd(), "content", "blog");
const PUBLIC = path.join(process.cwd(), "public");

export function getPostSlugs(): string[] {
  return readdirSync(DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.slice(0, -".mdx".length));
}

/** A usable cover, or undefined so the branded placeholder is shown instead. */
function normaliseCover(raw: RawFrontmatter, slug: string): PostCover | undefined {
  const value = typeof raw.cover === "string" ? { src: raw.cover } : (raw.cover ?? {});
  const src = value.src?.trim();
  if (!src) return undefined;

  if (src.startsWith("/")) {
    // A local file that isn't there would be a broken image: skip it.
    if (!existsSync(path.join(PUBLIC, src))) {
      console.warn(`Blog post "${slug}": cover ${src} is not in public/, showing the placeholder.`);
      return undefined;
    }
  } else if (!src.startsWith("https://res.cloudinary.com/")) {
    console.warn(`Blog post "${slug}": cover must be in public/ or on res.cloudinary.com, showing the placeholder.`);
    return undefined;
  }

  const width = Number(value.width) || undefined;
  const height = Number(value.height) || undefined;
  return {
    src,
    alt: (value.alt ?? raw.coverAlt ?? "").trim(),
    ...(width && height ? { width, height } : {}),
  };
}

function normalise(raw: RawFrontmatter, slug: string): PostFrontmatter {
  const date = raw.date instanceof Date ? raw.date.toISOString().slice(0, 10) : String(raw.date).slice(0, 10);
  const tags = Array.isArray(raw.tags) ? raw.tags : raw.tags ? raw.tags.split(",") : [];
  return {
    title: raw.title,
    date,
    excerpt: raw.excerpt?.trim() ?? "",
    author: raw.author?.trim() || "JCTEF",
    cover: normaliseCover(raw, slug),
    tags: tags.map((t) => String(t).trim()).filter(Boolean),
    ...(raw.oldUrl ? { oldUrl: raw.oldUrl } : {}),
  };
}

export async function getPost(slug: string): Promise<Post | null> {
  if (!getPostSlugs().includes(slug)) return null;
  const mod = (await import(`@content/blog/${slug}.mdx`)) as {
    default: ComponentType;
    frontmatter: RawFrontmatter;
  };
  return { slug, ...normalise(mod.frontmatter, slug), Content: mod.default };
}

/** All posts, newest first. */
export async function getPosts(): Promise<Post[]> {
  const posts = await Promise.all(getPostSlugs().map(getPost));
  return posts.filter((p): p is Post => p !== null).sort((a, b) => b.date.localeCompare(a.date));
}

export function formatPostDate(date: string): string {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${date}T00:00:00Z`),
  );
}
