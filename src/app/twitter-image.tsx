// Same card for X (Twitter). Next.js reads these exports statically, so
// they're listed here rather than re-exported with `export *`.
import { SHARE_IMAGE_ALT, SHARE_IMAGE_SIZE } from "@/lib/metadata";
import { shareImage } from "@/lib/share-image";

export const alt = SHARE_IMAGE_ALT;
export const size = SHARE_IMAGE_SIZE;
export const contentType = "image/png";

export default function Image() {
  return shareImage();
}
