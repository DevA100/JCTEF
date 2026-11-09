"use client";

import { type FormEvent, useActionState, useEffect, useRef, useState } from "react";
import { type PartnerState, submitPartnerEnquiry } from "@/app/actions/partner";
import { CruiseButton } from "@/components/cruise/button";
import { CruiseCheckbox } from "@/components/cruise/checkbox";
import { CruiseInput } from "@/components/cruise/input";
import { CruisePhoneInput } from "@/components/cruise/phone-input";
import { CruiseSelect } from "@/components/cruise/select";
import { CruiseTextarea } from "@/components/cruise/textarea";
import { CruiseToaster, useCruiseToast } from "@/components/cruise/toaster";
import { getInvolved, partnerAreasFor, partnerOrgTypes } from "@/lib/content";
import { cx } from "@/lib/cruise-utils";
import { type PartnerField, partnerErrors, partnerSchema, readPartnerForm } from "@/lib/partner-schema";
import { Honeypot } from "./honeypot";
import { Turnstile } from "./turnstile";

const copy = getInvolved.partner.form;
const initial: PartnerState = { status: "idle", id: 0 };

function Form({ teamEmail }: { teamEmail: string }) {
  const { toast } = useCruiseToast();
  const formRef = useRef<HTMLFormElement>(null);
  const announced = useRef(0);
  const [state, action, pending] = useActionState(submitPartnerEnquiry, initial);
  /** Browser-side errors, tied to the server result they were made after. */
  const [client, setClient] = useState<{ id: number; errors: Partial<Record<PartnerField, string>> } | null>(null);
  /** The organisation type picked since the last server result. */
  const [picked, setPicked] = useState<{ id: number; type: string } | null>(null);

  const kept = state.status === "invalid" || state.status === "error" ? state.values : undefined;
  const errors = client?.id === state.id ? client.errors : state.status === "invalid" ? (state.errors ?? {}) : {};
  const orgType = picked?.id === state.id ? picked.type : String(kept?.orgType ?? "");
  const areas = partnerAreasFor(orgType || undefined);
  const keptAreas = Array.isArray(kept?.areas) ? (kept.areas as string[]) : [];
  const text = (name: string) => (typeof kept?.[name] === "string" ? (kept[name] as string) : undefined);
  const announcement =
    state.status === "success"
      ? `Enquiry sent! ${copy.success(state.firstName ?? "")}`
      : state.status === "error"
        ? (state.message ?? copy.error(teamEmail))
        : "";

  const focusFirstError = () =>
    requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());

  useEffect(() => {
    // Only react to a new result (pages you leave are kept alive; their
    // effects re-run when you come back).
    if (state.id === announced.current) return;
    announced.current = state.id;
    if (state.status === "success") {
      toast({ tone: "success", title: "Enquiry sent!", description: copy.success(state.firstName ?? ""), duration: 8000 });
    } else if (state.status === "error") {
      toast({ tone: "danger", title: "Not sent", description: state.message ?? copy.error(teamEmail), duration: 8000 });
    } else if (state.status === "invalid") {
      focusFirstError();
    }
  }, [state, toast, teamEmail]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    const result = partnerSchema.safeParse(readPartnerForm(new FormData(event.currentTarget)));
    if (!result.success) {
      event.preventDefault();
      setClient({ id: state.id, errors: partnerErrors(result.error) });
      focusFirstError();
    } else {
      setClient(null);
    }
  }

  return (
    <form ref={formRef} action={action} onSubmit={onSubmit} noValidate className="relative grid gap-6">
      <p className="text-small text-ink-muted">Fields marked “Required” must be filled in.</p>

      <div className="grid gap-5 sm:grid-cols-2">
        <CruiseInput
          label="Full name"
          name="fullName"
          autoComplete="name"
          required
          maxLength={120}
          defaultValue={text("fullName")}
          error={errors.fullName}
        />
        <CruiseInput
          label="Organisation name"
          name="organisation"
          autoComplete="organization"
          required
          maxLength={150}
          defaultValue={text("organisation")}
          error={errors.organisation}
        />
        <CruiseInput
          label="Your role or title"
          name="role"
          autoComplete="organization-title"
          hint="Optional."
          maxLength={100}
          defaultValue={text("role")}
          error={errors.role}
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
        <CruisePhoneInput
          // Remount after each result: empty after success, kept after an error.
          key={`phone-${state.id}`}
          label="Phone number"
          name="phone"
          hint="Optional. A Nigerian mobile number."
          defaultValue={text("phone")}
        />
        <CruiseSelect
          // Remount after each result so the kept choice is restored.
          key={`orgType-${state.id}`}
          label={copy.orgTypeLabel}
          name="orgType"
          required
          defaultValue={text("orgType") ?? ""}
          onChange={(event) => setPicked({ id: state.id, type: event.currentTarget.value })}
          error={errors.orgType}
        >
          <option value="">Choose one</option>
          {partnerOrgTypes.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </CruiseSelect>
      </div>

      <fieldset className="radio-group" aria-describedby="pf-areas-hint">
        <legend>
          {copy.areasLegend} <span className="font-normal tracking-normal normal-case text-ink-muted">(Optional)</span>
        </legend>
        <p id="pf-areas-hint" className="text-small text-ink-muted">
          {orgType ? copy.areasHint : copy.areasHintNoType}
        </p>
        {/* Keyed by type so switching types starts with a clean set. */}
        <div key={`areas-${orgType}-${state.id}`} className="grid gap-x-6 sm:grid-cols-2">
          {areas.map((area) => (
            <CruiseCheckbox key={area} name="areas" value={area} label={area} defaultChecked={keptAreas.includes(area)} />
          ))}
        </div>
      </fieldset>

      <CruiseTextarea
        // Remount after each result: resets the character count and height.
        key={`message-${state.id}`}
        label="Tell us about the partnership you have in mind"
        name="message"
        required
        maxLength={3000}
        autoGrow
        hint="At least 30 characters. What would you like to do together?"
        defaultValue={text("message")}
        error={errors.message}
      />
      <CruiseInput
        label="Website or LinkedIn"
        name="orgWebsite"
        type="url"
        inputMode="url"
        autoComplete="url"
        hint="Optional, e.g. jctef.org or linkedin.com/company/…"
        maxLength={200}
        defaultValue={text("website")}
        error={errors.website}
      />

      <div className="grid gap-1">
        <CruiseCheckbox
          name="consent"
          label={copy.consent}
          defaultChecked={kept?.consent === "on"}
          {...(errors.consent ? { "aria-invalid": true, "aria-describedby": "pf-consent-error" } : {})}
        />
        {errors.consent && (
          <p id="pf-consent-error" className="text-small font-bold">
            {errors.consent}
          </p>
        )}
      </div>

      <Honeypot />
      <Turnstile key={`turnstile-${state.id}`} action="partner" />

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

/** Partnership enquiry form (replaces the old mailto link). */
export function PartnerForm({ teamEmail }: { teamEmail: string }) {
  return (
    <CruiseToaster position="bottom-center">
      <Form teamEmail={teamEmail} />
    </CruiseToaster>
  );
}
