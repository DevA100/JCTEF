"use client";

import Link from "next/link";
import { type FormEvent, useActionState, useEffect, useRef, useState } from "react";
import { submitVolunteerApplication, type VolunteerState } from "@/app/actions/volunteer";
import { CruiseButton } from "@/components/cruise/button";
import { CruiseCheckbox } from "@/components/cruise/checkbox";
import { CruiseInput } from "@/components/cruise/input";
import { CruiseSelect } from "@/components/cruise/select";
import { CruiseTextarea } from "@/components/cruise/textarea";
import { CruiseToaster, useCruiseToast } from "@/components/cruise/toaster";
import { frameworkStages, getInvolved, site, volunteerAvailability, volunteerRoles } from "@/lib/content";
import { cx } from "@/lib/cruise-utils";
import { withFailSafe } from "@/lib/form-action";
import { track } from "@/lib/analytics";
import { readVolunteerForm, type VolunteerField, volunteerErrors, volunteerSchema } from "@/lib/volunteer-schema";
import { Honeypot } from "./honeypot";
import { PhoneField } from "./phone-field";
import { Turnstile } from "./turnstile";

const copy = getInvolved.volunteer.form;
const initial: VolunteerState = { status: "idle", id: 0 };

const submit = withFailSafe<VolunteerState>(
  submitVolunteerApplication,
  (prev, formData, message) => ({ status: "error", id: prev.id + 1, message, values: readVolunteerForm(formData) }),
  site.email,
);

/** An error line under a group of radios or checkboxes. */
function GroupError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="text-small font-bold">
      {message}
    </p>
  );
}

