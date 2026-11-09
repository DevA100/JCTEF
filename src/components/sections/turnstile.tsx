"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Cloudflare Turnstile widget. It adds a hidden "cf-turnstile-response"
 * field to the form, which the Server Action checks (src/lib/turnstile.ts).
 *
 * Fails open safely: if the script can't load (blocked, offline, slow) or the
 * widget errors (e.g. 110200, an unknown domain), the widget is hidden, the
 * form still submits, nothing is shown to the person, and the form sends
 * turnstileStatus="unavailable" plus the error code. The server accepts such
 * submissions under a much stricter rate limit and flags them to the team.
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
/** If the script hasn't loaded by then (e.g. silently blocked), give up on it. */
const LOAD_TIMEOUT_MS = 10_000;

let loading: Promise<TurnstileApi> | null = null;
function loadTurnstile(): Promise<TurnstileApi> {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  loading ??= new Promise<TurnstileApi>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error("script-empty")));
    script.onerror = () => reject(new Error("script-blocked"));
    document.head.appendChild(script);
  }).catch((error: unknown) => {
    loading = null; // Let a later form try again.
    throw error;
  });
  return loading;
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("script-timeout")), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error: unknown) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

export function Turnstile({ action }: { action: string }) {
  const ref = useRef<HTMLDivElement>(null);
  /** Set when the widget can't be used; holds the error code ("" if none). */
  const [unavailable, setUnavailable] = useState<string | null>(null);

  useEffect(() => {
    if (!SITE_KEY || !ref.current) return;
    const el = ref.current;
    let widgetId: string | undefined;
    let cancelled = false;

    const giveUp = (code: string) => {
      if (cancelled) return;
      cancelled = true;
      if (widgetId) {
        try {
          window.turnstile?.remove(widgetId);
        } catch {
          // Already gone.
        }
        widgetId = undefined;
      }
      setUnavailable(code.slice(0, 20));
    };

    withTimeout(loadTurnstile(), LOAD_TIMEOUT_MS)
      .then((api) => {
        if (cancelled) return;
        try {
          widgetId = api.render(el, {
            sitekey: SITE_KEY,
            action,
            theme: "light",
            size: "flexible",
            "refresh-expired": "auto",
            retry: "never",
            // Returning true tells Turnstile the error is handled, so it
            // doesn't throw it as an uncaught error.
            "error-callback": (code?: string | number) => {
              giveUp(String(code ?? "error"));
              return true;
            },
            "unsupported-callback": () => giveUp("unsupported"),
          });
        } catch {
          giveUp("render-failed");
        }
      })
      .catch((error: unknown) => giveUp(error instanceof Error ? error.message : "load-failed"));

    return () => {
      cancelled = true;
      if (widgetId) {
        try {
          window.turnstile?.remove(widgetId);
        } catch {
          // Already gone.
        }
      }
    };
  }, [action]);

  if (!SITE_KEY) return null;
  if (unavailable !== null) {
    return (
      <>
        <input type="hidden" name="turnstileStatus" value="unavailable" />
        {unavailable && <input type="hidden" name="turnstileError" value={unavailable} />}
      </>
    );
  }
  return <div ref={ref} className="min-h-[65px] max-w-[400px]" />;
}
