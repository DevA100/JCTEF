"use client";

import Image from "next/image";
import { useState } from "react";
import { cloudinaryTransform } from "@/lib/cloudinary";

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts.at(-1)?.[0] ?? "") : "";
  return `${first}${last}`.toUpperCase();
}

/**
 * Square team photo. Cloudinary does the face-centred crop, so every photo
 * matches whatever its size or format. If the photo is missing or fails to
 * load, the person's initials are shown in the same square instead.
 */
export function TeamPhoto({ src, name, alt }: { src?: string; name: string; alt: string }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="relative aspect-square overflow-hidden bg-tint">
      {src && !failed ? (
        <Image
          src={cloudinaryTransform(src)}
          alt={alt}
          fill
          loading="lazy"
          sizes="(min-width: 1024px) 380px, (min-width: 640px) 45vw, 50vw"
          className="object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <div role="img" aria-label={alt} className="grid size-full place-items-center">
          <span aria-hidden="true" className="font-display text-[clamp(2.5rem,10vw,4.5rem)] font-extrabold text-success">
            {initials(name)}
          </span>
        </div>
      )}
    </div>
  );
}
