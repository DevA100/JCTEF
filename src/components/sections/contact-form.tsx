"use client";

import { useActionState, useEffect, useRef } from "react";
import { type ContactState, sendContactMessage } from "@/app/actions/contact";
import { CruiseAlert } from "@/components/cruise/alert";
import { CruiseButton } from "@/components/cruise/button";
import { CruiseInput } from "@/components/cruise/input";
import { CruiseTextarea } from "@/components/cruise/textarea";
import { CruiseToaster, useCruiseToast } from "@/components/cruise/toaster";
import { site } from "@/lib/content";
import { track } from "@/lib/analytics";
import { withFailSafe } from "@/lib/form-action";
import { Honeypot } from "./honeypot";
import { PhoneField } from "./phone-field";
import { Turnstile } from "./turnstile";

const initial: ContactState = { status: "idle", id: 0 };

const submit = withFailSafe<ContactState>(
  sendContactMessage,
  (prev, formData, message) => ({
    status: "error",
    id: prev.id + 1,
    message,
    values: {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? "") || undefined,
      message: String(formData.get("message") ?? ""),
    },
  }),
  site.email,
);

function Form() {
  const { toast } = useCruiseToast();
  const [state, action, pending] = useActionState(submit, initial);
  const v = state.status === "error" ? state.values : undefined;

  // Fields to fix show as an alert beside the form; everything else (success,
  // or a failure the person can't fix in the form) shows as a toast.
  const fieldErrors = state.status === "error" && Object.values(state.errors ?? {}).some(Boolean);
  const announced = useRef(0);
  useEffect(() => {
    // Only react to a new result. Pages you leave are kept alive and their
    // effects re-run when you come back; this stops old toasts reappearing.
    if (state.id === announced.current) return;
    announced.current = state.id;
    if (state.status === "success") {
      toast({ tone: "success", title: "Message sent", description: state.message, duration: 7000 });
      if (state.analytics) track("contact_message_sent", { verified: state.analytics.verified });
    } else if (state.status === "error" && !fieldErrors) {
      toast({ tone: "danger", title: "Your message was not sent", description: state.message, duration: 9000 });
    }
  }, [state, toast, fieldErrors]);

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
      <PhoneField
        // Remount after each result: empty after success, kept after an error.
        key={`phone-${state.id}`}
        defaultValue={v?.phone}
        label="Phone number"
        name="phone"
        hint="Optional. Choose your country first if it isn't Nigeria."
        error={state.errors?.phone}
      />
      <CruiseTextarea
        // Remount after each result: resets the character count and height.
        key={`message-${state.id}`}
        label="Your message"
        name="message"
        required
        maxLength={2000}
        autoGrow
        defaultValue={v?.message}
        error={state.errors?.message}
      />
      <Honeypot />
      <Turnstile key={`turnstile-${state.id}`} action="contact" />
      <div>
        <CruiseButton type="submit" disabled={pending} aria-disabled={pending}>
          {pending ? "Sending…" : "Send message"}
        </CruiseButton>
      </div>
      {/* Errors stay next to the form, beside the fields that need fixing. */}
      <div aria-live="polite">
        {fieldErrors && (
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
