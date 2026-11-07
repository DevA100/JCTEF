"use client";

import { Avatar } from "@base-ui/react/avatar";
import { User } from "lucide-react";
import type { ComponentType, CSSProperties, HTMLAttributeReferrerPolicy, ReactNode } from "react";
import { cx } from "@/lib/cruise-utils";

export type CruiseAvatarSize = "sm" | "md" | "lg" | "xl";
export type CruiseAvatarTone = "primary" | "muted" | "tint" | "auto";
export type CruiseAvatarStatus = "online" | "away" | "busy" | "offline";

const SIZES: Record<CruiseAvatarSize, number> = { sm: 32, md: 40, lg: 56, xl: 80 };

/** "Idris Bankole" -> "IB", "Idris" -> "I". */
export function cruiseInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  const letters = parts.length === 1 ? [parts[0]] : [parts[0], parts[parts.length - 1]];
  return letters.map((part) => Array.from(part)[0]).join("").toUpperCase();
}

// Token backgrounds for tone="auto", each with its own text token (CSS:
// .avatar[data-tone]). The same name always lands on the same one.
const AUTO_TONES = ["primary", "info", "success", "tint", "muted"] as const;
function autoTone(seed: string): (typeof AUTO_TONES)[number] {
  let hash = 0;
  for (const ch of seed) hash = (hash * 31 + ch.codePointAt(0)!) >>> 0;
  return AUTO_TONES[hash % AUTO_TONES.length];
}

/** Props the image component receives (a plain <img>, or e.g. next/image). */
export type CruiseAvatarImageProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  loading?: "lazy" | "eager";
  decoding?: "async";
  referrerPolicy?: HTMLAttributeReferrerPolicy;
  crossOrigin?: "anonymous" | "use-credentials";
};

type BaseProps = {
  /** The person's name: the initials and the fallback's accessible name. */
  name?: string;
  /** Overrides the initials from `name` (max 2 characters). */
  initials?: string;
  /** Fallback when there's no image, name or initials (default: Lucide user). */
  icon?: ReactNode;
  /** 32 / 40 / 56 / 80px, or any number of pixels. */
  size?: CruiseAvatarSize | number;
  /** Circle (default) or a square that follows var(--radius), for brands and teams. */
  shape?: "circle" | "square";
  status?: CruiseAvatarStatus;
  /** Background behind the initials; "auto" picks one from the name. */
  tone?: CruiseAvatarTone;
  /** Renders the image with your component, e.g. next/image (add the host to
   * images.remotePatterns in next.config). Gets src, alt, width, height. */
  imageComponent?: ComponentType<CruiseAvatarImageProps>;
  referrerPolicy?: HTMLAttributeReferrerPolicy;
  crossOrigin?: "anonymous" | "use-credentials";
  className?: string;
};

/** `alt` is required with `src` (use alt="" next to a visible name). */
export type CruiseAvatarProps = BaseProps & ({ src: string; alt: string } | { src?: undefined; alt?: string });

/**
 * Avatar, spec A5. Image (any URL: S3, Cloudinary, Firebase, Gravatar) ->
 * initials (from `initials` or `name`) -> icon. The fallback shows while the
 * image loads, and stays if it fails (broken URL, 403 from a private
 * bucket): never a blank flash or a broken-image icon. Circle by default
 * (avatars and radios are the only circles); square follows var(--radius).
 */
export function CruiseAvatar({
  src,
  alt,
  name,
  initials,
  icon,
  size = "md",
  shape = "circle",
  status,
  tone = "muted",
  imageComponent: ImageComponent,
  referrerPolicy,
  crossOrigin,
  className,
}: CruiseAvatarProps) {
  const px = typeof size === "number" ? size : SIZES[size];
  const letters = (initials ?? (name ? cruiseInitials(name) : "")).slice(0, 2).toUpperCase();
  const label = name || alt || "";
  // alt="" with no name: decorative (a visible name sits next to it).
  const decorative = label === "";
  const style: CSSProperties | undefined =
    typeof size === "number" ? { width: px, height: px, fontSize: Math.round(px * 0.38) } : undefined;
  const imageProps: CruiseAvatarImageProps | null = src
    ? {
        src,
        alt: alt ?? "",
        width: px,
        height: px,
        className: "avatar-image",
        loading: "lazy",
        decoding: "async",
        referrerPolicy,
        crossOrigin,
      }
    : null;

  return (
    <Avatar.Root
      className={cx("avatar", typeof size === "string" && size !== "md" && `avatar-${size}`, className)}
      style={style}
      data-shape={shape === "square" ? "square" : undefined}
      data-tone={tone === "auto" ? autoTone(name || initials || alt || "") : tone === "muted" ? undefined : tone}
    >
      <Avatar.Fallback
        className="avatar-fallback"
        role={decorative ? undefined : "img"}
        aria-label={decorative ? undefined : label}
        aria-hidden={decorative ? true : undefined}
      >
        {letters || icon || <User aria-hidden="true" strokeWidth={2.5} />}
      </Avatar.Fallback>
      {imageProps && (
        // keepMounted: the image loads in place (lazy) over the fallback and
        // stays hidden (data-loading / data-error) until it has loaded.
        <Avatar.Image
          keepMounted
          {...imageProps}
          render={ImageComponent ? <ImageComponent {...imageProps} /> : undefined}
        />
      )}
      {status && (
        <>
          <span className="avatar-status" data-status={status} aria-hidden="true" />
          {!decorative && <span className="visually-hidden">, {status}</span>}
        </>
      )}
    </Avatar.Root>
  );
}

export type CruiseAvatarPerson = {
  name: string;
  src?: string;
  initials?: string;
};

/**
 * Avatar group: overlapping avatars (images and initials mixed) with a
 * --surface ring; past `max`, a "+3" counter.
 */
export function CruiseAvatarGroup({
  people,
  max,
  size = "md",
  shape = "circle",
  tone = "auto",
  label = "People",
  className,
}: {
  people: CruiseAvatarPerson[];
  /** How many avatars to show before the "+n" counter (all by default). */
  max?: number;
  size?: CruiseAvatarSize | number;
  shape?: "circle" | "square";
  tone?: CruiseAvatarTone;
  /** Accessible name for the group, e.g. "Team". */
  label?: string;
  className?: string;
}) {
  const shown = max === undefined ? people : people.slice(0, max);
  const more = people.length - shown.length;
  const px = typeof size === "number" ? size : SIZES[size];
  return (
    <div role="group" aria-label={label} className={cx("avatar-group", className)}>
      {shown.map((person) =>
        person.src ? (
          <CruiseAvatar key={person.name} name={person.name} src={person.src} alt={person.name} initials={person.initials} size={size} shape={shape} tone={tone} />
        ) : (
          <CruiseAvatar key={person.name} name={person.name} initials={person.initials} size={size} shape={shape} tone={tone} />
        ),
      )}
      {more > 0 && (
        <span
          role="img"
          aria-label={`and ${more} more`}
          data-shape={shape === "square" ? "square" : undefined}
          className={cx("avatar avatar-more", typeof size === "string" && size !== "md" && `avatar-${size}`)}
          style={typeof size === "number" ? { width: px, height: px, fontSize: Math.round(px * 0.34) } : undefined}
        >
          +{more}
        </span>
      )}
    </div>
  );
}
