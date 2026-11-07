import { Building2, Church, Globe, Landmark } from "lucide-react";
import Link from "next/link";
import { cruiseButtonClasses } from "@/components/cruise/button";
import { home, partnerTypes } from "@/lib/content";
import { SectionHeading } from "./section-heading";

const ICONS = [Landmark, Building2, Church, Globe];

export function Partners() {
  const { partners } = home;
  return (
    <section aria-labelledby="partners-title" className="section">
      <div className="site-container grid gap-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading id="partners-title" eyebrow={partners.eyebrow} title={partners.title}>
            <p>{partners.text}</p>
          </SectionHeading>
          <Link href={partners.cta.href} className={cruiseButtonClasses({ className: "shrink-0" })}>
            {partners.cta.label}
          </Link>
        </div>
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {partnerTypes.map((type, i) => {
            const Icon = ICONS[i];
            return (
              <li key={type.title} className="brutal brutal-static grid content-start gap-3 p-5">
                <span className="grid size-11 place-items-center rounded-brutal border-2 border-ink bg-tint">
                  <Icon aria-hidden="true" className="size-6" />
                </span>
                <h3 className="font-display text-[1.25rem] font-extrabold">{type.title}</h3>
                <p className="text-small text-ink-muted">{type.text}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
