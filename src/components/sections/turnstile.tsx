"use client";

import { useEffect, useRef } from "react";

/**
 * Cloudflare Turnstile widget. It adds a hidden "cf-turnstile-response"
 * field to the form, which the Server Action checks (src/lib/turnstile.ts).
 *
 * Renders nothing when TURNSTILE_SITE_KEY isn't set (local development).
 * Tokens can only be used once, so give it a `key` that changes after each
 * submission (e.g. the form's state.id) to get a fresh one.
 */
type TurnstileApi = {
  render: (el: HTMLElement, options: Record<string, unknown>) => string;
  remove: (widgetId: string) => void;
};
declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SITE_KEY = process.env.TURNSTILE_SITE_KEY ?? "";
const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

let loading: Promise<TurnstileApi> | null = null;
function loadTurnstile(): Promise<TurnstileApi> {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  loading ??= new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error("Turnstile did not load")));
    script.onerror = () => {
      loading = null;
      reject(new Error("Turnstile script failed to load"));
    };
    document.head.appendChild(script);
  });
  return loading;
}

export function Turnstile({ action }: { action: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!SITE_KEY || !ref.current) return;
    const el = ref.current;
    let widgetId: string | undefined;
    let cancelled = false;
    loadTurnstile()
      .then((api) => {
        if (cancelled) return;
        widgetId = api.render(el, {
          sitekey: SITE_KEY,
          action,
          theme: "light",
          size: "flexible",
          "refresh-expired": "auto",
        });
      })
      .catch((error: unknown) => console.warn(error));
    return () => {
      cancelled = true;
      if (widgetId) window.turnstile?.remove(widgetId);
    };
  }, [action]);

  if (!SITE_KEY) return null;
  return <div ref={ref} className="min-h-[65px] max-w-[400px]" />;
}
