"use client";

import { useActionState, useEffect, useRef } from "react";
import { type NewsletterState, subscribeToNewsletter } from "@/app/actions/newsletter";
import { CruiseButton } from "@/components/cruise/button";
import { CruiseInput } from "@/components/cruise/input";
import { CruiseToaster, useCruiseToast } from "@/components/cruise/toaster";
import { home, site } from "@/lib/content";
import { track } from "@/lib/analytics";
import { withFailSafe } from "@/lib/form-action";
import { Honeypot } from "./honeypot";
import { Turnstile } from "./turnstile";

const initial: NewsletterState = { status: "idle", id: 0 };

const TITLES: Record<Exclude<NewsletterState["status"], "idle">, string> = {
  confirm: "Check your inbox",
  already: "Already subscribed",
  error: "Not subscribed",
};

const submit = withFailSafe<NewsletterState>(
  subscribeToNewsletter,
  (prev, _formData, message) => ({ status: "error", id: prev.id + 1, message }),
  site.email,
);

function Form() {
  const { toast } = useCruiseToast();
  const [state, action, pending] = useActionState(submit, initial);

  const announced = useRef(0);
  useEffect(() => {
    // Only react to a new result. Pages you leave are kept alive and their
    // effects re-run when you come back; this stops old toasts reappearing.
    if (state.id === announced.current) return;
    announced.current = state.id;
    if (state.status === "confirm" && state.started) track("newsletter_signup_started");
    if (state.status === "idle" || !state.message) return;
    toast({
      tone: state.status === "error" ? "danger" : state.status === "already" ? "info" : "success",
      title: TITLES[state.status],
      description: state.message,
      duration: 7000,
    });
  }, [state, toast]);

  return (
    <form action={action} className="relative grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <CruiseInput label="First name" name="firstName" autoComplete="given-name" maxLength={60} />
        <CruiseInput label="Last name" name="lastName" autoComplete="family-name" maxLength={60} />
      </div>
      <div>
        <CruiseInput
          label="Email address"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          error={state.errors?.email}
        />
      </div>
      <div className="grid gap-1">
        <label className="check items-start">
          <input
            type="checkbox"
            name="consent"
            className="checkbox mt-2.5"
            required
            aria-invalid={state.errors?.consent ? true : undefined}
            aria-describedby={state.errors?.consent ? "newsletter-consent-error" : undefined}
          />
          <span className="pt-2">{home.newsletter.consent}</span>
        </label>
        {state.errors?.consent && (
          <p id="newsletter-consent-error" className="text-small font-bold">
            {state.errors.consent}
          </p>
        )}
      </div>
      <Honeypot />
      <Turnstile key={`turnstile-${state.id}`} action="newsletter" />
      <div>
        <CruiseButton type="submit" disabled={pending} aria-disabled={pending}>
          {pending ? "Subscribing…" : "Subscribe"}
        </CruiseButton>
      </div>
      {/* Toasts can be missed; mirror the result for screen readers. */}
      <p aria-live="polite" className="visually-hidden">
        {state.message}
      </p>
    </form>
  );
}

/** Signs people up to the Brevo list (see src/app/actions/newsletter.ts). */
export function NewsletterForm() {
  return (
    <CruiseToaster position="bottom-center">
      <Form />
    </CruiseToaster>
  );
}
