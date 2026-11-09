import type { Metadata } from "next";
import { site } from "./content";

/**
 * Shared link-preview metadata. Next.js merges metadata shallowly: a page
 * that sets `openGraph` replaces the root layout's one entirely (including
 * its image), so every page builds its metadata here to keep the defaults.
 */

/** Absolute base for every URL in previews. Production: https://jctef.org. */
export const siteUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL || site.url);

export const SHARE_IMAGE_ALT = "JCTEF – From potential to productivity";
export const SHARE_IMAGE_SIZE = { width: 1200, height: 630 } as const;

/** The default share images (app/opengraph-image.tsx and app/twitter-image.tsx). */
const defaultOgImage = { url: "/opengraph-image", ...SHARE_IMAGE_SIZE, alt: SHARE_IMAGE_ALT, type: "image/png" };
const defaultTwitterImage = { ...defaultOgImage, url: "/twitter-image" };

export const openGraphDefaults = {
  type: "website",
  siteName: site.name,
  locale: "en_NG",
} as const;

export const twitterDefaults = {
  card: "summary_large_image",
  site: "@Official_jctef",
} as const;

type Image = { url: string; width?: number; height?: number; alt?: string; type?: string };

export function pageMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
  images,
  openGraph,
}: {
  title: string;
  description: string;
  /** e.g. "/about"; becomes the canonical URL https://jctef.org/about. */
  path: string;
  /** Skip the "| JCTEF" suffix (for titles that already say JCTEF). */
  absoluteTitle?: boolean;
  /** Leave out to use the default share image. */
  images?: Image[];
  openGraph?: Record<string, unknown>;
}): Metadata {
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      ...openGraphDefaults,
      url: path,
      title,
      description,
      images: images ?? [defaultOgImage],
      ...openGraph,
    },
    twitter: {
      ...twitterDefaults,
      title,
      description,
      images: images ?? [defaultTwitterImage],
    },
  };
}
