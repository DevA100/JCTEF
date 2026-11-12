import { MapPin } from "lucide-react";
import Link from "next/link";
import { CruiseTabs } from "@/components/cruise/tabs";
import { ButtonLink } from "@/components/layout/button-link";
import { Reveal } from "@/components/motion/reveal";
import { type Alumnus, alumniByClass, alumniSection } from "@/lib/content";
import { FellowStory } from "./fellow-story";
import { SectionHeading } from "./section-heading";
import { TeamPhoto } from "./team-photo";

const CLOSING_MEETUP_POST = "/blog/transformation-programme-cohort-1-closing-meetup";

/**
 * 4 columns on desktop, 2 below. A flex row rather than a grid, so an
 * incomplete last row (e.g. 2 of 4) sits in the centre.
 */
function AlumniCards({ alumni }: { alumni: Alumnus[] }) {
  return (
    <Reveal as="ul" stagger className="flex flex-wrap justify-center gap-4 sm:gap-6">
      {alumni.map((person) => (
        <li
          key={person.name}
          className="brutal brutal-static flex w-[calc((100%-1rem)/2)] flex-col overflow-hidden bg-surface sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-4.5rem)/4)]"
        >
          <TeamPhoto
            src={person.image || undefined}
            name={person.name}
            alt={`${person.name}, JCTEF alumni`}
            sizes="(min-width: 1024px) 290px, 50vw"
          />
          <div className="flex flex-1 flex-col gap-4 border-t-2 border-ink p-4 md:p-5">
            <div className="grid min-w-0 gap-1">
              <h3 className="font-display text-[1.0625rem] leading-tight font-extrabold md:text-[1.1875rem]">{person.name}</h3>
              <p className="text-small font-bold text-success">{person.profession}</p>
              <p className="mt-1 flex items-center gap-1.5 text-small text-ink-muted">
                <MapPin aria-hidden="true" className="size-4 shrink-0" />
                {person.location}
              </p>
            </div>
            {person.testimonial && (
              <div className="mt-auto">
                <FellowStory name={person.name} testimonial={person.testimonial} />
              </div>
            )}
          </div>
        </li>
      ))}
    </Reveal>
  );
}

/**
 * "Meet our alumni" on /institute. With one class year it's a single list
 * under "Class of 2026"; once alumni from another year are added (`cohorts`
 * and `alumni` in content.ts), each year gets a tab, newest first.
 */
export function Alumni({ joinHref }: { joinHref: string }) {
  if (alumniByClass.length === 0) return null;
  const [only] = alumniByClass;
  const single = alumniByClass.length === 1;

  return (
    <section id="alumni" aria-labelledby="alumni-title" className="section bg-tint scroll-mt-20">
      <div className="site-container grid gap-10">
        <SectionHeading id="alumni-title" eyebrow={alumniSection.eyebrow} title={alumniSection.title}>
          <p>{alumniSection.summary}</p>
          {single && <p className="text-small font-bold text-ink-muted">{only.label}</p>}
        </SectionHeading>

        {single ? (
          <AlumniCards alumni={only.alumni} />
        ) : (
          <CruiseTabs
            label="Alumni by class"
            keepMounted
            items={alumniByClass.map((group) => ({
              value: group.label,
              label: group.label,
              content: (
                <div className="pt-6">
                  <AlumniCards alumni={group.alumni} />
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
