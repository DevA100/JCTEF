"use client";

import { useState } from "react";
import { CruisePhoneInput } from "@/components/cruise/phone-input";
import { PHONE_ERROR, PREFERRED_COUNTRIES } from "@/lib/phone";

const hasDigits = (text: string) => /\d/.test(text);

/**
 * The forms' phone field: Cruise's phone input in international mode,
 * Nigeria (+234) picked first, every country available, our audience's
 * countries at the top of the list.
 *
 * The input's own hidden field is empty while a number isn't valid, which
 * would make a wrong number look like no number. So this sends its own
 * field instead: the E.164 number when it's valid, otherwise what was
 * typed, which the schema (src/lib/phone.ts) then refuses with PHONE_ERROR.
 *
 * Give it a `key` that changes after each result to reset it, like the
 * other fields; `defaultValue` restores a kept value.
 */
export function PhoneField({
  name,
  label,
  hint,
  defaultValue = "",
  error,
}: {
  name: string;
  label: string;
  hint?: string;
  defaultValue?: string;
  /** From the form's own check or the server; shown instead of ours. */
  error?: string;
}) {
  const [e164, setE164] = useState<string | null>(null);
  const [typed, setTyped] = useState(defaultValue);
  /** Our wording for the input's "not a valid number", shown once the field is left. */
  const [leftInvalid, setLeftInvalid] = useState(false);

  const value = e164 ?? (hasDigits(typed) ? typed.trim() : "");

  return (
    <>
      <CruisePhoneInput
        label={label}
        hint={hint}
        international
        defaultCountry="NG"
        preferredCountries={PREFERRED_COUNTRIES}
        defaultValue={defaultValue}
        error={error ?? (leftInvalid ? PHONE_ERROR : undefined)}
        onValueChange={(next) => {
          setE164(next);
          if (next) setLeftInvalid(false);
        }}
        onInput={(event) => {
          const text = event.currentTarget.value;
          setTyped(text);
          if (!hasDigits(text)) setLeftInvalid(false);
        }}
        onValidate={(message) => setLeftInvalid(Boolean(message))}
      />
      <input type="hidden" name={name} value={value} />
    </>
  );
}
