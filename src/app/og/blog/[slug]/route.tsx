import { ImageResponse } from "next/og";
import { getPost, getPostSlugs } from "@/lib/blog";

/**
 * Social share image (1200 × 630) for a blog post that has no cover yet:
 * the JCTEF colours and the post title. Posts with a cover use the cover
 * instead (see generateMetadata in app/blog/[slug]/page.tsx).
 */
export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

const NAVY = "#0a1f5c";
const GREEN = "#2ead45";
const CREAM = "#fffaf0";

export async function GET(_request: Request, { params }: RouteContext<"/og/blog/[slug]">) {
  const post = await getPost((await params).slug);
  if (!post) return new Response("Not found", { status: 404 });

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 80px",
        background: NAVY,
        color: CREAM,
        borderBottom: `24px solid ${GREEN}`,
      }}
    >
      <div style={{ display: "flex", fontSize: 44, fontWeight: 800, letterSpacing: 1 }}>
        JC<span style={{ color: GREEN }}>TEF</span>
      </div>
      <div style={{ display: "flex", fontSize: post.title.length > 70 ? 56 : 68, fontWeight: 800, lineHeight: 1.12, maxWidth: 1000 }}>
        {post.title}
      </div>
      <div style={{ display: "flex", fontSize: 28, color: "#c3cbe6" }}>jctef.org/blog</div>
    </div>,
    { width: 1200, height: 630 },
  );
}
