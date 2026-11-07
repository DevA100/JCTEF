import { Check } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { CruiseBadge } from "@/components/cruise/badge";
import { ButtonLink } from "@/components/layout/button-link";
import { FeatureGrid } from "@/components/sections/feature-grid";
import { Journey } from "@/components/sections/journey";
import { PageHero } from "@/components/sections/page-hero";
import { SectionHeading } from "@/components/sections/section-heading";
import { programmes } from "@/lib/content";

export const metadata: Metadata = {
  title: "Programmes",
  description:
    "The JCTEF Transformation Programme, Young Minds Initiative, Campus Transformation and Wellness Initiative, Business Summit and Annual Retreat.",
};

export default function ProgrammesPage() {
  return (
    <>
      <PageHero eyebrow={programmes.intro.eyebrow} title={programmes.intro.title} text={programmes.intro.text}>
        <nav aria-label="Programmes on this page">
          <ul className="flex flex-wrap gap-2">
            {programmes.initiatives.map((item) => (
              <li key={item.id}>
                <Link
                  href={`#${item.id}`}
                  className="inline-flex min-h-11 items-center rounded-brutal border-2 border-ink bg-surface px-4 font-medium hover:bg-primary"
                >
                  {item.title.replace(/^JCTEF /, "")}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </PageHero>

      <section aria-labelledby="focus-title" className="section">
        <div className="site-container grid gap-10">
          <SectionHeading id="focus-title" eyebrow="Our strategic focus" title="Four areas, one goal: productive people">
            <p>
              We believe lasting change begins by developing people before providing resources. Everything we run sits in one of these
              areas.
            </p>
          </SectionHeading>
          <FeatureGrid items={programmes.focusAreas} columns={4} numbered />
        </div>
      </section>

      <Journey showCta={false} />

      <section aria-labelledby="initiatives-title" className="section">
        <div className="site-container grid gap-10">
          <SectionHeading id="initiatives-title" eyebrow="Our initiatives" title="Programmes and initiatives" />
          <div className="grid gap-8">
            {programmes.initiatives.map((item, i) => (
              <article
                key={item.id}
                id={item.id}
                aria-labelledby={`${item.id}-title`}
                className="brutal brutal-static grid scroll-mt-24 gap-6 p-6 md:grid-cols-[1.1fr_1fr] md:gap-10 md:p-8"
              >
                <div className="grid content-start gap-4">
                  <CruiseBadge tone={i === 0 ? "primary" : "muted"} className="w-fit">
                    {item.tag}
                  </CruiseBadge>
                  <h3 id={`${item.id}-title`} className="text-h3 md:text-h2">
                    {item.title}
                  </h3>
                  <p className="text-ink-muted">{item.text}</p>
                  {item.cta && (
                    <div className="pt-2">
                      <ButtonLink href={item.cta.href}>{item.cta.label}</ButtonLink>
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="mb-3 text-label uppercase text-ink-muted">Focus areas</h4>
                  <ul className="grid gap-2.5">
                    {item.points.map((point) => (
                      <li key={point} className="flex gap-3">
                        <Check aria-hidden="true" strokeWidth={3} className="mt-0.5 size-5 shrink-0 text-success" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="impact-areas-title" className="section bg-tint">
        <div className="site-container grid gap-10">
          <SectionHeading id="impact-areas-title" eyebrow="Our impact" title="How we transform lives" />
          <FeatureGrid items={programmes.impactAreas} />
        </div>
      </section>

      <section id="eligibility" aria-labelledby="eligibility-title" className="section scroll-mt-20">
        <div className="site-container grid gap-10">
          <SectionHeading id="eligibility-title" eyebrow="Eligibility" title="How to join our programmes">
            <p>Many of our programmes are free, thanks to our partners and donors. Every applicant goes through screening first.</p>
          </SectionHeading>
          <FeatureGrid items={programmes.eligibility} columns={4} numbered />
          <div className="flex flex-col gap-4 sm:flex-row">
            <ButtonLink href="/institute#fellow">Become a JCTEF fellow</ButtonLink>
            <ButtonLink href="/contact" variant="secondary">
              Ask a question
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
