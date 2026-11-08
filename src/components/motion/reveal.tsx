"use client";

import { type ComponentPropsWithoutRef, type ElementType, type ReactNode, useEffect, useRef, useState } from "react";
import { cx } from "@/lib/cruise-utils";

type Variant = "up" | "fade" | "scale";
type State = "idle" | "hidden" | "shown";

/** One shared observer for every <Reveal> on the page. */
const callbacks = new WeakMap<Element, () => void>();
let observer: IntersectionObserver | null = null;
function observe(el: Element, onShow: () => void) {
  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        callbacks.get(entry.target)?.();
        observer?.unobserve(entry.target);
        callbacks.delete(entry.target);
      }
    },
    { threshold: 0.15 },
  );
  callbacks.set(el, onShow);
  observer.observe(el);
  return () => {
    observer?.unobserve(el);
    callbacks.delete(el);
  };
}

/**
 * Scroll reveal: animates once when about 15% of the element is in view.
 *
 * Safe by default: the server HTML is fully visible. Only after hydration,
 * and only for elements that start below the fold, is the "before" state
 * applied, so nothing stays hidden if JavaScript fails and nothing on screen
 * blinks. With reduced motion it does nothing at all.
 *
 * `stagger` animates the direct children one after another (70 ms apart,
 * capped at 6), for card grids. Animations use transform and opacity only.
 */
export function Reveal<T extends ElementType = "div">({
  as,
  variant = "up",
  stagger = false,
  className,
  children,
  ...props
}: {
  as?: T;
  variant?: Variant;
  stagger?: boolean;
  className?: string;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className" | "children">) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement>(null);
  const [state, setState] = useState<State>("idle");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Already on screen (or above it): leave it alone.
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return;
    // Off screen, so hiding it now is invisible to the reader.
    setState("hidden");
    return observe(el, () => setState("shown"));
  }, []);

  return (
    <Tag
      ref={ref}
      data-reveal={state === "idle" ? undefined : state}
      data-variant={variant}
      className={cx(stagger ? "reveal-stagger" : "reveal", className)}
      {...props}
    >
      {children}
    </Tag>
  );
}
