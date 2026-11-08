"use client";

import type { ComponentProps } from "react";
import { cx } from "@/lib/cruise-utils";
import { CruiseFormField, cruiseFieldProps, useCruiseField } from "./form-field";

type SelectProps = ComponentProps<"select"> & {
  /** Visible label. Leave out inside a CruiseFormField (it brings the label). */
  label?: string;
  /** Helper text under the field. */
  hint?: string;
  /** Error message; turns the border and helper text --danger. */
  error?: string;
};

/**
 * A native <select> in the A5 input style (`.select` in theme.css: ink
 * chevron, focus outline, --danger error). Native on purpose: phones open
 * their own picker (the iOS wheel, Android's sheet), which is the easiest
 * control on a small screen. 17px text (--text-body) also stops iOS Safari
 * zooming in on focus, which it does below 16px.
 */
export function CruiseSelect({ label, hint, error, id, required, className, children, ...props }: SelectProps) {
  const field = useCruiseField();
  if (!field && label) {
    return (
      <CruiseFormField label={label} hint={hint} error={error} required={required} id={id} className={className}>
        <CruiseSelect {...props}>{children}</CruiseSelect>
      </CruiseFormField>
    );
  }
  return (
    <span className={cx("select-wrap", !field && className)}>
      <select {...props} {...cruiseFieldProps(field, { id, invalid: Boolean(error), required })} className="select">
        {children}
      </select>
    </span>
  );
}
