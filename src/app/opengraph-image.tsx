import { SHARE_IMAGE_ALT, SHARE_IMAGE_SIZE } from "@/lib/metadata";
import { shareImage } from "@/lib/share-image";

/** The default share image for every page (generated at build time). */
export const alt = SHARE_IMAGE_ALT;
export const size = SHARE_IMAGE_SIZE;
export const contentType = "image/png";

export default function Image() {
  return shareImage();
}
