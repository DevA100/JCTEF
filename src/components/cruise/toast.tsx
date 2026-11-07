import { X } from "lucide-react";
import type { ReactNode } from "react";
import { cx } from "@/lib/cruise-utils";

export type CruiseToastTone = "success" | "danger" | "info";

const barClasses: Record<CruiseToastTone, string> = {
  success: "bg-success",
  danger: "bg-danger",
  info: "bg-info",
};

type ToastProps = {
  tone?: CruiseToastTone;
  title: ReactNode;
  children?: ReactNode;
  onDismiss?: () => void;
  className?: string;
};

export function CruiseToast({ tone = "info", title, children, onDismiss, className }: ToastProps) {
  return (
    <div
      role={tone === "danger" ? "alert" : "status"}
      className={cx(
        "toast brutal brutal-static toast-enter flex w-full overflow-hidden text-ink",
        className,
      )}
    >
      <div className={cx("w-2 shrink-0", barClasses[tone])} aria-hidden="true" />
      <div className="flex flex-1 flex-col gap-1 px-4 py-3">
        <p className="font-display text-body leading-tight font-extrabold">{title}</p>
        {children && <p className="text-small">{children}</p>}
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className="flex size-11 shrink-0 items-center justify-center text-ink focus-visible:outline-3 focus-visible:outline-info"
        >
          <X className="size-5" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
