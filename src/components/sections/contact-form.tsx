"use client";

import { useActionState, useEffect, useRef } from "react";
import { type ContactState, sendContactMessage } from "@/app/actions/contact";
import { CruiseAlert } from "@/components/cruise/alert";
import { CruiseButton } from "@/components/cruise/button";
import { CruiseInput } from "@/components/cruise/input";
import { CruisePhoneInput } from "@/components/cruise/phone-input";
import { CruiseTextarea } from "@/components/cruise/textarea";
import { CruiseToaster, useCruiseToast } from "@/components/cruise/toaster";
import { Honeypot } from "./honeypot";

const initial: ContactState = { status: "idle", id: 0 };

function Form() {
  const { toast } = useCruiseToast();
  const [state, action, pending] = useActionState(sendContactMessage, initial);
  const v = state.status === "error" ? state.values : undefined;

  // Success shows as a toast (announced to screen readers as a status).
  const announced = useRef(0);
  useEffect(() => {
    // Only react to a new result. Pages you leave are kept alive and their
    // effects re-run when you come back; this stops old toasts reappearing.
    if (state.id === announced.current) return;
    announced.current = state.id;
    if (state.status !== "success") return;
    toast({ tone: "success", title: "Message sent", description: state.message, duration: 7000 });
  }, [state, toast]);

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
      <CruisePhoneInput
        // Remount after each result: empty after success, kept after an error.
        key={`phone-${state.id}`}
        defaultValue={v?.phone}
        label="Phone number"
        name="phone"
        hint="Optional. A Nigerian mobile number, e.g. 0803 123 4567."
      />
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
      {/* Errors stay next to the form, beside the fields that need fixing. */}
      <div aria-live="polite">
        {state.status === "error" && (
          <CruiseAlert tone="danger" title="Your message was not sent">
            {state.message}
          </CruiseAlert>
        )}
      </div>
    </form>
  );
}

/** Sends to info@jctef.org through Brevo (see src/app/actions/contact.ts). */
export function ContactForm() {
  return (
    <CruiseToaster position="bottom-center">
      <Form />
    </CruiseToaster>
  );
}
