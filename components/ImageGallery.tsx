"use client";

import { useState } from "react";

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
        <div className="mt-3 flex flex-wrap gap-2 md:mt-4 md:gap-3">
          {safe.map((src, i) => (
            <button
              key={src}
              onClick={() => setActive(i)}
              className={`h-16 w-20 overflow-hidden rounded-lg ring-2 transition sm:h-20 sm:w-24 ${
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
