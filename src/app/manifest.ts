import type { MetadataRoute } from "next";
import { site } from "@/lib/content";

/** Served at /manifest.webmanifest. Colours are the brand navy and cream. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: site.shortName,
    description: site.description,
    start_url: "/",
    display: "browser",
    theme_color: "#0a1f5c", // --deep / --ink (navy)
    background_color: "#fffaf0", // --paper (cream)
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
