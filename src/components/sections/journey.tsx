import { Bus, Flag } from "lucide-react";
import Link from "next/link";
import { cruiseButtonClasses } from "@/components/cruise/button";
import { home, programmeStages } from "@/lib/content";
import { SectionHeading } from "./section-heading";

/**
 * The centrepiece: the six programme stages as a danfo bus route.
 * A green-and-ink danfo stripe is the road; each stage is a numbered stop.
 * Vertical on phones, a 3 × 2 route from 1024px. No client JS.
 */
export function Journey({ showCta = true }: { showCta?: boolean }) {
  const { journey } = home;
  return (
    <section aria-labelledby="journey-title" className="on-deep section relative overflow-hidden">
      <div className="site-container grid gap-10">
        <SectionHeading id="journey-title" eyebrow={journey.eyebrow} title={journey.title}>
          <p>{journey.text}</p>
        </SectionHeading>

        {/* Start of the route */}
        <p className="inline-flex w-fit items-center gap-3 rounded-brutal border-2 border-ink px-4 py-2 font-display text-body font-extrabold uppercase tracking-wide">
          <Bus aria-hidden="true" className="size-6 text-primary" />
          <span>
            <span className="text-ink-muted">Boarding at: </span>
            {journey.start}
          </span>
        </p>

        <ol className="grid gap-0 lg:grid-cols-3 lg:gap-x-6 lg:gap-y-12">
          {programmeStages.map((stage, i) => (
            <li
              key={stage.short}
              className={[
                "relative grid grid-cols-[56px_1fr] gap-x-5 pb-10 last:pb-0 lg:grid-cols-1 lg:gap-y-5 lg:pb-0",
                // The road: a vertical danfo stripe on phones, horizontal on desktop.
                "before:absolute before:top-0 before:bottom-0 before:left-5.5 before:w-3 before:border-x-2 before:border-ink before:bg-primary",
                "last:before:bottom-auto last:before:h-7",
                "lg:before:top-5.5 lg:before:-right-6 lg:before:bottom-auto lg:before:left-0 lg:before:h-3 lg:before:w-auto lg:before:border-x-0 lg:before:border-y-2",
                "lg:nth-[3n]:before:right-0 lg:last:before:h-3",
              ].join(" ")}
            >
              {/* The stop marker */}
              <span
                aria-hidden="true"
                className="on-primary relative z-10 grid size-14 place-items-center rounded-brutal border-(length:--border-w) font-display text-h3 font-extrabold shadow-brutal"
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              <div className="brutal brutal-static grid content-start gap-2 p-5 lg:min-h-full">
                <p className="text-label uppercase text-primary">
                  Stop {i + 1}
                  <span className="visually-hidden"> of {programmeStages.length}</span>
                </p>
                <h3 className="font-display text-[1.75rem] leading-none font-extrabold uppercase md:text-[2rem]">
                  {stage.short}
                </h3>
                <p className="font-bold">{stage.title}</p>
                <p className="text-small text-ink-muted">{stage.text}</p>
              </div>
            </li>
          ))}
        </ol>

        {/* Destination */}
        <div className="on-primary brutal brutal-static flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between md:p-8">
          <p className="flex items-center gap-4">
            <Flag aria-hidden="true" className="size-10 shrink-0" />
            <span className="grid">
              <span className="text-label uppercase">Final stop</span>
              <span className="font-display text-h2 font-extrabold uppercase">{journey.end}</span>
            </span>
          </p>
          {showCta && (
            <Link href={journey.cta.href} className={cruiseButtonClasses({ variant: "secondary" })}>
              {journey.cta.label}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
