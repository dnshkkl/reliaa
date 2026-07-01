"use client";

import { useRef, useState, useEffect } from "react";

export default function AchievementsCarousel({ images }: { images: string[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  function update() {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    return () => el.removeEventListener("scroll", update);
  }, [images]);

  function scroll(dir: "prev" | "next") {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector("div") as HTMLElement | null;
    const step = card ? card.offsetWidth + 16 : 280;
    el.scrollBy({ left: dir === "next" ? step : -step, behavior: "smooth" });
  }

  return (
    <div className="relative">
      {/* Arrow — prev */}
      <button
        onClick={() => scroll("prev")}
        disabled={!canPrev}
        aria-label="Previous"
        className={`absolute -left-4 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-sand/60 transition-all hover:bg-cream disabled:opacity-0 sm:-left-5`}
      >
        <svg className="h-4 w-4 text-ink" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Track */}
      <div
        ref={trackRef}
        className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-none pb-1"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {images.map((url, i) => (
          <div
            key={url}
            className="flex-shrink-0 overflow-hidden rounded-2xl shadow-sm ring-1 ring-sand/60"
            style={{ scrollSnapAlign: "start", width: "clamp(220px, 28vw, 320px)" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt={`Achievement ${i + 1}`}
              className="aspect-[4/3] w-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
        ))}
      </div>

      {/* Arrow — next */}
      <button
        onClick={() => scroll("next")}
        disabled={!canNext}
        aria-label="Next"
        className={`absolute -right-4 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-sand/60 transition-all hover:bg-cream disabled:opacity-0 sm:-right-5`}
      >
        <svg className="h-4 w-4 text-ink" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
