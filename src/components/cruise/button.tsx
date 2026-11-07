import type { ComponentProps, ReactNode } from "react";
import { cx } from "@/lib/cruise-utils";

export type CruiseButtonVariant =
  | "primary"
  | "secondary"
  | "danger"
  | "success"
  /** Primary action placed on a --primary background (yellow hero, featured card). */
  | "inverted";

const variantClasses: Record<CruiseButtonVariant, string> = {
  // .on-primary sets bg --primary and locks the light values inside it.
  primary: "on-primary",
  secondary: "bg-surface text-ink",
  danger: "bg-danger text-on-danger",
  success: "bg-success text-on-success",
  // Uses --on-primary, not --ink, so it still works in NEPA mode.
  inverted: "bg-on-primary text-primary",
};

export type CruiseButtonSize = "default" | "lg";

// min-h-11: 44px minimum touch target at every size.
const sizeClasses: Record<CruiseButtonSize, string> = {
  default: "min-h-11 px-6 py-3 text-body",
  /** Big action buttons, e.g. a game HUD. */
  lg: "min-h-16 px-6 py-4 text-h3",
};

const disabledClasses =
  "disabled:bg-muted disabled:text-ink disabled:shadow-none disabled:transform-none disabled:cursor-not-allowed";

export function cruiseButtonClasses({
  variant = "primary",
  size = "default",
  disabled = false,
  className,
}: {
  variant?: CruiseButtonVariant;
  size?: CruiseButtonSize;
  disabled?: boolean;
  className?: string;
} = {}) {
  return cx(
    "brutal inline-flex items-center justify-center gap-2",
    sizeClasses[size],
    "font-display leading-tight font-extrabold uppercase tracking-[0.03em]",
    "[&_svg]:size-5 [&_svg]:shrink-0",
    // A disabled primary drops .on-primary so it takes the plain muted style.
    !(disabled && variant === "primary") && variantClasses[variant],
    disabledClasses,
    className,
  );
}

export type CruiseButtonProps = ComponentProps<"button"> & {
  variant?: CruiseButtonVariant;
  size?: CruiseButtonSize;
};

export function CruiseButton({
  variant = "primary",
  size,
  type = "button",
  disabled,
  className,
  ...props
}: CruiseButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={cruiseButtonClasses({ variant, size, disabled, className })}
      {...props}
    />
  );
}

/** A row of buttons that stacks full-width below 640px. */
export function CruiseButtonGroup({
  children,
  align = "start",
  className,
}: {
  children: ReactNode;
  align?: "start" | "end";
  className?: string;
}) {
  return (
    <div
      className={cx(
        "flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:flex-wrap",
        "*:w-full sm:*:w-auto",
        align === "end" && "sm:justify-end",
        className,
      )}
    >
      {children}
    </div>
  );
}
