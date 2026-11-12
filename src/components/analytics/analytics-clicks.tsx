"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

/**
 * One listener for the link events, so server components need no client
 * code and every new Donate or WhatsApp link is counted automatically:
 *
 *   donate_clicked          any link to the Flutterwave donate page
 *   whatsapp_clicked        any wa.me / WhatsApp link
 *   reset_register_clicked  any link to the RESET registration page
 *   cohort_join_clicked     an element with data-track="cohort_join_clicked"
 *
 * `location` comes from the nearest data-analytics-location (header, menu,
 * hero, footer), otherwise the page ("home", "get_involved", "contact", …).
 */
const TRACKED_ELEMENT_EVENTS = new Set(["cohort_join_clicked"]);

function locationOf(element: Element): string {
  const marked = element.closest<HTMLElement>("[data-analytics-location]");
  if (marked?.dataset.analyticsLocation) return marked.dataset.analyticsLocation;
  const first = window.location.pathname.split("/").filter(Boolean)[0];
  return first ? first.replace(/-/g, "_") : "home";
}

export function AnalyticsClicks({ donateUrl, resetUrls }: { donateUrl: string; resetUrls: string[] }) {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      // Left click, or middle click (opens in a new tab).
      if (event.type === "auxclick" && event.button !== 1) return;
      const target = event.target instanceof Element ? event.target : null;
      if (!target) return;

      const marked = target.closest<HTMLElement>("[data-track]");
      if (marked?.dataset.track === "cohort_join_clicked" && TRACKED_ELEMENT_EVENTS.has(marked.dataset.track)) {
        track("cohort_join_clicked");
        return;
      }

      const link = target.closest<HTMLAnchorElement>("a[href]");
      if (!link) return;
      const href = link.href;
      if (href.startsWith(donateUrl)) track("donate_clicked", { location: locationOf(link) });
      else if (/^https:\/\/(wa\.me|api\.whatsapp\.com)\//.test(href)) track("whatsapp_clicked", { location: locationOf(link) });
      else if (resetUrls.includes(href)) track("reset_register_clicked", { location: locationOf(link) });
    };
    document.addEventListener("click", onClick, { capture: true });
    document.addEventListener("auxclick", onClick, { capture: true });
    return () => {
      document.removeEventListener("click", onClick, { capture: true });
      document.removeEventListener("auxclick", onClick, { capture: true });
    };
  }, [donateUrl, resetUrls]);

  return null;
}
