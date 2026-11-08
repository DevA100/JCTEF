"use client";

import { useActionState } from "react";
import { type ContactState, sendContactMessage } from "@/app/actions/contact";
import { CruiseAlert } from "@/components/cruise/alert";
import { CruiseButton } from "@/components/cruise/button";
import { CruiseInput } from "@/components/cruise/input";
import { CruisePhoneInput } from "@/components/cruise/phone-input";
import { CruiseTextarea } from "@/components/cruise/textarea";
import { Honeypot } from "./honeypot";

const initial: ContactState = { status: "idle" };

/** Sends to info@jctef.org through Brevo (see src/app/actions/contact.ts). */
export function ContactForm() {
  const [state, action, pending] = useActionState(sendContactMessage, initial);
  const v = state.status === "error" ? state.values : undefined;

  return (
    <form action={action} className="grid gap-5">
      <CruiseInput
        label="Your name"
        name="name"
        autoComplete="name"
        required
        maxLength={100}
        defaultValue={v?.name}
        error={state.errors?.name}
      />
      <CruiseInput
        label="Email address"
        name="email"
        type="email"
        autoComplete="email"
        inputMode="email"
        required
        defaultValue={v?.email}
        error={state.errors?.email}
      />
      <CruisePhoneInput label="Phone number" name="phone" hint="Optional. A Nigerian mobile number, e.g. 0803 123 4567." />
      <CruiseTextarea
        label="Your message"
        name="message"
        required
        maxLength={2000}
        autoGrow
        defaultValue={v?.message}
        error={state.errors?.message}
      />
      <Honeypot />
      <div>
        <CruiseButton type="submit" disabled={pending} aria-disabled={pending}>
          {pending ? "Sending…" : "Send message"}
        </CruiseButton>
      </div>
      <div aria-live="polite">
        {state.status === "success" && (
          <CruiseAlert tone="success" title="Message sent">
            {state.message}
          </CruiseAlert>
        )}
        {state.status === "error" && (
          <CruiseAlert tone="danger" title="Your message was not sent">
            {state.message}
          </CruiseAlert>
        )}
      </div>
    </form>
  );
}
