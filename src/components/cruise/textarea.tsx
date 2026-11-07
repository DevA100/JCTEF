"use client";

import { useId, useLayoutEffect, useRef, useState, type ComponentProps } from "react";
import { cx } from "@/lib/cruise-utils";
import { CruiseFormField, cruiseFieldProps, useCruiseField } from "./form-field";

type TextareaProps = Omit<ComponentProps<"textarea">, "children"> & {
  /** Visible label. Leave out inside a CruiseFormField (it brings the label). */
  label?: string;
  hint?: string;
  error?: string;
  /** Grows with its content instead of scrolling (still resizable). */
  autoGrow?: boolean;
  /** Shows "120 / 500" under the box; needs maxLength, or shows the count alone. */
  showCount?: boolean;
};

/**
 * Textarea, spec A5: styled like the inputs, min-height 120px, resizes
 * vertically, with optional auto-grow and a character counter.
 */
export function CruiseTextarea({
  label,
  hint,
  error,
  required,
  autoGrow = false,
  showCount = false,
  maxLength,
  className,
  onChange,
  value,
  defaultValue,
  id,
  ...props
}: TextareaProps) {
  const field = useCruiseField();
  const ref = useRef<HTMLTextAreaElement>(null);
  const countId = useId();
  const [count, setCount] = useState(String(value ?? defaultValue ?? "").length);
  const shown = value !== undefined ? String(value).length : count;

  useLayoutEffect(() => {
    const el = ref.current;
    if (!autoGrow || !el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [autoGrow, value, count]);

  // Standalone with a label: wrap itself in a FormField.
  if (!field && label) {
    return (
      <CruiseFormField label={label} hint={hint} error={error} required={required} id={id} className={className}>
        <CruiseTextarea {...{ autoGrow, showCount, maxLength, onChange, value, defaultValue, ...props }} />
      </CruiseFormField>
    );
  }

  const counter = showCount || maxLength !== undefined;
  const wired = cruiseFieldProps(field, { id, invalid: Boolean(error), required, describedBy: counter ? countId : undefined });

  return (
    <>
      <textarea
        ref={ref}
        {...props}
        {...wired}
        value={value}
        defaultValue={defaultValue}
        maxLength={maxLength}
        onChange={(event) => {
          setCount(event.target.value.length);
          onChange?.(event);
        }}
        className={cx("textarea", autoGrow && "overflow-hidden", !field && className)}
      />
      {counter && (
        <p id={countId} className="field-count" data-over={maxLength !== undefined && shown > maxLength ? "" : undefined}>
          {maxLength !== undefined ? `${shown.toLocaleString("en-NG")} / ${maxLength.toLocaleString("en-NG")}` : shown}
          <span className="visually-hidden"> characters</span>
        </p>
      )}
    </>
  );
}
