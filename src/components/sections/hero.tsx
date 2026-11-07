import Image from "next/image";
import Link from "next/link";
import { CruiseBadge } from "@/components/cruise/badge";
import { CruiseButtonGroup, cruiseButtonClasses } from "@/components/cruise/button";
import { home } from "@/lib/content";

export function Hero() {
  const { hero } = home;
  const [lead, last] = splitLastWord(hero.title);

  return (
    <section aria-labelledby="hero-title" className="overflow-hidden border-b-(length:--border-w) border-ink">
      <div className="site-container grid items-center gap-10 py-10 md:py-16 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:py-24">
        <div className="grid gap-6">
          <p className="eyebrow">{hero.eyebrow}</p>
          <h1 id="hero-title" className="text-hero text-balance">
            {lead}{" "}
            <span className="relative inline-block">
              <span className="relative z-10">{last}</span>
              {/* Marker stroke under the key word. */}
              <span aria-hidden="true" className="absolute inset-x-0 bottom-[0.08em] h-[0.32em] -rotate-1 bg-primary" />
            </span>
          </h1>
          <p className="measure text-body text-ink-muted md:text-[1.1875rem]">{hero.text}</p>
          <CruiseButtonGroup className="pt-2">
            <Link href={hero.primaryCta.href} className={cruiseButtonClasses()}>
              {hero.primaryCta.label}
            </Link>
            <a
              href={hero.secondaryCta.href}
              target="_blank"
              rel="noopener noreferrer"
              className={cruiseButtonClasses({ variant: "secondary" })}
            >
              {hero.secondaryCta.label}
              <span className="visually-hidden"> (opens Flutterwave in a new tab)</span>
            </a>
          </CruiseButtonGroup>
        </div>

        <div className="relative">
          <div className="brutal brutal-static overflow-hidden">
            <Image
              src={hero.image.src}
              alt={hero.image.alt}
              width={hero.image.width}
              height={hero.image.height}
              sizes="(min-width: 1024px) 560px, 100vw"
              preload
              className="aspect-6/5 h-auto w-full object-cover"
            />
          </div>
          <CruiseBadge tone="surface" sticker className="absolute -top-3 left-4 bg-sun! md:left-6">
            Lekki, Lagos
          </CruiseBadge>
        </div>
      </div>
    </section>
  );
}

function splitLastWord(text: string): [string, string] {
  const i = text.lastIndexOf(" ");
  return i === -1 ? ["", text] : [text.slice(0, i), text.slice(i + 1)];
}
