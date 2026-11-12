"use client";

import { analyticsEnabled, OPEN_COOKIE_SETTINGS } from "@/lib/analytics";

/** Footer link that reopens the cookie banner. Hidden when analytics aren't set up. */
export function CookieSettingsButton({ className }: { className?: string }) {
  if (!analyticsEnabled) return null;
  return (
    <button type="button" className={className} onClick={() => window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS))}>
      Cookie settings
    </button>
  );
}
