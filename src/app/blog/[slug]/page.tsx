import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PostCover } from "@/components/sections/post-cover";
import { formatPostDate, getPost, getPostSlugs } from "@/lib/blog";
import { cloudinaryTransform } from "@/lib/cloudinary";
import { pageMetadata, SHARE_IMAGE_SIZE } from "@/lib/metadata";

// Unknown slugs fall through to notFound() in the page below.
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
      description: post.excerpt,
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