function Form() {
  const { toast } = useCruiseToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState(submit, initial);
  /** Browser-side errors, tied to the server result they were made after. */
  const [client, setClient] = useState<{ id: number; errors: Partial<Record<VolunteerField, string>> } | null>(null);
  /** The role picked since the last server result (shows the areas list). */
  const [picked, setPicked] = useState<{ id: number; role: string } | null>(null);

  const kept = state.status === "invalid" || state.status === "error" ? state.values : undefined;
  const errors = client?.id === state.id ? client.errors : state.status === "invalid" ? (state.errors ?? {}) : {};
  const role = picked?.id === state.id ? picked.role : String(kept?.role ?? "");
  const keptAreas = Array.isArray(kept?.areas) ? (kept.areas as string[]) : [];
  const announcement =
    state.status === "success"
      ? `Application sent! ${copy.success(state.firstName ?? "", state.email ?? "")}`
      : state.status === "error"
        ? (state.message ?? copy.error)
        : "";
  const text = (name: string) => (typeof kept?.[name] === "string" ? (kept[name] as string) : undefined);

  const focusFirstError = () =>
    requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());

  const announced = useRef(0);
  // React to each server result once.
  useEffect(() => {
    // Only react to a new result. Pages you leave are kept alive and their
    // effects re-run when you come back; this stops old toasts reappearing.
    if (state.id === announced.current) return;
    announced.current = state.id;
    if (state.status === "success") {
      const message = copy.success(state.firstName ?? "", state.email ?? "");
      toast({ tone: "success", title: "Application sent!", description: message, duration: 8000 });
      if (state.analytics) track("volunteer_application_submitted", state.analytics);
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      formRef.current?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    } else if (state.status === "error") {
      toast({ tone: "danger", title: "Not sent", description: state.message ?? copy.error, duration: 8000 });
    } else if (state.status === "invalid") {
      focusFirstError();
    }
  }, [state, toast]);

  // Check in the browser first; the server checks again.
  function onSubmit(event: FormEvent<HTMLFormElement>) {
    const result = volunteerSchema.safeParse(readVolunteerForm(new FormData(event.currentTarget)));
    if (!result.success) {
      event.preventDefault();
      setClient({ id: state.id, errors: volunteerErrors(result.error) });
      focusFirstError();
    } else {
      setClient(null);
    }
  }

  const invalid = (field: VolunteerField) =>
    errors[field] ? { "aria-invalid": true as const, "aria-describedby": `vf-${field}-error` } : {};

  return (
    <form
      ref={formRef}
      action={action}
      onSubmit={onSubmit}
      noValidate
      className="relative grid scroll-mt-28 gap-6"
      aria-describedby="vf-required-note"
    >
      <p id="vf-required-note" className="text-small text-ink-muted">
        Fields marked “Required” must be filled in.
      </p>

      <div className="grid gap-5 sm:grid-cols-2">
        <CruiseInput
          label="First name"
          name="firstName"
          autoComplete="given-name"
          required
          maxLength={60}
          defaultValue={text("firstName")}
          error={errors.firstName}
        />
        <CruiseInput
          label="Last name"
          name="lastName"
          autoComplete="family-name"
          required
          maxLength={60}
          defaultValue={text("lastName")}
          error={errors.lastName}
        />
        <CruiseInput
          label="Email address"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          maxLength={200}
          defaultValue={text("email")}
          error={errors.email}
        />
        <PhoneField
          // Remount after each result: empty after success, kept after an error.
          key={`phone-${state.id}`}
          label="Phone number"
          name="phone"
          hint="Optional. Choose your country first if it isn't Nigeria."
          defaultValue={text("phone")}
          error={errors.phone}
        />
        <CruiseInput
          label="Location"
          name="location"
          autoComplete="address-level2"
          hint="Optional. City and state, e.g. Ikeja, Lagos."
          maxLength={100}
          defaultValue={text("location")}
          error={errors.location}
        />
        <CruiseSelect
          // Remount after each result so the kept choice is restored.
          key={`availability-${state.id}`}
          label="Availability"
          name="availability"
          defaultValue={text("availability") ?? ""}
          hint="Optional."
          error={errors.availability}
        >
          <option value="">Choose one</option>
          {volunteerAvailability.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </CruiseSelect>
      </div>

      {/* Role: a radio group (Cruise .radio-group styles). */}
      <fieldset className="radio-group" aria-required="true" aria-describedby={errors.role ? "vf-role-error" : undefined}>
        <legend>
          {copy.roleLegend} <span className="font-normal normal-case tracking-normal text-ink-muted">(Required)</span>
        </legend>
        <div className="grid gap-x-6 sm:grid-cols-2">
          {volunteerRoles.map((option) => (
            <label key={option} className="check">
              <input
                type="radio"
                className="radio"
                name="role"
                value={option}
                defaultChecked={kept?.role === option}
                onChange={() => setPicked({ id: state.id, role: option })}
                {...invalid("role")}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
        <GroupError id="vf-role-error" message={errors.role} />
      </fieldset>

      {/* Facilitator areas: only when "Programme facilitator" is picked. */}
      {role === "Programme facilitator" && (
        <div className="brutal brutal-static p-4 md:p-5">
          <fieldset className="radio-group" aria-describedby="vf-areas-hint">
            <legend>{copy.areasLegend}</legend>
            <p id="vf-areas-hint" className="text-small text-ink-muted">
              {copy.areasHint}{" "}
              <Link href={copy.areasLink.href} className="text-link" target="_blank" rel="noopener noreferrer">
                {copy.areasLink.label}
                <span className="visually-hidden"> (opens in a new tab)</span>
              </Link>
            </p>
            <div className="grid gap-x-6 md:grid-cols-2">
              {frameworkStages.map((stage) => (
                <CruiseCheckbox
                  key={stage.title}
                  name="areas"
                  value={stage.title}
                  defaultChecked={keptAreas.includes(stage.title)}
                  label={stage.title}
                />
              ))}
            </div>
          </fieldset>
        </div>
      )}

      <CruiseTextarea
        // Remount after each result: resets the character count and height.
        key={`experience-${state.id}`}
        label="Relevant experience"
        name="experience"
        hint="Optional. Skills, roles or causes you've worked on."
        maxLength={1500}
        autoGrow
        defaultValue={text("experience")}
        error={errors.experience}
      />
      <CruiseTextarea
        // Remount after each result: resets the character count and height.
        key={`message-${state.id}`}
        label="Why do you want to volunteer with JCTEF?"
        name="message"
        required
        maxLength={2000}
        autoGrow
        hint="At least 20 characters."
        defaultValue={text("message")}
        error={errors.message}
      />

      <div className="grid gap-2">
        <CruiseCheckbox
          name="consentContact"
          label={copy.consentContact}
          defaultChecked={kept?.consentContact === "on"}
          {...invalid("consentContact")}
        />
        <GroupError id="vf-consentContact-error" message={errors.consentContact} />
        <CruiseCheckbox
          name="consentAge"
          label={copy.consentAge}
          defaultChecked={kept?.consentAge === "on"}
          {...invalid("consentAge")}
        />
        <GroupError id="vf-consentAge-error" message={errors.consentAge} />
      </div>

      <Honeypot />
      <Turnstile key={`turnstile-${state.id}`} action="volunteer" />

      <div>
        <CruiseButton type="submit" disabled={pending} aria-disabled={pending} className={cx(pending && "cursor-wait")}>
          {pending ? copy.sending : copy.submit}
        </CruiseButton>
      </div>

      {/* Toasts announce themselves; this mirror makes sure screen readers hear it. */}
      <p aria-live="polite" className="visually-hidden">
        {announcement}
      </p>
    </form>
  );
}

/** JCTEF's own volunteer application (replaces the old Google Form). */
export function VolunteerForm() {
  return (
    <CruiseToaster position="bottom-center">
      <Form />
    </CruiseToaster>
  );
}
