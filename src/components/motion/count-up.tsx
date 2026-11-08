"use client";

import { useEffect, useRef, useState } from "react";

const DURATION_MS = 900;

/**
 * Counts a figure like "300+" up from 0 when it scrolls into view, keeping any
 * prefix or suffix. The server HTML shows the final value, screen readers
 * only ever hear the final value, and reduced motion skips the count.
 */
export function CountUp({ value }: { value: string }) {
  const match = value.match(/^(\D*)(\d+)(\D*)$/);
  const target = match ? Number(match[2]) : null;
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || target === null || target === 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Only count figures that start off screen; visible ones stay put.
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    let frame = 0;
    // Off screen, so resetting to 0 is invisible.
    setShown(0);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / DURATION_MS);
          const eased = 1 - (1 - t) ** 3; // ease-out
          setShown(Math.round(eased * target));
          if (t < 1) frame = requestAnimationFrame(tick);
          else setShown(null);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [target]);

  if (!match) return <>{value}</>;
  return (
    <span ref={ref}>
      <span aria-hidden="true" className="tabular-nums">
        {shown === null ? value : `${match[1]}${shown}${match[3]}`}
      </span>
      <span className="visually-hidden">{value}</span>
    </span>
  );
}
