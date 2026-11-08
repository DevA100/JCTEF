import { CalendarDays, Clock, MapPin } from "lucide-react";
import Image from "next/image";
import { CruiseBadge } from "@/components/cruise/badge";
import { CruiseCountdown } from "@/components/cruise/countdown";
import { ButtonLink } from "@/components/layout/button-link";
import { home, type JctefEvent } from "@/lib/content";
import { getUpcomingEvents } from "@/lib/events";
import { SectionHeading } from "./section-heading";

/** Google Maps directions, built from the venue text so it updates with it. */
function directionsUrl(venue: string) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(venue)}`;
}

function EventMeta({ event }: { event: JctefEvent }) {
  return (
    <ul className="grid gap-2 text-small">
      <li className="flex items-start gap-2">
        <CalendarDays aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
        {event.startsAt ? <time dateTime={event.startsAt}>{event.dateLabel}</time> : event.dateLabel}
      </li>
      {event.timeLabel && (
        <li className="flex items-start gap-2">
          <Clock aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
          {event.timeLabel}
        </li>
      )}
      <li className="flex items-start gap-2">
        <MapPin aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
        {event.venue ? (
          <span className="grid gap-1">
            <span>{event.venue}</span>
            {!event.venueConfirmed && <span className="text-ink-muted">{home.events.venueNote}</span>}
            <a
              href={directionsUrl(event.venue)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-link inline-flex min-h-11 w-fit items-center"
            >
              {home.events.directionsLabel}
              <span className="visually-hidden"> to {event.venue} on Google Maps (opens in a new tab)</span>
            </a>
          </span>
        ) : (
          event.location
        )}
      </li>
    </ul>
  );
}

/**
 * Upcoming events. The first dated event in content.ts is featured with a
 * live countdown (the only client JS in this section). Finished events are
 * dropped automatically (see getUpcomingEvents).
 */
export async function Events() {
  const events = await getUpcomingEvents();
  if (events.length === 0) return null;
  const featured = events.find((e) => e.startsAt !== null);
  const others = events.filter((e) => e !== featured);

  return (
    <section id="events" aria-labelledby="events-title" className="section scroll-mt-20 bg-tint">
      <div className="site-container grid gap-10">
        <SectionHeading id="events-title" eyebrow={home.events.eyebrow} title={home.events.title} />

        {featured && (
          <article
            aria-labelledby={`event-${featured.slug}`}
            className="brutal brutal-static grid overflow-hidden md:grid-cols-[minmax(0,2fr)_3fr]"
          >
            {featured.image && (
              <div className="border-b-(length:--border-w) border-ink bg-surface md:border-r-(length:--border-w) md:border-b-0">
                <Image
                  src={featured.image.src}
                  alt={featured.image.alt}
                  width={featured.image.width}
                  height={featured.image.height}
                  sizes="(min-width: 768px) 440px, 100vw"
                  className="h-auto w-full"
                />
              </div>
            )}
            <div className="grid content-start gap-5 p-6 md:p-8">
              <CruiseBadge tone="primary" className="w-fit">
                Next event
              </CruiseBadge>
              <div className="grid gap-1">
                <h3 id={`event-${featured.slug}`} className="text-h3 md:text-h2">
                  {featured.title}
                </h3>
                {featured.subtitle && <p className="font-display text-body font-bold">{featured.subtitle}</p>}
              </div>
              <EventMeta event={featured} />
              <p className="text-ink-muted">{featured.summary}</p>
              {featured.startsAt && (
                <CruiseCountdown target={featured.startsAt} label={home.events.countdownLabel} urgent={false} showDays />
              )}
              {featured.cta && (
                <div>
                  <ButtonLink href={featured.cta.href}>{featured.cta.label}</ButtonLink>
                </div>
              )}
            </div>
          </article>
        )}

        {others.length > 0 && (
          <ul className="grid gap-6 md:grid-cols-2">
            {others.map((event) => (
              <li key={event.slug} className="brutal brutal-static grid content-start gap-4 p-6">
                <CruiseBadge tone="muted" className="w-fit">
                  {event.startsAt ? "Coming up" : "Date to be announced"}
                </CruiseBadge>
                <h3 className="text-h3">{event.title}</h3>
                <EventMeta event={event} />
                <p className="text-ink-muted">{event.summary}</p>
                {event.cta && (
                  <div>
                    <ButtonLink href={event.cta.href} variant="secondary">
                      {event.cta.label}
                    </ButtonLink>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
