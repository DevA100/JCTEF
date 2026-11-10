import Image from "next/image";
import type { PostCover as Cover } from "@/lib/blog";
import { cx } from "@/lib/cruise-utils";

/**
 * A blog post's cover. With no cover it shows a branded placeholder (navy,
 * JCTEF green, the title) in the same 16:9 box, so there is never a broken
 * image or an empty gap.
 *
 * - "card": always 16:9, cropped to fill; decorative (the card has the title).
 * - "page": the full cover at its own shape when its size is known.
 */
export function PostCover({
  cover,
  title,
  variant,
  sizes,
  preload,
  eager,
  className,
}: {
  cover?: Cover;
  title: string;
  variant: "card" | "page";
  sizes: string;
  /** Preload in <head>: for the one image that's always the LCP (a post's cover). */
  preload?: boolean;
  /** Load straight away instead of lazily: for cards in the first row, any of
   * which can be the LCP depending on screen width. "high" also raises the
   * fetch priority (the very first card). */
  eager?: boolean | "high";
  className?: string;
}) {
  // Cards repeat the title in text right below, so their image is decorative.
  const alt = variant === "card" ? "" : (cover?.alt ?? "");
  // next/image: preload can't be combined with loading or fetchPriority.
  const loadingProps = preload
    ? { preload: true }
    : eager
      ? { loading: "eager" as const, ...(eager === "high" && { fetchPriority: "high" as const }) }
      : {};

  if (cover && variant === "page" && cover.width && cover.height) {
    return (
      <Image
        src={cover.src}
        alt={alt}
        width={cover.width}
        height={cover.height}
        sizes={sizes}
        {...loadingProps}
        className={cx("h-auto w-full", className)}
      />
    );
  }

  return (
    <div className={cx("relative aspect-video w-full overflow-hidden", className)}>
      {cover ? (
        <Image src={cover.src} alt={alt} fill sizes={sizes} {...loadingProps} className="object-cover" />
      ) : (
        <Placeholder title={title} large={variant === "page"} />
      )}
    </div>
  );
}

function Placeholder({ title, large }: { title: string; large: boolean }) {
  return (
    <div aria-hidden="true" className="on-deep absolute inset-0 flex flex-col justify-between bg-paper p-5 text-ink md:p-8">
      {/* Circuit-style accents, echoing the logo mark. */}
      <svg viewBox="0 0 200 120" className="absolute -right-6 -bottom-6 h-3/4 text-primary opacity-35" fill="none">
        <g stroke="currentColor" strokeWidth="6" strokeLinecap="round">
          <path d="M40 120V70h50l30-30h80" />
          <path d="M100 120V95h60" />
          <path d="M150 20h50" />
        </g>
        <g fill="currentColor">
          <circle cx="120" cy="40" r="9" />
          <circle cx="160" cy="95" r="9" />
          <circle cx="150" cy="20" r="9" />
        </g>
      </svg>
      <p className="relative font-display text-[1rem] font-extrabold tracking-wide">
        JC<span className="text-primary">TEF</span>
      </p>
      <p
        className={cx(
          "relative line-clamp-3 max-w-[22ch] font-display leading-tight font-extrabold text-balance",
          large ? "text-[clamp(1.5rem,4vw,2.5rem)]" : "text-[1.25rem]",
        )}
      >
        {title}
      </p>
      <span className="relative block h-1.5 w-16 bg-primary" />
    </div>
  );
}
