import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import Link from "next/link";
import { CruiseBadge } from "@/components/cruise/badge";
import { CruiseSteps } from "@/components/cruise/steps";
import { Cohorts } from "@/components/sections/cohorts";
import { ButtonLink } from "@/components/layout/button-link";
import { FeatureGrid } from "@/components/sections/feature-grid";
import { PageHero } from "@/components/sections/page-hero";
import { SectionHeading } from "@/components/sections/section-heading";
import { frameworkStages, institute, seo } from "@/lib/content";
import { cx } from "@/lib/cruise-utils";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = pageMetadata({ ...seo.institute, path: "/institute", absoluteTitle: true });

export default function InstitutePage() {
  const { framework, jhci, fellow } = institute;
  return (
    <>
      <PageHero eyebrow={institute.intro.eyebrow} title={institute.intro.title} text={institute.intro.text}>
        <ul className="flex flex-wrap gap-2" aria-label="Areas of work">
          {institute.intro.tags.map((tag) => (
            <li key={tag}>
              <CruiseBadge tone="surface">{tag}</CruiseBadge>
            </li>
          ))}
        </ul>
      </PageHero>

      <section aria-labelledby="why-institute-title" className="section">
        <div className="site-container grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
          <SectionHeading id="why-institute-title" eyebrow="Transform, equip, empower" title={institute.why.title}>
            <p>{institute.why.text}</p>
          </SectionHeading>
          <FeatureGrid items={institute.pillars} columns={2} className="lg:grid-cols-1" />
        </div>
      </section>

      <section id="framework" aria-labelledby="framework-title" className="on-deep section scroll-mt-20">
        <div className="site-container grid gap-10">
          <SectionHeading id="framework-title" eyebrow={framework.eyebrow} title={framework.title}>
            <p>{framework.text}</p>
          </SectionHeading>
          <Reveal as="ol" stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {frameworkStages.map((stage) => {
              const last = stage.number === frameworkStages.length;
              return (
                <li
                  key={stage.number}
                  className={cx("brutal brutal-static flex flex-col gap-3 p-5 md:p-6", last && "on-primary")}
                >
                  <div className="flex items-start gap-4">
                    <span
                      aria-hidden="true"
                      className={cx("font-display text-h2 leading-none font-extrabold", !last && "text-primary")}
                    >
                      {String(stage.number).padStart(2, "0")}
                    </span>
                    <h3 className="pt-1 font-display text-[1.1875rem] leading-tight font-extrabold">
                      <span className="visually-hidden">Stage {stage.number}: </span>
                      {stage.title}
                    </h3>
                  </div>
                  {stage.tagline && <p className={cx("italic", !last && "text-ink-muted")}>{stage.tagline}</p>}
                  {stage.summary && <p className="text-small">{stage.summary}</p>}
                  {stage.points && (
                    <ul className="grid gap-1.5 text-small">
                      {stage.points.map((point) => (
                        <li key={point} className="flex gap-2">
                          <span
                            aria-hidden="true"
                            className={cx("mt-[0.45em] size-1.5 shrink-0 rounded-full", last ? "bg-ink" : "bg-primary")}
                          />
                          {point}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </Reveal>
        </div>
      </section>

      <Cohorts joinHref="#fellow" />

      <section id="jhci" aria-labelledby="jhci-title" className="section scroll-mt-20">
        <div className="site-container grid gap-10">
          <SectionHeading id="jhci-title" eyebrow={jhci.eyebrow} title={jhci.title}>
            <p>{jhci.text}</p>
          </SectionHeading>
          <FeatureGrid items={jhci.dimensions} />
        </div>
      </section>

      <section aria-labelledby="serves-title" className="section bg-tint">
        <div className="site-container grid gap-10">
          <SectionHeading id="serves-title" eyebrow="Who we serve" title="Learning for everyone who builds human capital" />
          <FeatureGrid items={institute.serves} />
        </div>
      </section>

      <section id="fellow" aria-labelledby="fellow-title" className="section scroll-mt-20">
        <div className="site-container">
          <div className="brutal brutal-static grid gap-10 p-6 md:p-10">
            <SectionHeading id="fellow-title" eyebrow={fellow.eyebrow} title={fellow.title}>
              <p>{fellow.text}</p>
            </SectionHeading>
            <CruiseSteps steps={fellow.steps} current={0} label="How to become a JCTEF fellow" />
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <ButtonLink href={fellow.cta.href}>{fellow.cta.label}</ButtonLink>
              <Link href="/programmes#eligibility" className="text-link inline-flex min-h-11 items-center">
                Check the eligibility criteria
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
