import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PostCover } from "@/components/sections/post-cover";
import { formatPostDate, getPost, getPostSlugs } from "@/lib/blog";
import { site } from "@/lib/content";

// Unknown slugs fall through to notFound() in the page below.
export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};

  const url = `/blog/${slug}`;
  // The cover when there is one; otherwise a branded card with the title.
  const image = post.cover
    ? {
        url: post.cover.src,
        alt: post.cover.alt || post.title,
        ...(post.cover.width && post.cover.height ? { width: post.cover.width, height: post.cover.height } : {}),
      }
    : { url: `/og/blog/${slug}`, alt: post.title, width: 1200, height: 630, type: "image/png" };

  return {
    title: post.title,
    description: post.excerpt,
    authors: [{ name: post.author }],
    keywords: post.tags.length ? post.tags : undefined,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      siteName: site.name,
      locale: "en_NG",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags.length ? post.tags : undefined,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [image],
    },
  };
}

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const post = await getPost((await params).slug);
  if (!post) notFound();
  const { Content } = post;

  return (
    <article className="section">
      <div className="site-container grid gap-8">
        <Link href="/blog" className="text-link inline-flex min-h-11 w-fit items-center gap-2">
          <ArrowLeft aria-hidden="true" className="size-5" />
          All posts
        </Link>

        <header className="measure grid gap-4">
          <h1 className="text-h1 text-balance">{post.title}</h1>
          <p className="text-small text-ink-muted">
            <time dateTime={post.date}>{formatPostDate(post.date)}</time> · {post.author}
          </p>
        </header>

        <div className="brutal brutal-static max-w-3xl overflow-hidden">
          <PostCover cover={post.cover} title={post.title} variant="page" sizes="(min-width: 800px) 768px, 100vw" preload />
        </div>

        <div className="prose-jctef measure">
          <Content />
        </div>
      </div>
    </article>
  );
}
