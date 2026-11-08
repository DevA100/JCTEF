import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/sections/page-hero";
import { formatPostDate, getPosts } from "@/lib/blog";
import { blog } from "@/lib/content";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "Blog",
  description: "News and stories from JCTEF: our fellows, programmes, events and research.",
};

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <>
      <PageHero eyebrow={blog.eyebrow} title={blog.title} text={blog.text} />
      <section aria-label="Posts" className="section">
        <div className="site-container">
          <Reveal as="ul" stagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <li key={post.slug} className="brutal relative grid content-start overflow-hidden">
                {post.cover && (
                  <Image
                    src={post.cover.src}
                    alt=""
                    width={post.cover.width}
                    height={post.cover.height}
                    sizes="(min-width: 1024px) 380px, (min-width: 768px) 50vw, 100vw"
                    className="aspect-video h-auto w-full border-b-(length:--border-w) border-ink object-cover"
                  />
                )}
                <div className="grid content-start gap-3 p-6">
                  <time dateTime={post.date} className="text-small text-ink-muted">
                    {formatPostDate(post.date)}
                  </time>
                  <h2 className="font-display text-[1.375rem] leading-tight font-extrabold">
                    {/* The whole card is clickable through this link. */}
                    <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0 hover:underline">
                      {post.title}
                    </Link>
                  </h2>
                  <p className="text-small text-ink-muted">{post.excerpt}</p>
                </div>
              </li>
            ))}
          </Reveal>
        </div>
      </section>
    </>
  );
}
