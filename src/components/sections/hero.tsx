import Image from "next/image";
import Link from "next/link";
import { CruiseButtonGroup, cruiseButtonClasses } from "@/components/cruise/button";
import { cx } from "@/lib/cruise-utils";
import { heroSlides, home } from "@/lib/content";
import { HeroSlideshow } from "./hero-slideshow";

/** Eyebrow, heading, text and buttons. Server-rendered in both layouts. */
function HeroText({ onPhoto }: { onPhoto: boolean }) {
  const { hero } = home;
  const [lead, last] = splitLastWord(hero.title);

  return (
    <div className="grid gap-6">
      <p className="eyebrow hero-in">{hero.eyebrow}</p>
      <h1 id="hero-title" className="hero-in text-hero text-balance" style={{ "--hero-step": 1 } as React.CSSProperties}>
        {lead}{" "}
        <span className="relative inline-block">
          <span className="relative z-10">{last}</span>
          {/* Marker stroke under the key word. */}
          <span aria-hidden="true" className="hero-marker absolute inset-x-0 bottom-[0.08em] h-[0.32em] -rotate-1 bg-primary" />
        </span>
      </h1>
      <p
        className="hero-in measure text-body text-ink-muted md:text-[1.1875rem]"
        style={{ "--hero-step": 2 } as React.CSSProperties}
      >
        {hero.text}
      </p>
      <div className="hero-in" style={{ "--hero-step": 3 } as React.CSSProperties}>
        <CruiseButtonGroup className="pt-2">
          <Link href={hero.primaryCta.href} className={cruiseButtonClasses()}>
            {hero.primaryCta.label}
          </Link>
          <a
            href={hero.secondaryCta.href}
            target="_blank"
            rel="noopener noreferrer"
            // On the photo, pin the secondary button to cream with navy text and
            // a cream outline so it stands out on the dark overlay.
            className={cruiseButtonClasses({
              variant: "secondary",
              className: cx(onPhoto && "border-[#fffaf0]! bg-[#fffaf0]! text-deep!"),
            })}
          >
            {hero.secondaryCta.label}
            <span className="visually-hidden"> (opens Flutterwave in a new tab)</span>
          </a>
        </CruiseButtonGroup>
      </div>
    </div>
  );
}

export function Hero() {
  // Photos need the Cloudinary cloud name; without it (or without photos),
  // fall back to the original split layout with the illustration.
  const slides = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ? heroSlides : [];
  if (slides.length === 0) {
    const { image } = home.hero;
    return (
      <section aria-labelledby="hero-title" className="overflow-hidden border-b-(length:--border-w) border-ink">
        <div className="site-container grid items-center gap-10 py-10 md:py-16 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:py-24">
          <HeroText onPhoto={false} />
          <div className="brutal brutal-static overflow-hidden">
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              sizes="(min-width: 1024px) 560px, 100vw"
              preload
              className="aspect-6/5 h-auto w-full object-cover"
            />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[75svh] items-center overflow-hidden border-b-(length:--border-w) border-ink bg-deep lg:min-h-[85vh]"
    >
      <HeroSlideshow slides={slides} />
      <div className="on-photo site-container relative z-10 pt-12 pb-24 md:pt-16 lg:pb-28">
        <div className="max-w-3xl">
          <HeroText onPhoto />
        </div>
      </div>
    </section>
  );
}

function splitLastWord(text: string): [string, string] {
  const i = text.lastIndexOf(" ");
  return i === -1 ? ["", text] : [text.slice(0, i), text.slice(i + 1)];
}
