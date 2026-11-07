"use client";

import { useEffect, useRef, useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";

export type CruiseToastPosition = "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right";

const noopSubscribe = () => () => {};

// Each stack's height, published as --cruise-toasts-<position> on <html> so
// fixed things in the same corner (CruiseScrollTop) can sit above it.
const stacks = new Map<HTMLElement, CruiseToastPosition>();
function publishHeights() {
  const tallest = new Map<CruiseToastPosition, number>();
  for (const [el, position] of stacks) tallest.set(position, Math.max(tallest.get(position) ?? 0, el.offsetHeight));
  for (const position of ["bottom-left", "bottom-center", "bottom-right", "top-left", "top-center", "top-right"] as const) {
    const height = tallest.get(position) ?? 0;
    document.documentElement.style.setProperty(`--cruise-toasts-${position}`, height ? `${height + 12}px` : "0px");
  }
}

/**
 * Fixed stack that toasts enter into (any toast, including the achievement
 * toast). `position` picks the corner or edge: 16px in (plus the phone's
 * safe area), full width with 16px gutters below 640px. Top stacks grow
 * down with the newest on top; bottom stacks grow up with the newest at the
 * bottom. Portalled to <body> so a transformed ancestor (e.g. a hovered
 * .brutal) can't break `position: fixed`.
 */
export function CruiseToastViewport({
  position = "bottom-right",
  children,
}: {
  /** Where the stack sits. */
  position?: CruiseToastPosition;
  children: ReactNode;
}) {
  // false during SSR and hydration, true once mounted in the browser
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    stacks.set(el, position);
    const observer = new ResizeObserver(publishHeights);
    observer.observe(el);
    return () => {
      observer.disconnect();
      stacks.delete(el);
      publishHeights();
    };
  }, [mounted, position]);

  if (!mounted) return null;

  return createPortal(
    <div ref={ref} className="toast-viewport" data-position={position}>
      {children}
    </div>,
    document.body,
  );
}
