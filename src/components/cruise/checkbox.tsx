"use client";

import { useEffect, useRef, type ComponentProps, type ReactNode } from "react";
import { cx } from "@/lib/cruise-utils";

type CheckboxProps = Omit<ComponentProps<"input">, "type"> & {
  /** Visible label; clicking it toggles the box (spec A5 Checkbox). */
  label: ReactNode;
  /** "Some of a group" state: an ink dash. */
  indeterminate?: boolean;
};

/** A native checkbox, restyled by the `.checkbox` class in theme.css. */
export function CruiseCheckbox({ label, indeterminate = false, className, ...props }: CheckboxProps) {
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => {
    // Indeterminate has no HTML attribute; it's a DOM property.
    if (input.current) input.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <label className={cx("check", className)}>
      <input ref={input} type="checkbox" className="checkbox" {...props} />
      <span>{label}</span>
    </label>
  );
}
