"use client";

import { CircleAlert } from "lucide-react";
import { createContext, useContext, useId, type ReactNode } from "react";
import { cx } from "@/lib/cruise-utils";

export type CruiseFieldState = {
  /** The control's id (the label's htmlFor). */
  id: string;
  /** The label's id, for controls labelled with aria-labelledby. */
  labelId: string;
  /** The label text, when it's a string (e.g. for a drawer title). */
  labelText?: string;
  /** Hint and error ids, for aria-describedby. */
  describedBy?: string;
  invalid: boolean;
  required: boolean;
};

const FieldContext = createContext<CruiseFieldState | null>(null);

/** The surrounding FormField, if any. Controls use it to wire their id,
 * aria-describedby, aria-invalid and required. */
export function useCruiseField(): CruiseFieldState | null {
  return useContext(FieldContext);
}

/**
 * Form field, spec A5: a label (with an optional "Required" marker), the
 * control, a hint in --ink-muted and an error in --danger with an icon.
 * Wires aria-describedby and aria-invalid on the control automatically.
 * Works with CruiseInput, CruiseTextarea, CruiseSelect, CruiseCombobox,
 * CruiseNairaInput and CruisePhoneInput.
 */
export function CruiseFormField({
  label,
  required = false,
  hint,
  error,
  id,
  className,
  children,
}: {
  label: ReactNode;
  /** Shows "Required" next to the label and marks the control required. */
  required?: boolean;
  /** Helper text under the control. */
  hint?: ReactNode;
  /** Error message: --danger border on the control, the message below. */
  error?: ReactNode;
  /** The control's id (generated when left out). */
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  const autoId = useId();
  const controlId = id ?? autoId;
  const hintId = `${controlId}-hint`;
  const errorId = `${controlId}-error`;
  const describedBy = [hint ? hintId : "", error ? errorId : ""].filter(Boolean).join(" ") || undefined;
  const state: CruiseFieldState = {
    id: controlId,
    labelId: `${controlId}-label`,
    labelText: typeof label === "string" ? label : undefined,
    describedBy,
    invalid: Boolean(error),
    required,
  };

  return (
    <FieldContext.Provider value={state}>
      <div className={cx("field", className)}>
        <label id={state.labelId} htmlFor={controlId} className="field-label">
          {label}
          {required && <span className="field-required">Required</span>}
        </label>
        {children}
        {hint && (
          <p id={hintId} className="field-help">
            {hint}
          </p>
        )}
        {error && (
          <p id={errorId} className="field-error">
            <CircleAlert aria-hidden="true" strokeWidth={2.5} />
            <span>{error}</span>
          </p>
        )}
      </div>
    </FieldContext.Provider>
  );
}

/** The wiring a control gets from a CruiseFormField with this id, hint and
 * error: for controls that render their own field (they can't read the
 * context of a FormField they render themselves). */
export function cruiseOwnField(
  id: string,
  { hint, error, required }: { hint?: ReactNode; error?: ReactNode; required?: boolean },
): CruiseFieldState {
  return {
    id,
    labelId: `${id}-label`,
    describedBy: [hint ? `${id}-hint` : "", error ? `${id}-error` : ""].filter(Boolean).join(" ") || undefined,
    invalid: Boolean(error),
    required: Boolean(required),
  };
}

/** Props a control spreads on its input: from the FormField when inside
 * one, otherwise its own. */
export function cruiseFieldProps(
  field: CruiseFieldState | null,
  own: { id?: string; describedBy?: string; invalid?: boolean; required?: boolean },
) {
  return {
    id: field?.id ?? own.id,
    "aria-describedby": [field?.describedBy, own.describedBy].filter(Boolean).join(" ") || undefined,
    "aria-invalid": field?.invalid || own.invalid ? true : undefined,
    required: field?.required || own.required || undefined,
  } as const;
}
