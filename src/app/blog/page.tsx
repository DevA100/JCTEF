import { Newspaper } from "lucide-react";
import type { Metadata } from "next";
import { ButtonLink } from "@/components/layout/button-link";
import { PageHero } from "@/components/sections/page-hero";
import { blog, site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Blog",
  description: "News and stories from JCTEF: our fellows, programmes, events and research.",
};

export default function BlogPage() {
  const instagram = site.socials.find((s) => s.label === "Instagram")?.href;

  return (
    <>
      <PageHero eyebrow={blog.eyebrow} title={blog.title} text={blog.text} />
      <section aria-label="Posts" className="section">
        <div className="site-container">
          {blog.posts.length > 0 ? (
            <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {blog.posts.map((post) => (
                <li key={post.slug} className="brutal brutal-static grid content-start gap-3 p-6">
                  <time dateTime={post.date} className="text-small text-ink-muted">
                    {post.date}
                  </time>
                  <h2 className="text-h3">{post.title}</h2>
                  <p className="text-ink-muted">{post.excerpt}</p>
                </li>
              ))}
            </ul>
          ) : (
            // Placeholder until posts are added in content.ts.
            <div className="brutal brutal-static mx-auto grid max-w-xl justify-items-center gap-4 p-8 text-center md:p-12">
              <span className="grid size-14 place-items-center rounded-brutal border-2 border-ink bg-tint">
                <Newspaper aria-hidden="true" className="size-7" />
              </span>
              <h2 className="text-h3">Stories are on their way</h2>
              <p className="text-ink-muted">
                We are writing up news from our first cohort, RESET 2027 and our partners. Subscribe to the newsletter to hear when the first
                posts go live.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/#newsletter">Get updates</ButtonLink>
                {instagram && (
                  <ButtonLink href={instagram} variant="secondary">
                    Follow on Instagram
                  </ButtonLink>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
