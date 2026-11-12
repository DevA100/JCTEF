import posthog, { type CaptureResult } from "posthog-js";
import { ANALYTICS_PATH, POSTHOG_UI_HOST } from "../analytics-proxy.mjs";
import { analyticsEnabled, applyConsent, readConsent, scrubUrl } from "@/lib/analytics";

/**
 * PostHog analytics (EU), set up before the app becomes interactive
 * (https://posthog.com/docs/libraries/next-js). Does nothing without
 * NEXT_PUBLIC_POSTHOG_KEY, so local development works without it.
 *
 * Consent (Nigeria Data Protection Act), using PostHog's documented
 * cookieless pattern (https://posthog.com/docs/privacy/data-collection):
 * - cookieless_mode "on_reject" + opt_out_capturing_by_default: until the
 *   visitor accepts, PostHog stores nothing in the browser and counts them
 *   with a privacy-preserving hash made on PostHog's servers.
 * - Accept (the banner) → posthog.opt_in_capturing(): its cookie and
 *   localStorage are used, so returning visitors are recognised.
 * - Decline, Do Not Track (respect_dnt) → stays cookieless.
 * Cookieless tracking must also be switched on in the PostHog project
 * (Settings → Project → Web analytics), or those events are discarded.
 *
 * Page views: `defaults` makes capture_pageview "history_change", which
 * counts the first load and every App Router navigation exactly once. Don't
 * add a manual $pageview as well.
 */
function scrubEvent(event: CaptureResult | null): CaptureResult | null {
  if (!event) return event;
  for (const bag of [event.properties, event.$set, event.$set_once]) {
    if (!bag) continue;
    for (const [key, value] of Object.entries(bag)) {
      if (typeof value === "string") bag[key] = scrubUrl(value);
    }
  }
  return event;
}

if (analyticsEnabled) {
  try {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: ANALYTICS_PATH,
      ui_host: POSTHOG_UI_HOST,
      defaults: "2026-08-30",
      cookieless_mode: "on_reject",
      opt_out_capturing_by_default: true,
      respect_dnt: true,
      // No logins, so no identify() and no person profiles.
      person_profiles: "identified_only",
      // Session replay is off. If it's ever turned on (here and in the
      // project), everything typed and all text inside forms stays masked.
      disable_session_recording: true,
      session_recording: { maskAllInputs: true, maskTextSelector: "form, form *, [data-ph-mask]" },
      // Clicks are counted, but never inside forms (custom events cover them).
      autocapture: { css_selector_ignorelist: [".ph-no-capture", "[data-ph-no-capture]", "form", "form *"] },
      before_send: scrubEvent,
      loaded: () => {
        const choice = readConsent();
        if (choice) applyConsent(choice);
      },
    });
  } catch {
    // Analytics must never stop the site from working.
  }
}
