import { MapPin } from "lucide-react";
import Link from "next/link";
import { CruiseTabs } from "@/components/cruise/tabs";
import { ButtonLink } from "@/components/layout/button-link";
import { Reveal } from "@/components/motion/reveal";
import { type Cohort, cohortsNewestFirst } from "@/lib/content";
import { FellowStory } from "./fellow-story";
import { SectionHeading } from "./section-heading";
import { TeamPhoto } from "./team-photo";

const CLOSING_MEETUP_POST = "/blog/transformation-programme-cohort-1-closing-meetup";

/** "15 August – 7 November 2026", or with both years when they differ. */
function dateRange(start: string, end: string): string {
  const day = (iso: string, withYear: boolean) =>
    new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "long",
      ...(withYear && { year: "numeric" }),
      timeZone: "UTC",
    }).format(new Date(`${iso}T00:00:00Z`));
  const sameYear = start.slice(0, 4) === end.slice(0, 4);
  return `${day(start, !sameYear)} – ${day(end, true)}`;
}

function Details({ cohort }: { cohort: Cohort }) {
  return (
    <p className="text-small font-bold text-ink-muted">
      {dateRange(cohort.startDate, cohort.endDate)} · {cohort.format}
    </p>
  );
}

function Fellows({ cohort }: { cohort: Cohort }) {
  return (
    <Reveal as="ul" stagger className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
      {cohort.fellows.map((fellow) => (
        <li key={fellow.name} className="brutal brutal-static flex flex-col overflow-hidden bg-surface">
          <TeamPhoto
            src={fellow.image || undefined}
            name={fellow.name}
            alt={`${fellow.name}, JCTEF ${cohort.title} fellow`}
            sizes="(min-width: 1024px) 290px, 50vw"
          />
          <div className="flex flex-1 flex-col gap-4 border-t-2 border-ink p-4 md:p-5">
            <div className="grid min-w-0 gap-1">
              <h3 className="font-display text-[1.0625rem] leading-tight font-extrabold md:text-[1.1875rem]">{fellow.name}</h3>
              <p className="text-small font-bold text-success">{fellow.profession}</p>
              <p className="mt-1 flex items-center gap-1.5 text-small text-ink-muted">
                <MapPin aria-hidden="true" className="size-4 shrink-0" />
                {fellow.location}
              </p>
            </div>
            {fellow.testimonial && (
              <div className="mt-auto">
                <FellowStory name={fellow.name} testimonial={fellow.testimonial} />
              </div>
            )}
          </div>
        </li>
      ))}
    </Reveal>
  );
}

/**
 * "Meet Cohort 1" on /institute. With one cohort it's a single section;
 * once a second cohort is added to `cohorts` in content.ts, each gets a tab
 * (newest first).
 */
export function Cohorts({ joinHref }: { joinHref: string }) {
  if (cohortsNewestFirst.length === 0) return null;
  const [only] = cohortsNewestFirst;
  const single = cohortsNewestFirst.length === 1;

  return (
    <section id="cohorts" aria-labelledby="cohorts-title" className="section bg-tint scroll-mt-20">
      <div className="site-container grid gap-10">
        {single ? (
          <SectionHeading id="cohorts-title" eyebrow="Our fellows" title={`Meet ${only.title}`}>
            <p>{only.summary}</p>
            <Details cohort={only} />
          </SectionHeading>
        ) : (
          <SectionHeading id="cohorts-title" eyebrow="Our fellows" title="Meet our fellows" />
        )}

        {single ? (
          <Fellows cohort={only} />
        ) : (
          <CruiseTabs
            label="Cohorts"
            keepMounted
            items={cohortsNewestFirst.map((cohort) => ({
              value: String(cohort.number),
              label: cohort.title,
              content: (
                <div className="grid gap-6 pt-6">
                  <div className="grid max-w-[65ch] gap-2">
                    <p>{cohort.summary}</p>
                    <Details cohort={cohort} />
                  </div>
                  <Fellows cohort={cohort} />
                </div>
              ),
            }))}
          />
        )}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <ButtonLink href={joinHref} track="cohort_join_clicked">
            Join the next cohort
          </ButtonLink>
          <Link href={CLOSING_MEETUP_POST} className="text-link inline-flex min-h-11 items-center">
            Read about the Cohort 1 closing meetup
          </Link>
        </div>
      </div>
    </section>
  );
}
