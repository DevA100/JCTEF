import { cacheLife } from "next/cache";
import { events, type JctefEvent } from "./content";

/** End of the event, or the end of its start day (Lagos time) if no end is set. */
function endsAt(event: JctefEvent): number | null {
  if (event.endsAt) return Date.parse(event.endsAt);
  if (!event.startsAt) return null;
  const day = event.startsAt.slice(0, 10);
  return Date.parse(`${day}T23:59:59+01:00`);
}

/**
 * Events that have not finished yet. Undated ("to be announced") events
 * always show. Cached for an hour, so a finished event drops off the site
 * within the hour without anyone editing content.ts.
 */
export async function getUpcomingEvents(): Promise<JctefEvent[]> {
  "use cache";
  cacheLife("hours");
  const now = Date.now();
  return events.filter((event) => {
    const end = endsAt(event);
    return end === null || end > now;
  });
}
