import { registration } from "@/lib/content";
import { cx } from "@/lib/cruise-utils";

/** "Registered nonprofit · RC 8937457": a quiet trust signal near Donate buttons. */
export function TrustLine({ className, full = false }: { className?: string; full?: boolean }) {
  return <p className={cx("text-small text-ink-muted", className)}>{full ? registration.full : registration.trust}</p>;
}
