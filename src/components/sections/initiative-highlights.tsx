import type { InitiativeHighlight } from "@/lib/content";
import { PhotoGallery } from "./photo-gallery";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** "2026-04" -> "April 2026". */
function monthYear(date: string) {
  const [year, month] = date.split("-");
  const name = MONTHS[Number(month) - 1];
  return name ? `${name} ${year}` : year;
}

/**
 * Past moments of an initiative (e.g. Tech Paragon meetups), newest first:
 * title, "April 2026 · Lagos", description and photos in 4:3 tiles that open
 * in the lightbox. Add more in `highlights` in src/lib/content.ts.
 */
export function InitiativeHighlights({ id, highlights }: { id: string; highlights: InitiativeHighlight[] }) {
  const newestFirst = [...highlights].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <div className="grid gap-8">
      {newestFirst.map((highlight, i) => {
        const city = highlight.location.split(",")[0].trim();
        const when = monthYear(highlight.date);
        const titleId = `${id}-highlight-${i}`;
        return (
          <section
            key={`${highlight.date}-${highlight.title}`}
            aria-labelledby={titleId}
            className="grid gap-3 border-t-(length:--border-w) border-ink pt-5"
          >
            <h4 id={titleId} className="font-display text-[1.1875rem] font-extrabold">
              {highlight.title}
            </h4>
            <p className="text-label uppercase text-ink-muted">
              <time dateTime={highlight.date}>{when}</time> · {city}
            </p>
            <p className="text-ink-muted">{highlight.description}</p>
            <PhotoGallery
              photos={highlight.images.map((image) => ({
                ...image,
                caption: `${highlight.title}, ${city}, ${when}`,
              }))}
              tileCaptions={false}
              className="grid-cols-1 sm:grid-cols-2"
              sizes="(min-width: 768px) 270px, (min-width: 640px) 45vw, 100vw"
            />
          </section>
        );
      })}
    </div>
  );
}
