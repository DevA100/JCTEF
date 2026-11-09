import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { SHARE_IMAGE_SIZE } from "./metadata";

/**
 * The branded 1200 × 630 share card used by app/opengraph-image.tsx,
 * app/twitter-image.tsx and blog posts without a cover. Flat colours and
 * one small logo keep the PNG light (WhatsApp skips heavy preview images).
 */
const NAVY = "#0a1f5c";
const GREEN = "#2ead45";
const WHITE = "#ffffff";
const MUTED = "#c3cbe6";

/**
 * The logo and heading font, read from disk once and cached (with
 * cacheComponents, file reads at request time must be cached). The logo has
 * a white background, so it sits on a white card with a hard green shadow.
 * The font is Baloo 2 ExtraBold, the site's heading font (SIL OFL).
 */
async function assets() {
  "use cache";
  const [logo, font] = await Promise.all([
    readFile(path.join(process.cwd(), "public/images/jctef-logo.png")),
    readFile(path.join(process.cwd(), "assets/fonts/baloo-2-latin-800-normal.woff")),
  ]);
  return { logo: `data:image/png;base64,${logo.toString("base64")}`, font: font.toString("base64") };
}

export async function shareImage({ title, eyebrow }: { title?: string; eyebrow?: string } = {}) {
  const long = (title?.length ?? 0) > 60;
  const { logo, font } = await assets();

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "56px 72px 64px",
        background: NAVY,
        color: WHITE,
        borderBottom: `20px solid ${GREEN}`,
        fontFamily: "Baloo 2",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div
          style={{
            display: "flex",
            padding: "16px 22px",
            background: WHITE,
            border: `4px solid ${WHITE}`,
            borderRadius: 14,
            boxShadow: `10px 10px 0 0 ${GREEN}`,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse needs a plain img */}
          <img src={logo} alt="" width={305} height={100} />
        </div>
        <div style={{ display: "flex", fontSize: 30, color: MUTED, marginTop: 8 }}>jctef.org</div>
      </div>

      {title ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {eyebrow && <div style={{ display: "flex", fontSize: 30, color: GREEN, letterSpacing: 1 }}>{eyebrow}</div>}
          <div style={{ display: "flex", fontSize: long ? 58 : 72, lineHeight: 1.08, maxWidth: 1040 }}>{title}</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 92, lineHeight: 1.05 }}>From potential</div>
          <div style={{ display: "flex", fontSize: 92, lineHeight: 1.05, alignItems: "flex-end" }}>
            to&nbsp;
            {/* The green marker under "productivity", as on the homepage hero. */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "stretch" }}>
              <span>productivity</span>
              <div style={{ display: "flex", height: 14, background: GREEN, marginTop: -6 }} />
            </div>
          </div>
        </div>
      )}

      <div style={{ display: "flex", fontSize: 34, color: MUTED }}>Transform, Equip, Empower</div>
    </div>,
    {
      ...SHARE_IMAGE_SIZE,
      fonts: [{ name: "Baloo 2", data: Buffer.from(font, "base64"), weight: 800, style: "normal" }],
    },
  );
}
