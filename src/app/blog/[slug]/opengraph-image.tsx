import { getPost, getPostSlugs } from "@/lib/blog";
import { SHARE_IMAGE_SIZE } from "@/lib/metadata";
import { shareImage } from "@/lib/share-image";

/**
 * Share image for a blog post WITHOUT a cover: the post title on the brand
 * card. Posts with a cover return no image here, so the cover set in
 * generateMetadata (page.tsx) is used instead.
 */
export const contentType = "image/png";

/** The post's title and whether it has a cover, cached (file reads must be). */
async function postInfo(slug: string) {
  "use cache";
  const post = await getPost(slug);
  return post ? { title: post.title, hasCover: Boolean(post.cover) } : null;
}

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateImageMetadata({ params }: { params: { slug: string } | Promise<{ slug: string }> }) {
  const post = await postInfo((await params).slug);
  if (!post || post.hasCover) return [];
  return [{ id: "card", size: SHARE_IMAGE_SIZE, alt: post.title, contentType }];
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const post = await postInfo((await params).slug);
  return shareImage({ title: post?.title ?? "JCTEF blog", eyebrow: "JCTEF blog" });
}
