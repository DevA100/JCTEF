import type { Metadata } from "next";
import { PageHero } from "@/components/sections/page-hero";
import { privacy, seo } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  ...seo.privacy,
  path: "/privacy",
});

/** Linked from the cookie banner and the footer. Copy: `privacy` in content.ts. */
export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow={privacy.eyebrow}
        title={privacy.title}
        text={privacy.text}
      />
      <section className="section">
        <div className="site-container">
          <div className="prose-jctef measure">
            {privacy.sections.map((section) => {
              const id = `privacy-${section.heading.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
              return (
                <section key={section.heading} aria-labelledby={id}>
                  <h2 id={id}>{section.heading}</h2>
                  {section.paragraphs.map((text) => (
                    <p key={text}>{text}</p>
                  ))}
                </section>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
