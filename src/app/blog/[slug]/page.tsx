import { TrackPostRead } from "@/components/analytics/trackers";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PostCover } from "@/components/sections/post-cover";
import { formatPostDate, getPost, getPostSlugs } from "@/lib/blog";
import { cloudinaryTransform } from "@/lib/cloudinary";
import { pageMetadata, SHARE_IMAGE_SIZE } from "@/lib/metadata";

// Unknown slugs fall through to notFound() in <Post> below.
export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

/** Exactly 1200 × 630 JPG: some apps don't show WebP or AVIF in previews. */
const SHARE_CROP = "c_fill,g_auto,w_1200,h_630,f_jpg,q_75";

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};

  const cover = post.cover;
  const alt = cover?.alt || post.title;
  const images = !cover
    ? // No cover: the post's own card from ./opengraph-image.tsx.
      [{ url: `/blog/${slug}/opengraph-image/card`, ...SHARE_IMAGE_SIZE, alt: post.title, type: "image/png" }]
    : cover.src.startsWith("https://res.cloudinary.com/")
      ? [{ url: cloudinaryTransform(cover.src, SHARE_CROP), ...SHARE_IMAGE_SIZE, alt, type: "image/jpeg" }]
      : [{ url: cover.src, alt, ...(cover.width && cover.height ? { width: cover.width, height: cover.height } : {}) }];

  return {
    ...pageMetadata({
      title: post.title,
      description: post.description,
      path: `/blog/${slug}`,
      images,
      openGraph: {
        type: "article",
        publishedTime: post.date,
        authors: [post.author],
        ...(post.tags.length ? { tags: post.tags } : {}),
      },
    }),
    authors: [{ name: post.author }],
    ...(post.tags.length ? { keywords: post.tags } : {}),
  };
}

/**
 * The "All posts" link is the route's shared App Shell, prefetched by every
 * link to a post. The post itself depends on the URL, so it renders inside
 * <Suspense> (Partial Prefetching: nothing URL-specific may sit in the shell).
 * Every post is prerendered at build time, so a full page load still gets
 * the complete HTML; the placeholder only shows during client navigation.
 * An unknown slug shows the not-found page with a noindex tag.
 */
export default function PostPage({ params }: PageProps<"/blog/[slug]">) {
  return (
    <article className="section">
      <div className="site-container grid gap-8">
        <Link href="/blog" className="text-link inline-flex min-h-11 w-fit items-center gap-2">
          <ArrowLeft aria-hidden="true" className="size-5" />
          All posts
        </Link>
        <Suspense fallback={<PostPlaceholder />}>
          <Post params={params} />
        </Suspense>
      </div>
    </article>
  );
}

function PostPlaceholder() {
  return (
    <div aria-busy="true" className="grid gap-8">
      <span className="visually-hidden" role="status">
        Loading the post…
      </span>
      <div aria-hidden="true" className="measure grid gap-4">
        <div className="h-10 w-4/5 animate-pulse bg-tint motion-reduce:animate-none" />
        <div className="h-4 w-48 animate-pulse bg-tint motion-reduce:animate-none" />
      </div>
      <div aria-hidden="true" className="brutal brutal-static aspect-[16/9] max-w-3xl animate-pulse bg-tint motion-reduce:animate-none" />
    </div>
  );
}

async function Post({ params }: Pick<PageProps<"/blog/[slug]">, "params">) {
  const post = await getPost((await params).slug);
  if (!post) notFound();
  const { Content } = post;

  return (
    <>
      <header className="measure grid gap-4">
        <h1 className="text-h1 text-balance">{post.title}</h1>
        <p className="text-small text-ink-muted">
          <time dateTime={post.date}>{formatPostDate(post.date)}</time> · {post.author}
        </p>
      </header>

      <div className="brutal brutal-static max-w-3xl overflow-hidden">
        <PostCover cover={post.cover} title={post.title} variant="page" sizes="(min-width: 800px) 768px, 100vw" preload />
      </div>

      <TrackPostRead slug={post.slug} className="prose-jctef measure">
        <Content />
      </TrackPostRead>
    </>
  );
}
