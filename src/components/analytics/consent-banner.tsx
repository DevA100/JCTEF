"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { CruiseButton } from "@/components/cruise/button";
import {
  analyticsEnabled,
  browserSaysNoTracking,
  type ConsentChoice,
  OPEN_COOKIE_SETTINGS,
  readConsent,
  saveConsent,
  subscribeConsent,
} from "@/lib/analytics";

/** "server" while rendering on the server and hydrating (no localStorage there). */
const useStoredChoice = () =>
  useSyncExternalStore(
    subscribeConsent,
    () => readConsent() ?? "none",
    () => "server",
  );

/**
 * The analytics cookie banner, pinned to the bottom of the screen. Not a
 * modal: the page stays usable, and until someone answers, analytics run
 * cookieless (src/instrumentation-client.ts).
 *
 * Shown once, until a choice is made; never shown to browsers sending Do Not
 * Track or Global Privacy Control (treated as "Decline"). The footer's
 * "Cookie settings" opens it again. Renders nothing when analytics aren't set up.
 */
export function ConsentBanner() {
  const stored = useStoredChoice();
  /** Opened from "Cookie settings": focus moves in, and back out afterwards. */
  const [reopened, setReopened] = useState<{ returnTo: HTMLElement | null } | null>(null);
  const ref = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const open = analyticsEnabled && (reopened !== null || (stored === "none" && !browserSaysNoTracking()));

  useEffect(() => {
    if (!analyticsEnabled) return;
    const onOpen = () =>
      setReopened({ returnTo: document.activeElement instanceof HTMLElement ? document.activeElement : null });
    window.addEventListener(OPEN_COOKIE_SETTINGS, onOpen);
    return () => window.removeEventListener(OPEN_COOKIE_SETTINGS, onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    if (reopened) headingRef.current?.focus();
    // Keep focused elements from scrolling under the banner (WCAG 2.4.11).
    const root = document.documentElement;
    root.style.scrollPaddingBottom = `${(ref.current?.offsetHeight ?? 0) + 24}px`;
    return () => {
      root.style.scrollPaddingBottom = "";
    };
  }, [open, reopened]);

  if (!open) return null;

  function choose(choice: ConsentChoice) {
    saveConsent(choice);
    reopened?.returnTo?.focus();
    setReopened(null);
  }

  return (
    <section
      ref={ref}
      aria-labelledby="consent-title"
      className="brutal brutal-static fixed inset-x-4 bottom-4 z-60 mx-auto grid max-w-2xl gap-4 bg-surface p-5 md:p-6"
    >
      <h2 id="consent-title" ref={headingRef} tabIndex={-1} className="font-display text-[1.1875rem] font-extrabold outline-none">
        Cookies
      </h2>
      <p className="text-small md:text-body">
        We use analytics cookies to understand how people use our site and improve it.{" "}
        <Link href="/privacy" className="text-link">
          Privacy
        </Link>
      </p>
      {reopened && (stored === "accepted" || stored === "declined") && (
        <p className="text-small text-ink-muted">Your current choice: {stored}.</p>
      )}
      <div className="flex flex-wrap gap-3">
        <CruiseButton onClick={() => choose("accepted")}>Accept</CruiseButton>
        <CruiseButton variant="secondary" onClick={() => choose("declined")}>
          Decline
        </CruiseButton>
      </div>
    </section>
  );
}
