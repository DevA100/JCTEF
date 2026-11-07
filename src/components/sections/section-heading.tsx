import type { ReactNode } from "react";
import { cx } from "@/lib/cruise-utils";

/** Eyebrow + h2 (+ intro) used at the top of most sections. */
export function SectionHeading({
  id,
  eyebrow,
  title,
  children,
  align = "start",
  as: Heading = "h2",
  className,
}: {
  /** id for the heading, for aria-labelledby on the section. */
  id?: string;
  eyebrow?: string;
  title: ReactNode;
  children?: ReactNode;
  align?: "start" | "center";
  as?: "h1" | "h2";
  className?: string;
}) {
  return (
    <div className={cx("grid gap-4", align === "center" && "justify-items-center text-center", className)}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <Heading id={id} className={cx(Heading === "h1" ? "text-h1" : "text-h2", "max-w-[22ch] text-balance")}>
        {title}
      </Heading>
      {children && <div className="measure grid gap-4 text-body text-ink-muted">{children}</div>}
    </div>
  );
}
