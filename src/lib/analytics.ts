import posthog from "posthog-js";

/**
 * Analytics (PostHog, EU). Set up in src/instrumentation-client.ts; see the
 * "Analytics" section of the README for what is and isn't tracked.
 *
 * Every call here is safe: when PostHog isn't set up (no
 * NEXT_PUBLIC_POSTHOG_KEY, e.g. local development), hasn't loaded, or throws,
 * nothing happens. Analytics must never break a form or a button.
 *
 * Never put personal data in event properties: no names, emails, phone
 * numbers or anything typed into a form.
 */

/** Events and their properties. Values are labels, never anything a person typed. */
type EventProperties = {
  /** location: header, menu, hero, footer, get_involved, … (see AnalyticsClicks). */
  donate_clicked: { location: string };
  volunteer_application_submitted: { role: string; verified: boolean };
  partner_enquiry_submitted: { org_type: string; verified: boolean };
  contact_message_sent: { verified: boolean };
  /** The confirmation email was sent (double opt-in started). */
  newsletter_signup_started: undefined;
  /** The person clicked the link in the confirmation email. */
  newsletter_confirmed: undefined;
  reset_register_clicked: { location: string };
  cohort_join_clicked: undefined;
  programme_viewed: { programme: string };
  blog_post_read: { slug: string };
};
export type AnalyticsEvent = keyof EventProperties;

export const analyticsEnabled = Boolean(process.env.NEXT_PUBLIC_POSTHOG_KEY);

export function track<E extends AnalyticsEvent>(
  event: E,
  ...[properties]: EventProperties[E] extends undefined ? [] : [EventProperties[E]]
): void {
  try {
    if (!analyticsEnabled || !posthog.__loaded) return;
    posthog.capture(event, properties ?? undefined);
  } catch {
    // Never let analytics break the page.
  }
}

/* -------------------------------------------------------------------------- */
/* Consent                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Until a visitor answers, PostHog runs cookieless: anonymous counts, nothing
 * stored in the browser. "accepted" turns on PostHog's cookie and local
 * storage; "declined" stays cookieless. The choice is kept in localStorage
 * (PostHog also keeps its own copy of it).
 */
export type ConsentChoice = "accepted" | "declined";

const CONSENT_KEY = "jctef-analytics-consent";
/** Fired on window to open the banner again (the footer's "Cookie settings"). */
export const OPEN_COOKIE_SETTINGS = "jctef:cookie-settings";

/** The choice made on this page, for when localStorage is blocked. */
let pageChoice: ConsentChoice | null = null;
const listeners = new Set<() => void>();

export function readConsent(): ConsentChoice | null {
  try {
    const value = window.localStorage.getItem(CONSENT_KEY);
    if (value === "accepted" || value === "declined") return value;
  } catch {
    // Storage blocked: fall back to this page's choice.
  }
  return pageChoice;
}

/** For useSyncExternalStore: a choice made here or in another tab. */
export function subscribeConsent(onChange: () => void): () => void {
  listeners.add(onChange);
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

/** Do Not Track or Global Privacy Control: treated as "declined", and no banner. */
export function browserSaysNoTracking(): boolean {
  try {
    const nav = navigator as Navigator & { globalPrivacyControl?: boolean };
    const win = window as Window & { doNotTrack?: string };
    return nav.doNotTrack === "1" || win.doNotTrack === "1" || nav.globalPrivacyControl === true;
  } catch {
    return false;
  }
}

/** Tells PostHog about a choice (also used at start-up, in case its copy was lost). */
export function applyConsent(choice: ConsentChoice): void {
  try {
    if (!analyticsEnabled || !posthog.__loaded) return;
    const current = posthog.get_explicit_consent_status();
    if (choice === "accepted" && current !== "granted") posthog.opt_in_capturing();
    if (choice === "declined" && current !== "denied") posthog.opt_out_capturing();
  } catch {
    // Never let analytics break the page.
  }
}

export function saveConsent(choice: ConsentChoice): void {
  pageChoice = choice;
  try {
    window.localStorage.setItem(CONSENT_KEY, choice);
  } catch {
    // Private mode or storage blocked: the choice lasts for this page only.
  }
  applyConsent(choice);
  for (const listener of listeners) listener();
}

/* -------------------------------------------------------------------------- */
/* Personal data in URLs                                                      */
/* -------------------------------------------------------------------------- */

/** Query parameters that could carry personal data or secrets. */
const SENSITIVE_PARAM = /mail|phone|name|token|code|key|secret|pass|auth|session/i;

/** Removes query parameters that could identify someone (e.g. ?email=…). */
export function scrubUrl(value: string): string {
  if (!/^https?:\/\//i.test(value) || !value.includes("?")) return value;
  try {
    const url = new URL(value);
    for (const [key, param] of [...url.searchParams]) {
      if (SENSITIVE_PARAM.test(key) || param.includes("@")) url.searchParams.delete(key);
    }
    return url.toString();
  } catch {
    return value.split("?")[0];
  }
}
