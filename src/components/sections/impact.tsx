import { CruiseBadge } from "@/components/cruise/badge";
import { home } from "@/lib/content";
import { SectionHeading } from "./section-heading";

/** Small, honest numbers: framed as the first cohort, not as big counters. */
export function Impact() {
  const { impact } = home;
  return (
    <section aria-labelledby="impact-title" className="section bg-tint">
      <div className="site-container grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:items-center lg:gap-16">
        <div className="grid gap-5">
          <SectionHeading id="impact-title" eyebrow={impact.eyebrow} title={impact.title}>
            <p>{impact.text}</p>
          </SectionHeading>
          <CruiseBadge tone="surface" className="w-fit">
            Year one
          </CruiseBadge>
        </div>

        <div className="grid gap-4">
          <dl className="grid grid-cols-2 gap-4">
            {impact.stats.map((stat) => (
              <div key={stat.label} className="brutal brutal-static grid gap-1 p-5 md:p-6">
                <dt className="order-2 text-small font-bold text-ink-muted">{stat.label}</dt>
                <dd className="order-1 font-display text-[2.75rem] leading-none font-extrabold md:text-[3.5rem]">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
          <p className="text-small text-ink-muted">{impact.footnote}</p>
        </div>
      </div>
    </section>
  );
}
