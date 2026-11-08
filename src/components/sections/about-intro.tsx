import { BookOpen, Briefcase, Sprout, Wrench } from "lucide-react";
import Link from "next/link";
import { home, pillars } from "@/lib/content";
import { SectionHeading } from "./section-heading";
import { Reveal } from "@/components/motion/reveal";

const ICONS = [Sprout, Wrench, BookOpen, Briefcase];

export function AboutIntro() {
  const { about } = home;
  return (
    <section aria-labelledby="about-title" className="section">
      <div className="site-container grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
        <div className="grid content-start gap-6">
          <SectionHeading id="about-title" eyebrow={about.eyebrow} title={about.title}>
            {about.text.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </SectionHeading>
          <Link href={about.cta.href} className="text-link inline-flex min-h-11 items-center">
            {about.cta.label}
          </Link>
        </div>

        <div>
          <h3 className="mb-5 text-label uppercase text-ink-muted">Our four pillars</h3>
          <Reveal as="ul" stagger className="grid gap-4 sm:grid-cols-2">
            {pillars.map((pillar, i) => {
              const Icon = ICONS[i];
              return (
                <li key={pillar.short} className="brutal brutal-static grid content-start gap-3 p-5">
                  <span className="grid size-11 place-items-center rounded-brutal border-2 border-ink bg-tint">
                    <Icon aria-hidden="true" className="size-6" />
                  </span>
                  <h4 className="font-display text-h3 font-extrabold">{pillar.title}</h4>
                  <p className="text-small text-ink-muted">{pillar.text}</p>
                </li>
              );
            })}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
