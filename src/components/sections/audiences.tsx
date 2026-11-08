import { GraduationCap, HandHeart, RefreshCw, Users } from "lucide-react";
import { audiences, home } from "@/lib/content";
import { SectionHeading } from "./section-heading";
import { Reveal } from "@/components/motion/reveal";

const ICONS = [Users, HandHeart, RefreshCw, GraduationCap];

export function Audiences() {
  return (
    <section aria-labelledby="audiences-title" className="section">
      <div className="site-container grid gap-10">
        <SectionHeading id="audiences-title" eyebrow={home.audiences.eyebrow} title={home.audiences.title} />
        <Reveal as="ul" stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {audiences.map((group, i) => {
            const Icon = ICONS[i];
            return (
              <li key={group.title} className="grid content-start gap-3 border-t-4 border-primary pt-5">
                <Icon aria-hidden="true" className="size-8" />
                <h3 className="font-display text-h3 font-extrabold">{group.title}</h3>
                <p className="text-ink-muted">{group.text}</p>
              </li>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
