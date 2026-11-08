import { Check } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/layout/button-link";
import { TrustLine } from "@/components/layout/trust-line";
import { FeatureGrid } from "@/components/sections/feature-grid";
import { PageHero } from "@/components/sections/page-hero";
import { SectionHeading } from "@/components/sections/section-heading";
import { PartnerForm } from "@/components/sections/partner-form";
import { VolunteerForm } from "@/components/sections/volunteer-form";
import { getInvolved } from "@/lib/content";
import { partnershipEmail } from "@/lib/partnership";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "Get involved",
  description:
    "Volunteer, partner with JCTEF, become a JCTEF fellow or donate to help young people move from potential to productivity.",
};

const jumpLinks = [
  { label: "Volunteer", href: "#volunteer" },
  { label: "Partner", href: "#partner" },
  { label: "Become a fellow", href: "#fellow" },
  { label: "Donate", href: "#donate" },
];

export default function GetInvolvedPage() {
  const { volunteer, partner, fellow, donate } = getInvolved;
  const partnerEmail = partnershipEmail();
  return (
    <>
      <PageHero eyebrow={getInvolved.intro.eyebrow} title={getInvolved.intro.title} text={getInvolved.intro.text}>
        <nav aria-label="Ways to get involved">
          <ul className="flex flex-wrap gap-2">
            {jumpLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex min-h-11 items-center rounded-brutal border-2 border-ink bg-surface px-4 font-medium hover:bg-primary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </PageHero>

      {/* Volunteer */}
      <section id="volunteer" aria-labelledby="volunteer-title" className="section scroll-mt-20">
        <div className="site-container grid gap-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionHeading id="volunteer-title" eyebrow={volunteer.eyebrow} title={volunteer.title}>
              <p>{volunteer.text}</p>
            </SectionHeading>
            <ButtonLink href={volunteer.formUrl} className="shrink-0">
              Apply to volunteer
            </ButtonLink>
          </div>
          <div className="on-primary brutal brutal-static grid gap-5 p-6 md:grid-cols-[1.4fr_1fr] md:items-center md:gap-10 md:p-8">
            <div className="grid gap-3">
              <h3 className="text-h3 md:text-h2">{volunteer.facilitator.title}</h3>
              <p>{volunteer.facilitator.text}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row md:flex-col md:items-start lg:flex-row">
              <ButtonLink href={volunteer.facilitator.cta.href} variant="secondary">
                {volunteer.facilitator.cta.label}
              </ButtonLink>
              <ButtonLink href={volunteer.facilitator.apply.href} variant="inverted">
                {volunteer.facilitator.apply.label}
              </ButtonLink>
            </div>
          </div>
          <Reveal as="ul" stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {volunteer.roles.map((role) => (
              <li key={role.title} className="brutal brutal-static grid content-start gap-2 p-5 md:p-6">
                <h3 className="font-display text-[1.25rem] leading-tight font-extrabold">{role.title}</h3>
                <p className="font-bold">{role.tagline}</p>
                <p className="text-ink-muted">{role.text}</p>
              </li>
            ))}
          </Reveal>
          <div className="grid gap-5">
            <h3 className="text-h3">What you gain as a JCTEF volunteer</h3>
            <FeatureGrid items={volunteer.benefits} columns={4} />
          </div>

          {/* JCTEF's own application form (replaces the Google Form). */}
          <div id="volunteer-form" className="grid scroll-mt-24 gap-6 lg:grid-cols-[1fr_1.6fr] lg:gap-12">
            <div className="grid content-start gap-3">
              <p className="eyebrow">{volunteer.form.eyebrow}</p>
              <h3 className="text-h2">{volunteer.form.title}</h3>
              <p className="text-ink-muted">{volunteer.form.text}</p>
            </div>
            <div className="brutal brutal-static p-5 md:p-8">
              <VolunteerForm />
            </div>
          </div>
        </div>
      </section>

      {/* Partner */}
      <section id="partner" aria-labelledby="partner-title" className="on-deep section scroll-mt-20">
        <div className="site-container grid gap-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionHeading id="partner-title" eyebrow={partner.eyebrow} title={partner.title}>
              <p>{partner.text}</p>
            </SectionHeading>
            <ButtonLink href={partner.cta.href} className="shrink-0">
              {partner.cta.label}
            </ButtonLink>
          </div>
          <Reveal as="ul" stagger className="grid gap-5 md:grid-cols-2">
            {partner.groups.map((group) => (
              <li key={group.title} className="brutal brutal-static grid content-start gap-3 p-6">
                <h3 className="text-h3">{group.title}</h3>
                <p className="font-bold text-primary">{group.tagline}</p>
                <ul className="grid gap-2">
                  {group.items.map((item) => (
                    <li key={item} className="flex gap-3">
                      <Check aria-hidden="true" strokeWidth={3} className="mt-0.5 size-5 shrink-0 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </Reveal>

          {/* Partnership enquiry form (replaces the old mailto link). */}
          <div id="partner-form" className="grid scroll-mt-24 gap-6 lg:grid-cols-[1fr_1.6fr] lg:gap-12">
            <div className="grid content-start gap-3">
              <p className="eyebrow">{partner.eyebrow}</p>
              <h3 className="text-h2">{partner.form.title}</h3>
              <p className="text-ink-muted">{partner.form.text}</p>
            </div>
            <div className="grid gap-4">
              <div className="on-light brutal brutal-static p-5 md:p-8">
                <PartnerForm teamEmail={partnerEmail} />
              </div>
              <p className="text-small text-ink-muted">
                {partner.form.fallback}{" "}
                <a href={`mailto:${partnerEmail}`} className="text-link">
                  {partnerEmail}
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="partner-benefits-title" className="section">
        <div className="site-container grid gap-10">
          <SectionHeading id="partner-benefits-title" eyebrow="Why partner with us" title="What partners get" />
          <FeatureGrid items={partner.benefits} />
        </div>
      </section>

      {/* Fellow + donate */}
      <section aria-label="Become a fellow or donate" className="section bg-tint">
        <div className="site-container grid gap-6 md:grid-cols-2">
          <article
            id="fellow"
            aria-labelledby="fellow-title"
            className="brutal brutal-static grid scroll-mt-24 content-start gap-4 p-6 md:p-8"
          >
            <p className="eyebrow">{fellow.eyebrow}</p>
            <h2 id="fellow-title" className="text-h2">
              {fellow.title}
            </h2>
            <p className="text-ink-muted">{fellow.text}</p>
            <div className="pt-2">
              <ButtonLink href={fellow.cta.href} variant="secondary">
                {fellow.cta.label}
              </ButtonLink>
            </div>
          </article>
          <article
            id="donate"
            aria-labelledby="donate-title"
            className="on-primary brutal brutal-static grid scroll-mt-24 content-start gap-4 p-6 md:p-8"
          >
            <p className="eyebrow">{donate.eyebrow}</p>
            <h2 id="donate-title" className="text-h2">
              {donate.title}
            </h2>
            <p>{donate.text}</p>
            <div className="pt-2">
              <ButtonLink href={donate.cta.href} variant="inverted">
                {donate.cta.label}
              </ButtonLink>
            </div>
            <TrustLine />
          </article>
        </div>
      </section>
    </>
  );
}
