import { cx } from "@/lib/cruise-utils";
import type { TitledText } from "@/lib/content";

/** A grid of title + text cards, optionally numbered. Uses <h3> titles. */
export function FeatureGrid({
  items,
  columns = 3,
  numbered = false,
  className,
}: {
  items: TitledText[];
  columns?: 2 | 3 | 4;
  numbered?: boolean;
  className?: string;
}) {
  return (
    <ul
      className={cx(
        "grid gap-5 sm:grid-cols-2",
        columns === 3 && "lg:grid-cols-3",
        columns === 4 && "lg:grid-cols-4",
        className,
      )}
    >
      {items.map((item, i) => (
        <li key={item.title} className="brutal brutal-static grid content-start gap-2 p-5 md:p-6">
          {numbered && (
            <span aria-hidden="true" className="font-display text-h3 font-extrabold text-success">
              {String(i + 1).padStart(2, "0")}
            </span>
          )}
          <h3 className="font-display text-[1.25rem] leading-tight font-extrabold">{item.title}</h3>
          <p className="text-ink-muted">{item.text}</p>
        </li>
      ))}
    </ul>
  );
}
