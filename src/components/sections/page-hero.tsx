import type { ReactNode } from "react";
import { SectionHeading } from "./section-heading";

/** The header band at the top of every inner page (holds the page's h1). */
export function PageHero({
  eyebrow,
  title,
  text,
  children,
}: {
  eyebrow: string;
  title: string;
  text?: string;
  /** Extra content under the intro (tags, buttons). */
  children?: ReactNode;
}) {
  return (
    <section className="border-b-(length:--border-w) border-ink bg-tint">
      <div className="site-container grid gap-6 py-12 md:py-20">
        <SectionHeading as="h1" eyebrow={eyebrow} title={title}>
          {text && <p className="text-ink md:text-[1.1875rem]">{text}</p>}
        </SectionHeading>
        {children}
      </div>
    </section>
  );
}
