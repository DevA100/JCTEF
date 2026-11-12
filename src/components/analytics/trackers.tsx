"use client";

import { type ReactNode, useEffect, useRef } from "react";
import { track } from "@/lib/analytics";

/** newsletter_confirmed, once, when the confirmation page is shown. */
export function TrackNewsletterConfirmed() {
  const sent = useRef(false);
  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    track("newsletter_confirmed");
  }, []);
  return null;
}

/**
 * programme_viewed: /programmes has no tabs, so a programme counts as viewed
 * when its section reaches the middle of the screen. Once per programme per
 * visit to the page.
 */
export function TrackProgrammeViews({ programmes }: { programmes: { id: string; title: string }[] }) {
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const seen = new Set<string>();
    const titles = new Map(programmes.map((p) => [p.id, p.title]));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id;
          if (!entry.isIntersecting || seen.has(id)) continue;
          seen.add(id);
          observer.unobserve(entry.target);
          track("programme_viewed", { programme: titles.get(id) ?? id });
        }
      },
      // A band across the middle of the screen.
      { rootMargin: "-45% 0px -45% 0px" },
    );
    for (const { id } of programmes) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [programmes]);
  return null;
}

/**
 * blog_post_read: once the reader has scrolled past about 75% of the post's
 * text. Wraps the post body.
 */
export function TrackPostRead({ slug, className, children }: { slug: string; className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let done = false;
    let frame = 0;
    const check = () => {
      frame = 0;
      const box = el.getBoundingClientRect();
      // How far down the text the bottom of the screen has reached.
      if (box.height > 0 && (window.innerHeight - box.top) / box.height >= 0.75) {
        done = true;
        track("blog_post_read", { slug });
        stop();
      }
    };
    const onScroll = () => {
      if (!done && !frame) frame = requestAnimationFrame(check);
    };
    const stop = () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return stop;
  }, [slug]);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
