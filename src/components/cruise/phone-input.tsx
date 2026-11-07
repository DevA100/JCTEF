"use client";

import { useId, useRef, useState, type ComponentProps } from "react";
import { cx } from "@/lib/cruise-utils";
import { CruiseFormField, cruiseFieldProps, cruiseOwnField, useCruiseField } from "./form-field";

/** The 10 national digits of a Nigerian number, from "0801…", "801…",
 * "+234801…" or "234801…", ignoring spaces and dashes. */
export function cruiseNgNational(raw: string): string {
  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("234")) digits = digits.slice(3);
  if (digits.startsWith("0")) digits = digits.slice(1);
  return digits.slice(0, 10);
}

/** A Nigerian mobile number: 10 digits starting 70, 71, 80, 81, 90 or 91. */
export const cruiseIsNgMobile = (national: string) => /^[789][01]\d{8}$/.test(national);

/** "0801 234 5678" -> "+2348012345678" (E.164), or null if it isn't a valid mobile number. */
export function cruiseToE164(raw: string): string | null {
  const national = cruiseNgNational(raw);
  return cruiseIsNgMobile(national) ? `+234${national}` : null;
}

/** What the box shows: "0801 234 5678" (a partly typed +234 stays as typed). */
export function cruiseFormatNgPhone(raw: string): string {
  const compact = raw.replace(/[\s-]/g, "");
  if (compact && /^\+?2?3?4?$/.test(compact) && compact !== "0") return compact;
  const national = cruiseNgNational(raw);
  if (!national) return compact.startsWith("0") || compact.startsWith("+234") || compact.startsWith("234") ? "0" : "";
  const full = `0${national}`;
  return [full.slice(0, 4), full.slice(4, 7), full.slice(7, 11)].filter(Boolean).join(" ");
}

/** Green-white-green, drawn with tokens (no emoji). */
export function CruiseNgFlag() {
  return (
    <svg viewBox="0 0 24 16" aria-hidden="true">
      <rect x="0" y="0" width="8" height="16" fill="var(--success)" />
      <rect x="8" y="0" width="8" height="16" fill="var(--on-success)" />
      <rect x="16" y="0" width="8" height="16" fill="var(--success)" />
      <rect x="0.75" y="0.75" width="22.5" height="14.5" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
    </svg>
  );
}

type PhoneProps = Omit<ComponentProps<"input">, "value" | "defaultValue" | "onChange" | "type"> & {
  /** Visible label. Leave out inside a CruiseFormField (it brings the label). */
  label?: string;
  hint?: string;
  /** Your own error; "not a valid number" is added for you. */
  error?: string;
  /** Any form ("0801…", "+234…"); shown as "0801 234 5678". */
  defaultValue?: string;
  /** The number in E.164 (+2348012345678), or null while it isn't valid. */
  onValueChange?: (e164: string | null) => void;
  /** Called with the validation message (or undefined) after the field is left. */
  onValidate?: (message: string | undefined) => void;
};

/**
 * Phone input (Nigeria), spec A5: a +234 block with a flag, joined to the
 * input. Takes 0801…, 801…, +234801… with spaces or dashes, shows
 * "0801 234 5678", checks it's a Nigerian mobile number and gives back
 * E.164 (+2348012345678). inputMode="tel", autoComplete="tel".
 */
export function CruisePhoneInput({
  label,
  hint,
  error,
  required,
  defaultValue = "",
  onValueChange,
  onValidate,
  name,
  id,
  disabled,
  className,
  onBlur,
  ...props
}: PhoneProps) {
  const outer = useCruiseField();
  const autoId = useId();
  const ref = useRef<HTMLInputElement>(null);
  const [text, setText] = useState(() => cruiseFormatNgPhone(defaultValue));
  const [touched, setTouched] = useState(false);
  const e164 = cruiseToE164(text);
  const invalidNumber = cruiseNgNational(text) !== "" && !e164 ? "Enter a Nigerian mobile number, like 0801 234 5678." : undefined;
  const message = error ?? (touched ? invalidNumber : undefined);
  // With a label (and no FormField around it), it renders its own field, so
  // its min/max or "not valid" message can show there.
  const own = !outer && label ? cruiseOwnField(id ?? autoId, { hint, error: message, required }) : null;
  const field = outer ?? own;


  function update(raw: string, caret: number) {
    // Keep the caret after the same number of digits it was after.
    const before = raw.slice(0, caret).replace(/\D/g, "").length;
    const next = cruiseFormatNgPhone(raw);
    setText(next);
    onValueChange?.(cruiseToE164(next));
    requestAnimationFrame(() => {
      const el = ref.current;
      if (!el || document.activeElement !== el) return;
      // A +234 typed at the start becomes the leading 0: aim for the end then.
      const target = raw.replace(/\D/g, "").length !== next.replace(/\D/g, "").length ? next.length : before;
      let pos = 0;
      if (target === next.length) pos = next.length;
      else for (let seen = 0; pos < next.length && seen < target; pos++) if (/\d/.test(next[pos])) seen++;
      el.setSelectionRange(pos, pos);
    });
  }

  const control = (
    <div
      className={cx("input-group", !field && className)}
      data-invalid={field?.invalid || message ? "" : undefined}
      data-disabled={disabled ? "" : undefined}
    >
      <span className="input-prefix" aria-hidden="true">
        <CruiseNgFlag />
        +234
      </span>
      <input
        ref={ref}
        {...props}
        {...cruiseFieldProps(field, { id, invalid: Boolean(message), required })}
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        disabled={disabled}
        value={text}
        placeholder={props.placeholder ?? "0801 234 5678"}
        onChange={(event) => update(event.target.value, event.target.selectionStart ?? event.target.value.length)}
        onBlur={(event) => {
          setTouched(true);
          onValidate?.(invalidNumber);
          onBlur?.(event);
        }}
        className="input-bare"
      />
      {name && <input type="hidden" name={name} value={e164 ?? ""} />}
    </div>
  );

  if (own) {
    return (
      <CruiseFormField label={label} hint={hint} error={message} required={required} id={own.id} className={className}>
        {control}
      </CruiseFormField>
    );
  }
  return control;
}
