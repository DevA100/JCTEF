/**
 * PostHog (EU Cloud) through our own domain: the browser only ever talks to
 * jctef.org, so ad blockers that block posthog.com don't drop our counts and
 * the Content Security Policy needs nothing new (connect-src 'self').
 *
 * The path is deliberately meaningless: PostHog's docs warn that blockers
 * catch obvious names like /analytics, /tracking or /posthog.
 *
 * Used twice, kept in sync by scripts/check-security-headers.mjs (prebuild):
 * - next.config.ts rewrites (local development, and any host where Next.js
 *   handles the request);
 * - netlify.toml [[redirects]] with status 200 (Netlify, where PostHog warns
 *   that Next.js rewrites can break: they're proxied by Netlify's edge
 *   before Next.js sees them). Generate them with
 *   `node scripts/check-security-headers.mjs --print`.
 *
 * See https://posthog.com/docs/advanced/proxy/nextjs and
 * https://posthog.com/docs/advanced/proxy/netlify
 */
export const ANALYTICS_PATH = "/k7q2";

export const POSTHOG_INGEST_HOST = "eu.i.posthog.com";
export const POSTHOG_ASSETS_HOST = "eu-assets.i.posthog.com";
/** Links into the PostHog app (toolbar etc.). */
export const POSTHOG_UI_HOST = "https://eu.posthog.com";

/** In order: the asset paths must come before the catch-all. */
export const analyticsProxyRules = [
  { from: `${ANALYTICS_PATH}/static`, host: POSTHOG_ASSETS_HOST, to: "static" },
  { from: `${ANALYTICS_PATH}/array`, host: POSTHOG_ASSETS_HOST, to: "array" },
  { from: ANALYTICS_PATH, host: POSTHOG_INGEST_HOST, to: "" },
];

/** For next.config.ts `rewrites()`. */
export const analyticsRewrites = analyticsProxyRules.map(({ from, host, to }) => ({
  source: `${from}/:path*`,
  destination: `https://${host}/${to ? `${to}/` : ""}:path*`,
}));

/** The netlify.toml block, exactly as it must appear. */
export const netlifyRedirectsBlock = () =>
  analyticsProxyRules
    .map(({ from, host, to }) =>
      [
        "[[redirects]]",
        `  from = "${from}/*"`,
        `  to = "https://${host}/${to ? `${to}/` : ""}:splat"`,
        `  host = "${host}"`,
        "  status = 200",
        "  force = true",
      ].join("\n"),
    )
    .join("\n\n");
