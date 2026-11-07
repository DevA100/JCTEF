import type { CSSProperties, ReactNode } from "react";
import { cx } from "@/lib/cruise-utils";

type CardProps = {
  /** Shown in a full-width --primary header strip. Omit for no strip. */
  title?: ReactNode;
  children: ReactNode;
  /** Makes the whole card a link that moves on hover/active. */
  href?: string;
  className?: string;
  style?: CSSProperties;
};

export function CruiseCard({ title, children, href, className, style }: CardProps) {
  const classes = cx(
    "brutal flex flex-col overflow-hidden text-ink",
    !href && "brutal-static",
    href && "no-underline",
    className,
  );

  const content = (
    <>
      {title && (
        <div className="on-primary border-b-(length:--border-w) border-ink px-6 py-3">
          <h3 className="text-h3">{title}</h3>
        </div>
      )}
      <div className="p-6">{children}</div>
    </>
  );

  if (href) {
    return (
      <a href={href} className={classes} style={style}>
        {content}
      </a>
    );
  }
  return (
    <div className={classes} style={style}>
      {content}
    </div>
  );
}
