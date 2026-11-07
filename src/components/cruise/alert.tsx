"use client";

import { CircleAlert, CircleCheck, Info, TriangleAlert, X } from "lucide-react";
import type { ReactNode } from "react";
import { cx } from "@/lib/cruise-utils";

export type CruiseAlertTone = "info" | "success" | "warning" | "danger";

const ICONS = { info: Info, success: CircleCheck, warning: TriangleAlert, danger: CircleAlert } as const;

/**
 * Alert / banner, spec A5: ink border, --surface, a square icon chip in the
 * tone colour (warning uses --primary), title + text, optional action and
 * dismiss. role="alert" only for danger (it interrupts); role="status"
 * otherwise. `banner` makes it full width for the top of a page.
 */
export function CruiseAlert({
  tone = "info",
  title,
  children,
  action,
  onDismiss,
  banner = false,
  className,
}: {
  tone?: CruiseAlertTone;
  title: ReactNode;
  children?: ReactNode;
  /** A button or link, e.g. "Try again". */
  action?: ReactNode;
  /** Shows the dismiss "X" (aria-label="Dismiss"). */
  onDismiss?: () => void;
  /** Full width, no corners or shadow: for the top of a page. */
  banner?: boolean;
  className?: string;
}) {
  const Icon = ICONS[tone];
  return (
    <div
      role={tone === "danger" ? "alert" : "status"}
      data-tone={tone}
      className={cx("alert", banner && "alert-banner", className)}
    >
      <span className="alert-icon" aria-hidden="true">
        <Icon strokeWidth={2.5} />
      </span>
      <div className="alert-body">
        <p className="alert-title">{title}</p>
        {children && <div className="alert-text">{children}</div>}
        {action && <div className="alert-actions">{action}</div>}
      </div>
      {onDismiss && (
        <button type="button" className="alert-dismiss" aria-label="Dismiss" onClick={onDismiss}>
          <X aria-hidden="true" strokeWidth={3} />
        </button>
      )}
    </div>
  );
}
