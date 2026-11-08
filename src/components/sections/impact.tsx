import { CountUp } from "@/components/motion/count-up";
import { home } from "@/lib/content";
import { Reveal } from "@/components/motion/reveal";

/** Impact figures only; the heading is visually hidden but kept for screen readers. */
export function Impact() {
  const { impact } = home;
  return (
    <section aria-labelledby="impact-title" className="section bg-tint">
      <div className="site-container">
        <h2 id="impact-title" className="visually-hidden">
          {impact.title}
        </h2>
        <Reveal as="dl" stagger className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {impact.stats.map((stat) => (
            <div key={stat.label} className="brutal brutal-static grid gap-1 p-5 md:p-6">
              <dt className="order-2 text-small font-bold text-ink-muted">{stat.label}</dt>
              <dd className="order-1 font-display text-[2.75rem] leading-none font-extrabold md:text-[3.5rem]">
                <CountUp value={stat.value} />
              </dd>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
