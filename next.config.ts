import { readdirSync } from "node:fs";
import path from "node:path";
import createMDX from "@next/mdx";
import type { NextConfig } from "next";
import { analyticsRewrites } from "./analytics-proxy.mjs";
import { securityHeaders } from "./security-headers.mjs";

// Blog posts migrated from WordPress lived at jctef.org/<slug>/.
const blogSlugs = readdirSync("content/blog")
  .filter((file) => file.endsWith(".mdx"))
  .map((file) => file.slice(0, -".mdx".length));

// One source of truth for the security headers (also mirrored in netlify.toml,
// checked before every build). See security-headers.mjs for why both exist.
// The CSP is left out in development: React's dev tools need eval and hot
// reload needs websockets.
const headersForAllRoutes = securityHeaders.filter(
  (h) => process.env.NODE_ENV === "production" || !h.key.startsWith("Content-Security-Policy"),
);

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Inlined into the browser bundle: the Turnstile site key is public by design.
  // The secret key (TURNSTILE_SECRET_KEY) is only read on the server.
  env: { TURNSTILE_SITE_KEY: process.env.TURNSTILE_SITE_KEY ?? "" },
  experimental: {
    serverActions: {
      // Our forms are a few KB of text.
      bodySizeLimit: "100kb",
      // Same-origin is always allowed (that covers deploy previews). These
      // add the live domains explicitly, so a form still works if a proxy
      // sends a different Host. src/lib/form-guard.ts also rejects requests
      // with no Origin header.
      allowedOrigins: ["jctef.org", "www.jctef.org"],
    },
  },
  // The volunteer emails are read from emails/brevo/ at request time.
  outputFileTracingIncludes: { "/**": ["./emails/brevo/*.html"] },
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    qualities: [75],
    // Hero and outreach photos (dreezy); team photos on /about (fccjt5sr).
    remotePatterns: [new URL("https://res.cloudinary.com/dreezy/**"), new URL("https://res.cloudinary.com/fccjt5sr/**")],
  },
  turbopack: {
    // There is a stray package-lock.json in the home folder; pin the root here.
    root: import.meta.dirname,
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  // PostHog's API paths end in a slash (/e/, /flags/): without this, every
  // analytics request would first get a 308 redirect. Pages keep a single
  // URL through their canonical tags (src/lib/metadata.ts).
  skipTrailingSlashRedirect: true,
  // PostHog through our own domain (see analytics-proxy.mjs). On Netlify the
  // same paths are proxied by netlify.toml before Next.js sees them.
  async rewrites() {
    return analyticsRewrites;
  },
  async headers() {
    return [{ source: "/:path*", headers: headersForAllRoutes }];
  },
  // Old WordPress URLs, so existing links and search results keep working.
  async redirects() {
    return [
      { source: "/founder", destination: "/about#founder", permanent: true },
      { source: "/what-we-do", destination: "/programmes", permanent: true },
      { source: "/programs-initiatives", destination: "/programmes", permanent: true },
      { source: "/jctef-institute", destination: "/institute", permanent: true },
      { source: "/partnership", destination: "/get-involved#partner", permanent: true },
      { source: "/partner-collaboration", destination: "/get-involved#partner", permanent: true },
      { source: "/contact-us", destination: "/contact", permanent: true },
      { source: "/event/:slug*", destination: "/#events", permanent: false },
      { source: "/events", destination: "/#events", permanent: false },
      ...blogSlugs.map((slug) => ({ source: `/${slug}`, destination: `/blog/${slug}`, permanent: true })),
      { source: "/category/:path*", destination: "/blog", permanent: true },
      { source: "/author/:path*", destination: "/blog", permanent: true },
    ];
  },
};

const withMDX = createMDX({
  options: {
    // Plugin names as strings so Turbopack can load them. The sanitiser runs
    // first (it removes any code in posts); then the YAML frontmatter is
    // exposed as `export const frontmatter`.
    remarkPlugins: [
      "remark-frontmatter",
      // Absolute path: Turbopack resolves plugin strings like package names.
      path.join(import.meta.dirname, "src/lib/mdx/remark-sanitize.mjs"),
      ["remark-mdx-frontmatter", { name: "frontmatter" }],
    ],
  },
});

export default withMDX(nextConfig);
