"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { cruiseButtonClasses } from "@/components/cruise/button";
import { cx } from "@/lib/cruise-utils";

const SHOW_AFTER_PX = 600;

/**
 * Floating "Back to top" button, bottom-right. Appears after ~600px of
 * scrolling, smooth-scrolls to the top (instant with reduced motion), then
 * moves keyboard focus to the top of the page.
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setVisible(window.scrollY > SHOW_AFTER_PX);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  function backToTop() {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const focusTop = () => document.getElementById("top")?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
    const supportsScrollEnd = "onscrollend" in window;
    if (reduced || window.scrollY === 0) {
      focusTop();
    } else if (supportsScrollEnd) {
      window.addEventListener("scrollend", focusTop, { once: true });
    } else {
      window.setTimeout(focusTop, 600);
    }
  }

  return (
    <button
      type="button"
      onClick={backToTop}
      aria-label="Back to top"
      // Hidden from keyboard and screen readers until it appears.
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      className={cruiseButtonClasses({
        className: cx(
          "back-to-top fixed z-30 size-11 min-h-11 p-0!",
          "right-[max(1rem,env(safe-area-inset-right))] bottom-[max(1rem,env(safe-area-inset-bottom))]",
          !visible && "pointer-events-none",
        ),
      })}
      data-visible={visible}
    >
      <ArrowUp aria-hidden="true" strokeWidth={3} className="size-5" />
    </button>
  );
}
