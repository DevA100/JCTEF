"use client";

import { CruiseButton } from "@/components/cruise/button";
import { CruiseInput } from "@/components/cruise/input";
import { CruiseToaster, useCruiseToast } from "@/components/cruise/toaster";
import { home } from "@/lib/content";

function Form() {
  const { toast } = useCruiseToast();

  return (
    <form
      className="grid gap-5"
      onSubmit={(event) => {
        event.preventDefault();
        // TODO(JCTEF): connect a newsletter provider (e.g. Mailchimp, Brevo or
        // a server action) and replace this message with a real confirmation.
        toast({
          tone: "info",
          title: "Newsletter coming soon",
          description: "Sign-ups aren't live yet, so your details were not saved. Please check back soon.",
          duration: 6000,
        });
      }}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <CruiseInput label="First name" name="firstName" autoComplete="given-name" />
        <CruiseInput label="Email address" name="email" type="email" autoComplete="email" inputMode="email" required />
      </div>
      <label className="check items-start">
        <input type="checkbox" name="consent" className="checkbox mt-2.5" required />
        <span className="pt-2">{home.newsletter.consent}</span>
      </label>
      <div>
        <CruiseButton type="submit">Subscribe</CruiseButton>
      </div>
    </form>
  );
}

/** Form UI only for now: there is no newsletter backend yet. */
export function NewsletterForm() {
  return (
    <CruiseToaster position="bottom-center">
      <Form />
    </CruiseToaster>
  );
}
