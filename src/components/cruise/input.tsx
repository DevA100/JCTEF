"use client";

import type { ComponentProps } from "react";
import { cx } from "@/lib/cruise-utils";
import { CruiseFormField, cruiseFieldProps, useCruiseField } from "./form-field";

type InputProps = ComponentProps<"input"> & {
  /** Visible label. Leave out inside a CruiseFormField (it brings the label). */
  label?: string;
  /** Helper text under the field. */
  hint?: string;
  /** Error message; turns the border and helper text --danger. */
  error?: string;
};

/** Text input, spec A5 (`.input` in theme.css). With `label` it brings its
 * own FormField; inside a CruiseFormField it takes the field's wiring. */
export function CruiseInput({ label, hint, error, id, required, className, ...props }: InputProps) {
  const field = useCruiseField();
  if (!field && label) {
    return (
      <CruiseFormField label={label} hint={hint} error={error} required={required} id={id} className={className}>
        <CruiseInput {...props} />
      </CruiseFormField>
    );
  }
  return (
    <input
      {...props}
      {...cruiseFieldProps(field, { id, invalid: Boolean(error), required })}
      className={cx("input", !field && className)}
    />
  );
}
