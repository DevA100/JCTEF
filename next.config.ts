import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    qualities: [75],
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
    ];
  },
};

export default nextConfig;
