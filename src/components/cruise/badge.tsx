import type { ReactNode } from "react";
import { cx } from "@/lib/cruise-utils";

export type CruiseBadgeTone =
  | "primary"
  | "surface"
  | "muted"
  | "deep"
  | "danger"
  | "success"
  | "info";

// Text colours follow the B1 "Text on it" column.
const toneClasses: Record<CruiseBadgeTone, string> = {
  primary: "on-primary",
  surface: "bg-surface text-ink",
  muted: "bg-muted text-ink",
  deep: "bg-deep text-on-deep",
  danger: "bg-danger text-on-danger",
  success: "bg-success text-on-success",
  info: "bg-info text-on-info",
};

type BadgeProps = {
  children: ReactNode;
  tone?: CruiseBadgeTone;
  /** Rotates -3deg for a sticker look. Max 1–2 per screen. */
  sticker?: boolean;
  className?: string;
};

export function CruiseBadge({ children, tone = "surface", sticker, className }: BadgeProps) {
  return (
    <span
      className={cx(
        "rounded-brutal inline-block border-2 border-ink px-2.5 py-0.5 text-label uppercase",
        toneClasses[tone],
        sticker && "-rotate-3",
        className,
      )}
    >
      {children}
    </span>
  );
}
