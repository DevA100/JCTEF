/**
 * Security headers for jctef.org: the single source of truth.
 *
 * They're applied in two places, because Netlify serves the site two ways:
 *   - next.config.ts headers(): pages and Server Actions, which Netlify
 *     serves through the Next.js server function. Netlify does not apply
 *     netlify.toml headers to function responses.
 *   - netlify.toml [[headers]]: files Netlify serves straight from its
 *     storage (images in /public, /_next/static, security.txt …).
 * netlify.toml can't import this file, so `npm run check:headers` (run
 * automatically before every build) fails if the two ever differ.
 *
 * Content Security Policy: only what the site actually loads.
 *   - script-src needs 'unsafe-inline': pages are prerendered (static) and
 *     Next.js streams page data in small inline <script> tags. Per-request
 *     nonces would make every page render on each visit instead of being
 *     served from the CDN.
 *   - img-src: our own images (next/image) and Cloudinary.
 *   - font-src: self-hosted by next/font.
 *   - Turnstile: script, iframe and checks on challenges.cloudflare.com.
 *   - frame-src YouTube: only for embeds in blog posts (the MDX sanitiser
 *     removes every other iframe).
 *   - connect-src/form-action 'self': forms post to our own Server Actions.
 *     Brevo, Google Sheets and the Turnstile check are called from the server.
 */
export const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://res.cloudinary.com",
  "font-src 'self'",
  "connect-src 'self' https://challenges.cloudflare.com",
  "frame-src https://challenges.cloudflare.com https://www.youtube-nocookie.com https://www.youtube.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "manifest-src 'self'",
].join("; ");

/**
 * Report-only for now: browsers log what the policy would block but block
 * nothing. To enforce, change this to "Content-Security-Policy" here AND in
 * netlify.toml (the build fails until both match).
 */
export const CSP_HEADER = "Content-Security-Policy-Report-Only";

/** @type {{ key: string; value: string }[]} */
export const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: CSP_HEADER, value: csp },
];
