"use client";

import { Check } from "lucide-react";
import { cx } from "@/lib/cruise-utils";

export type CruiseStep = { label: string; hint?: string };

/**
 * Steps (stepper), spec A5: `.steps` in theme.css. Numbered boxes joined by
 * an ink line, horizontal from 640px and vertical below. Steps before
 * `current` are done; pass `onStepClick` to let people go back to them.
 */
export function CruiseSteps({
  steps,
  current,
  label = "Progress",
  onStepClick,
  className,
}: {
  steps: CruiseStep[];
  /** Index of the current step (0-based). */
  current: number;
  /** Accessible name for the list, e.g. "Checkout progress". */
  label?: string;
  onStepClick?: (index: number) => void;
  className?: string;
}) {
  return (
    <ol aria-label={label} className={cx("steps", className)}>
      {steps.map((step, index) => {
        const state = index < current ? "done" : index === current ? "current" : "upcoming";
        const box = state === "done" ? <Check aria-hidden="true" strokeWidth={3} /> : index + 1;
        const boxClass = cx("step-box", state === "current" && "on-primary");
        return (
          <li key={step.label} className="step" data-state={state} aria-current={state === "current" ? "step" : undefined}>
            {state === "done" && onStepClick ? (
              <button
                type="button"
                className={boxClass}
                onClick={() => onStepClick(index)}
                aria-label={`Back to step ${index + 1}: ${step.label}`}
              >
                {box}
              </button>
            ) : (
              <span className={boxClass} aria-hidden="true">
                {box}
              </span>
            )}
            <span className="step-text">
              <span className="step-label">
                {step.label}
                <span className="visually-hidden">
                  {state === "done" ? " (done)" : state === "current" ? " (current step)" : ""}
                </span>
              </span>
              {step.hint && <span className="step-hint">{step.hint}</span>}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
