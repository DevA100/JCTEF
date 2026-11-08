import { readdirSync } from "node:fs";
import path from "node:path";
import type { ComponentType } from "react";

/** Frontmatter at the top of each content/blog/<slug>.mdx file. */
export type PostFrontmatter = {
  title: string;
  /** YYYY-MM-DD */
  date: string;
  excerpt: string;
  author: string;
  cover?: { src: string; alt: string; width: number; height: number };
  /** Where the post lived on the old WordPress site. */
  oldUrl?: string;
};

export type Post = PostFrontmatter & { slug: string; Content: ComponentType };

const DIR = path.join(process.cwd(), "content", "blog");

export function getPostSlugs(): string[] {
  return readdirSync(DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.slice(0, -".mdx".length));
}

export async function getPost(slug: string): Promise<Post | null> {
  if (!getPostSlugs().includes(slug)) return null;
  const mod = (await import(`@content/blog/${slug}.mdx`)) as {
    default: ComponentType;
    frontmatter: PostFrontmatter;
  };
  return { slug, ...mod.frontmatter, Content: mod.default };
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
