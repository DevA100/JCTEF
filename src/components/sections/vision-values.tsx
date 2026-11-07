import { Eye, Target } from "lucide-react";
import { coreValues, home, mission, vision } from "@/lib/content";
import { SectionHeading } from "./section-heading";

export function VisionValues() {
  return (
    <section aria-labelledby="values-title" className="section">
      <div className="site-container grid gap-12">
        <SectionHeading id="values-title" eyebrow={home.values.eyebrow} title={home.values.title} />

        <div className="grid gap-6 md:grid-cols-2">
          <article className="on-primary brutal brutal-static grid content-start gap-4 p-6 md:p-8">
            <Eye aria-hidden="true" className="size-8" />
            <h3 className="text-h3">Our vision</h3>
            <p>{vision}</p>
          </article>
          <article className="brutal brutal-static grid content-start gap-4 p-6 md:p-8">
            <Target aria-hidden="true" className="size-8" />
            <h3 className="text-h3">Our mission</h3>
            <p>{mission}</p>
          </article>
        </div>

        <div>
          <h3 className="mb-6 text-h3">Our core values</h3>
          <ul className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            {coreValues.map((value, i) => (
              <li key={value.title} className="flex gap-4">
                <span
                  aria-hidden="true"
                  className="grid size-11 shrink-0 place-items-center rounded-brutal border-2 border-ink bg-surface font-display font-extrabold"
                >
                  {i + 1}
                </span>
                <div>
                  <h4 className="font-display text-[1.25rem] font-extrabold">{value.title}</h4>
                  <p className="text-ink-muted">{value.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
