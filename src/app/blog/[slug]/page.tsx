import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatPostDate, getPost, getPostSlugs } from "@/lib/blog";

// Unknown slugs fall through to notFound() in the page below.
export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const post = await getPost((await params).slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.date,
      images: post.cover ? [{ url: post.cover.src, width: post.cover.width, height: post.cover.height }] : undefined,
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

        {post.cover && (
          <div className="brutal brutal-static max-w-3xl overflow-hidden">
            <Image
              src={post.cover.src}
              alt={post.cover.alt}
              width={post.cover.width}
              height={post.cover.height}
              sizes="(min-width: 800px) 768px, 100vw"
              preload
              className="h-auto w-full"
            />
          </div>
        )}

        <div className="prose-jctef measure">
          <Content />
        </div>
      </div>
    </article>
  );
}
