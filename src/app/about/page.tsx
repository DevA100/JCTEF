import type { Metadata } from "next";
import { CruiseAccordion } from "@/components/cruise/accordion";
import { ButtonLink } from "@/components/layout/button-link";
import { TrustLine } from "@/components/layout/trust-line";
import { Founder } from "@/components/sections/founder";
import { PageHero } from "@/components/sections/page-hero";
import { SectionHeading } from "@/components/sections/section-heading";
import { Team } from "@/components/sections/team";
import { VisionValues } from "@/components/sections/vision-values";
import { about, audiences } from "@/lib/content";

export const metadata: Metadata = {
  title: "About us",
  description:
    "Why JCTEF exists, who we serve, our vision, mission and values, and the story of our founder, Chidimma Jacob Angel.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow={about.intro.eyebrow} title={about.intro.title} text={about.intro.text[0]} />

      <section aria-labelledby="who-title" className="section">
        <div className="site-container grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          <div className="grid content-start gap-5">
            <h2 id="who-title" className="text-h2">
              What we do
            </h2>
            {about.intro.text.slice(1).map((p) => (
              <p key={p} className="measure text-ink-muted">
                {p}
              </p>
            ))}
            <h3 className="mt-4 text-h3">Who we serve</h3>
            <ul className="grid gap-2">
              {audiences.map((a) => (
                <li key={a.title} className="flex gap-3">
                  <span aria-hidden="true" className="mt-2 size-2.5 shrink-0 bg-primary" />
                  {a.sentence?.startsWith(a.title) ? (
                    <span>
                      <strong>{a.title}</strong>
                      <span className="text-ink-muted">{a.sentence.slice(a.title.length)}</span>
                    </span>
                  ) : (
                    <span>
                      <strong>{a.title}.</strong> <span className="text-ink-muted">{a.text}</span>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div className="on-primary brutal brutal-static grid content-center gap-3 p-6 md:p-10">
            {about.intro.ripple.map((line, i) => (
              <p key={line} className={i === 2 ? "font-display text-h3 font-extrabold" : "font-display text-[1.25rem] font-bold"}>
                {line}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="why-title" className="on-deep section">
        <div className="site-container grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
          <SectionHeading id="why-title" eyebrow={about.why.eyebrow} title={about.why.title}>
            {about.why.text.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </SectionHeading>
          <ul className="grid content-center gap-3">
            {about.why.affirmations.map((line) => (
              <li key={line} className="brutal brutal-static px-5 py-4 font-display text-h3 font-extrabold">
                {line}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Founder />

      <Team />

      <div className="bg-tint">
        <VisionValues />
        <div className="site-container -mt-8 pb-12 md:-mt-12 md:pb-16">
          <TrustLine full />
        </div>
      </div>

      <section aria-labelledby="faq-title" className="section">
        <div className="site-container grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
          <div className="grid content-start gap-6">
            <SectionHeading id="faq-title" eyebrow="FAQs" title="Questions people ask us" />
            <div>
              <ButtonLink href="/contact" variant="secondary">
                Ask us something else
              </ButtonLink>
            </div>
          </div>
          <CruiseAccordion
            items={about.faq.map((item, i) => ({
              value: `faq-${i}`,
              title: item.q,
              content: (
                <div className="grid gap-3">
                  {item.a.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              ),
            }))}
          />
        </div>
      </section>
    </>
  );
}
