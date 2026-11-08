/** Square, face-centred crop at 480 × 480, in the best format the browser takes. */
export const TEAM_PHOTO_TRANSFORM = "c_thumb,g_face,w_480,h_480,f_auto,q_auto";

/**
 * Inserts transformations into any Cloudinary delivery URL, right after
 * "/upload/", whatever the cloud name:
 *
 *   .../image/upload/v123/photo.png
 *   -> .../image/upload/c_thumb,g_face,w_480,h_480,f_auto,q_auto/v123/photo.png
 *
 * URLs that are not Cloudinary uploads are returned unchanged.
 */
export function cloudinaryTransform(url: string, transform: string = TEAM_PHOTO_TRANSFORM): string {
  const marker = "/upload/";
  const at = url.indexOf(marker);
  if (!url.startsWith("https://res.cloudinary.com/") || at === -1) return url;
  const end = at + marker.length;
  return `${url.slice(0, end)}${transform}/${url.slice(end)}`;
}
