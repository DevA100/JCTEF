"use client";

/**
 * Last-resort page, used only if the site's main layout itself fails. It
 * replaces the whole page, so it can't use the site's stylesheet: the brand
 * colours are inline. Never shows technical details.
 */
export default function GlobalError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  const reference = error instanceof Error ? error.digest : undefined;
  return (
    <html lang="en-GB">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#fffaf0",
          color: "#0a1f5c",
          fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
          padding: 24,
        }}
      >
        <title>Something went wrong | JCTEF</title>
        <main style={{ maxWidth: 560 }}>
          <p style={{ fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", fontSize: 13, color: "#4a5578" }}>
            JCTEF
          </p>
          <h1 style={{ fontSize: 36, lineHeight: 1.1, margin: "8px 0 16px" }}>We hit a pothole</h1>
          <p style={{ lineHeight: 1.6, color: "#4a5578" }}>
            The site didn&apos;t load properly. Please try again. If it keeps happening, email us at{" "}
            <a href="mailto:info@jctef.org" style={{ color: "#0a1f5c", fontWeight: 700 }}>
              info@jctef.org
            </a>
            .
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 24 }}>
            <button
              type="button"
              onClick={() => retry()}
              style={{
                cursor: "pointer",
                background: "#2ead45",
                color: "#0a1f5c",
                border: "2px solid #0a1f5c",
                boxShadow: "4px 4px 0 0 #0a1f5c",
                borderRadius: 8,
                padding: "12px 22px",
                font: "800 15px/1 system-ui, sans-serif",
                textTransform: "uppercase",
              }}
            >
              Try again
            </button>
            {/* A full reload, since the app itself is in trouble. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/"
              style={{
                background: "#ffffff",
                color: "#0a1f5c",
                border: "2px solid #0a1f5c",
                boxShadow: "4px 4px 0 0 #0a1f5c",
                borderRadius: 8,
                padding: "12px 22px",
                font: "800 15px/1 system-ui, sans-serif",
                textTransform: "uppercase",
                textDecoration: "none",
              }}
            >
              Homepage
            </a>
          </div>
          {reference && <p style={{ fontSize: 13, color: "#4a5578", marginTop: 24 }}>Reference: {reference}</p>}
        </main>
      </body>
    </html>
  );
}
