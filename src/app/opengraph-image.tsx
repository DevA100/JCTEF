import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

/**
 * The default share image (1200 × 630) for every page, generated at build
 * time. Pages with their own image (blog posts with a cover) override it.
 */
export const alt = "JCTEF: From potential to productivity. jctef.org";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const NAVY = "#0a1f5c";
const GREEN = "#2ead45";
const CREAM = "#fffaf0";

// Read once. The logo has a white background, so it sits on a cream plate.
const logo = readFile(path.join(process.cwd(), "public/images/jctef-logo.png")).then(
  (data) => `data:image/png;base64,${data.toString("base64")}`,
);
// Baloo 2 ExtraBold, the site's display font (SIL Open Font License).
const display = readFile(path.join(process.cwd(), "assets/fonts/baloo-2-latin-800-normal.woff"));

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "64px 80px 72px",
        background: NAVY,
        color: CREAM,
        borderBottom: `24px solid ${GREEN}`,
        fontFamily: "Baloo 2",
      }}
    >
      <div style={{ display: "flex" }}>
        <div
          style={{
            display: "flex",
            padding: "20px 28px",
            background: "#ffffff",
            borderRadius: 16,
            boxShadow: `8px 8px 0 0 ${GREEN}`,
          }}
        >
          <img src={await logo} alt="" width={366} height={120} />
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", fontSize: 92, lineHeight: 1.02 }}>From potential</div>
        <div style={{ display: "flex", fontSize: 92, lineHeight: 1.02 }}>
          to&nbsp;<span style={{ color: GREEN }}>productivity</span>
        </div>
      </div>
      <div style={{ display: "flex", fontSize: 34, color: "#c3cbe6" }}>jctef.org</div>
    </div>,
    {
      ...size,
      fonts: [{ name: "Baloo 2", data: await display, weight: 800, style: "normal" }],
    },
  );
}
