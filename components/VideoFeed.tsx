"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { VideoFeedItem } from "@/lib/types";

// ─── Icons ────────────────────────────────────────────────────────────────────

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="white" className="h-10 w-10">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="white" className="h-10 w-10">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  );
}

function FullscreenIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" />
    </svg>
  );
}

function MuteIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M11 5L6 9H2v6h4l5 4V5z" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  );
}

function UnmuteIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" />
    </svg>
  );
}

// ─── Single video card ────────────────────────────────────────────────────────

interface VideoCardProps {
  item: VideoFeedItem;
  shouldPlay: boolean;
  globalMuted: boolean;
  onMuteToggle: () => void;
}

function VideoCard({ item, shouldPlay, globalMuted, onMuteToggle }: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [showIcon, setShowIcon] = useState(false);
  const iconTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-play / pause driven by intersection observer
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (shouldPlay) {
      video.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    } else {
      video.pause();
      setPlaying(false);
    }
  }, [shouldPlay]);

  // Keep muted state in sync with global toggle
  useEffect(() => {
    const video = videoRef.current;
    if (video) video.muted = globalMuted;
  }, [globalMuted]);

  const flashIcon = useCallback((wasPlaying: boolean) => {
    setShowIcon(true);
    setPlaying(!wasPlaying);
    if (iconTimerRef.current) clearTimeout(iconTimerRef.current);
    iconTimerRef.current = setTimeout(() => setShowIcon(false), 700);
  }, []);

  function togglePlay() {
    const video = videoRef.current;
    if (!video) return;
    const wasPlaying = !video.paused;
    if (wasPlaying) {
      video.pause();
    } else {
      video.play().catch(() => {});
    }
    flashIcon(wasPlaying);
  }

  async function enterFullscreen() {
    const video = videoRef.current;
    if (!video) return;
    if (video.requestFullscreen) {
      await video.requestFullscreen();
    } else if ((video as HTMLVideoElement & { webkitEnterFullscreen?: () => void }).webkitEnterFullscreen) {
      (video as HTMLVideoElement & { webkitEnterFullscreen?: () => void }).webkitEnterFullscreen?.();
    }
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-black">
      {/* Video */}
      <video
        ref={videoRef}
        src={item.videoUrl}
        loop
        muted={globalMuted}
        playsInline
        preload="metadata"
        className="absolute inset-0 h-full w-full object-cover cursor-pointer"
        onClick={togglePlay}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />

      {/* Play / pause flash overlay */}
      <div
        className={`pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
          showIcon ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="rounded-full bg-black/40 p-4 backdrop-blur-sm">
          {playing ? <PauseIcon /> : <PlayIcon />}
        </div>
      </div>

      {/* Top-right controls */}
      <div className="absolute right-4 top-4 z-10 flex flex-col gap-2">
        <button
          aria-label={globalMuted ? "Unmute" : "Mute"}
          onClick={(e) => { e.stopPropagation(); onMuteToggle(); }}
          className="rounded-full bg-black/50 p-2.5 backdrop-blur-sm transition-transform active:scale-90"
        >
          {globalMuted ? <MuteIcon /> : <UnmuteIcon />}
        </button>
        <button
          aria-label="Full screen"
          onClick={(e) => { e.stopPropagation(); enterFullscreen(); }}
          className="rounded-full bg-black/50 p-2.5 backdrop-blur-sm transition-transform active:scale-90"
        >
          <FullscreenIcon />
        </button>
      </div>

      {/* Bottom info overlay */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 50%, transparent 100%)" }}
      >
        <div className="flex items-end gap-4 px-5 pb-8 pt-20">
          {/* Thumbnail */}
          {item.thumbnail && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={item.thumbnail}
              alt={item.productName}
              className="h-16 w-16 flex-shrink-0 rounded-xl object-cover ring-2 ring-white/30"
            />
          )}

          {/* Name + specs */}
          <div className="min-w-0 flex-1">
            <p className="text-xs uppercase tracking-[0.2em] text-white/60">Reliaa</p>
            <h2 className="mt-0.5 font-serif text-xl font-medium text-white leading-tight">
              {item.productName}
            </h2>
            {item.specs.length > 0 && (
              <ul className="mt-2 space-y-0.5">
                {item.specs.map((spec, i) => (
                  <li key={i} className="flex items-center gap-1.5 text-sm text-white/75">
                    <span className="h-1 w-1 flex-shrink-0 rounded-full bg-white/50" />
                    {spec}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Feed container ───────────────────────────────────────────────────────────

export default function VideoFeed({ items }: { items: VideoFeedItem[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [muted, setMuted] = useState(true); // start muted for autoplay policy
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const sorted = [...items].sort((a, b) => a.sequence - b.sequence);

  useEffect(() => {
    if (sorted.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = itemRefs.current.findIndex((el) => el === entry.target);
            if (idx !== -1) setActiveIndex(idx);
          }
        }
      },
      { threshold: 0.6 }
    );

    const els = itemRefs.current.filter(Boolean) as HTMLDivElement[];
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sorted.length]);

  if (sorted.length === 0) {
    return (
      <div className="flex h-dvh items-center justify-center bg-black text-white/50">
        No videos yet.
      </div>
    );
  }

  return (
    <div
      className="h-dvh overflow-y-scroll"
      style={{ scrollSnapType: "y mandatory", WebkitOverflowScrolling: "touch" } as React.CSSProperties}
    >
      {sorted.map((item, idx) => (
        <div
          key={item.id}
          ref={(el) => { itemRefs.current[idx] = el; }}
          className="h-dvh w-full flex-shrink-0"
          style={{ scrollSnapAlign: "start" }}
        >
          <VideoCard
            item={item}
            shouldPlay={activeIndex === idx}
            globalMuted={muted}
            onMuteToggle={() => setMuted((m) => !m)}
          />
        </div>
      ))}
    </div>
  );
}
