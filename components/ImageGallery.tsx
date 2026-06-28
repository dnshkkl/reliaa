"use client";

import { useState } from "react";

/** Main image + thumbnail strip, used on product and project detail pages. */
export default function ImageGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [active, setActive] = useState(0);
  const safe = images.length ? images : [];

  if (safe.length === 0) {
    return <div className="aspect-[4/3] w-full rounded-2xl bg-sand" />;
  }

  return (
    <div>
      <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl bg-sand">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={safe[active]}
          alt={alt}
          className="h-full w-full object-cover"
        />
      </div>

      {safe.length > 1 && (
        <div className="mt-4 flex flex-wrap gap-3">
          {safe.map((src, i) => (
            <button
              key={src}
              onClick={() => setActive(i)}
              className={`h-20 w-24 overflow-hidden rounded-lg ring-2 transition ${
                i === active ? "ring-clay" : "ring-transparent hover:ring-sand"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`${alt} ${i + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
