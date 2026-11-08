import { readdirSync } from "node:fs";
import createMDX from "@next/mdx";
import type { NextConfig } from "next";

// Blog posts migrated from WordPress lived at jctef.org/<slug>/.
const blogSlugs = readdirSync("content/blog")
  .filter((file) => file.endsWith(".mdx"))
  .map((file) => file.slice(0, -".mdx".length));

const nextConfig: NextConfig = {
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
    // Plugin names as strings so Turbopack can load them. Exposes the YAML
    // frontmatter of each post as `export const frontmatter`.
    remarkPlugins: ["remark-frontmatter", ["remark-mdx-frontmatter", { name: "frontmatter" }]],
  },
});

export default withMDX(nextConfig);
