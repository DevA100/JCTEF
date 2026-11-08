"use client";

import { Pause, Play } from "lucide-react";
import { CldImage, getCldImageUrl } from "next-cloudinary";
import { type ComponentProps, useCallback, useEffect, useState, useSyncExternalStore } from "react";
import type { HeroSlide } from "@/lib/content";
import { cx } from "@/lib/cruise-utils";

const INTERVAL_MS = 6000;

/** Same conversion for every size: the best format and quality each browser
 * supports (AVIF/WebP/JPEG, so HEIC originals never reach the page), cropped
 * around faces. */
const CLD = { crop: "fill", gravity: "faces", format: "auto", quality: "auto" } as const;
const DESKTOP_WIDTHS = [828, 1080, 1200, 1440, 1680, 1920, 2048];

/**
 * One hero photo, art-directed: CldImage renders a portrait (3:5) face crop
 * for phones, and a <source> swaps in a 16:9 face crop from 768px up. The
 * browser downloads only the one it needs.
 */
function HeroPhoto({
  slide,
  className,
  ...imgProps
}: { slide: HeroSlide } & Pick<ComponentProps<"img">, "className" | "fetchPriority" | "loading" | "onLoad">) {
  const desktopSrcSet = DESKTOP_WIDTHS.map(
    (width) => `${getCldImageUrl({ src: slide.publicId, width, aspectRatio: "16:9", ...CLD })} ${width}w`,
  ).join(", ");

  return (
    <picture>
      <source media="(min-width: 768px)" srcSet={desktopSrcSet} sizes="100vw" />
      <CldImage
        src={slide.publicId}
        alt={slide.alt}
        fill
        sizes="100vw"
        aspectRatio="3:5"
        {...CLD}
        {...imgProps}
        style={{ objectPosition: slide.focus }}
        className={cx("object-cover", className)}
      />
    </picture>
  );
}

function subscribeMedia(callback: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}
function subscribeVisibility(callback: () => void) {
  document.addEventListener("visibilitychange", callback);
  return () => document.removeEventListener("visibilitychange", callback);
}

/**
 * Background photos for the homepage hero: a crossfading slideshow with a
 * slow zoom, indicators and a pause button. Text stays in the server-rendered
 * Hero; this component only draws the photos, the overlay and the controls.
 *
 * - Photos come from Cloudinary (see HeroPhoto). Only the first loads on
 *   first paint (high priority); the others are mounted after it has loaded.
 * - Pauses while the tab is hidden. With reduced motion, it doesn't
 *   auto-advance or zoom unless the visitor presses Play.
 */
export function HeroSlideshow({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [firstLoaded, setFirstLoaded] = useState(false);
  /** null = no choice yet: play unless the visitor prefers reduced motion. */
  const [userPlaying, setUserPlaying] = useState<boolean | null>(null);

  const reducedMotion = useSyncExternalStore(
    subscribeMedia,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
  const hidden = useSyncExternalStore(
    subscribeVisibility,
    () => document.visibilityState === "hidden",
    () => false,
  );

  const playing = userPlaying ?? !reducedMotion;
  const count = slides.length;

  const show = useCallback(
    (next: number) => {
      if (next === index) return;
      setPrev(index);
      setIndex(next);
    },
    [index],
  );

  // Advance every 6 s. Restarts whenever the slide changes, so a click on an
  // indicator gets a full 6 s too.
  useEffect(() => {
    if (!playing || hidden || count < 2 || !firstLoaded) return;
    const timer = window.setTimeout(() => show((index + 1) % count), INTERVAL_MS);
    return () => window.clearTimeout(timer);
  }, [playing, hidden, count, firstLoaded, index, show]);

  return (
    <>
      <div className="absolute inset-0 overflow-hidden">
        {slides.map((slide, i) => {
          // Slides after the first wait until the first photo is on screen.
          if (i > 0 && !firstLoaded) return null;
          const active = i === index;
          // Keep zooming on the outgoing slide while it fades, so it doesn't snap back.
          const zooming = active || i === prev;
          return (
            <div
              key={slide.publicId}
              aria-hidden={!active}
              className={cx(
                "absolute inset-0 transition-opacity duration-1000 ease-in-out motion-reduce:duration-0",
                active ? "opacity-100" : "opacity-0",
              )}
            >
              <HeroPhoto
                slide={slide}
                {...(i === 0 ? { fetchPriority: "high" as const, loading: "eager" as const } : { loading: "lazy" as const })}
                onLoad={i === 0 ? () => setFirstLoaded(true) : undefined}
                className={cx(
                  zooming && "motion-safe:animate-[hero-zoom_7s_linear_forwards]",
                  // Pausing freezes the zoom where it is instead of snapping back.
                  !playing && "[animation-play-state:paused]",
                )}
              />
            </div>
          );
        })}
      </div>

      {/* Navy overlay so light text passes WCAG AA on any photo: solid enough
          behind the text column, lighter towards the right on wide screens. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--deep)_72%,transparent),color-mix(in_srgb,var(--deep)_80%,transparent))] lg:bg-[linear-gradient(90deg,color-mix(in_srgb,var(--deep)_75%,transparent)_0%,color-mix(in_srgb,var(--deep)_75%,transparent)_65%,color-mix(in_srgb,var(--deep)_30%,transparent)_100%)]"
      />

      {count > 1 && (
        <div className="absolute inset-x-0 bottom-0 z-20">
          <div className="site-container flex items-center gap-3 pb-5">
            <button
              type="button"
              onClick={() => setUserPlaying(!playing)}
              aria-label={playing ? "Pause slideshow" : "Play slideshow"}
              className="grid size-11 place-items-center rounded-full border-2 border-[#fffaf0]/80 bg-deep/60 text-[#fffaf0] hover:bg-deep"
            >
              {playing ? <Pause aria-hidden="true" className="size-4" /> : <Play aria-hidden="true" className="size-4" />}
            </button>
            <ul className="flex items-center" aria-label="Hero photos">
              {slides.map((slide, i) => (
                <li key={slide.publicId}>
                  <button
                    type="button"
                    onClick={() => show(i)}
                    aria-label={`Show photo ${i + 1} of ${count}`}
                    aria-current={i === index ? "true" : undefined}
                    className="group grid h-11 w-9 place-items-center"
                  >
                    <span
                      aria-hidden="true"
                      className={cx(
                        "block h-1.5 rounded-full transition-all duration-300 motion-reduce:transition-none",
                        i === index ? "w-7 bg-primary" : "w-3 bg-[#fffaf0]/70 group-hover:bg-[#fffaf0]",
                      )}
                    />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
