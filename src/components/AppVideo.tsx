"use client";

import { useEffect, useRef, useState } from "react";

type AppVideoProps = {
  src: string;
  poster: string;
  label: string;
  className?: string;
  controls?: boolean;
  eager?: boolean;
  onPlay?: () => void;
  describedBy?: string;
};

/** Loads near the viewport, plays while visible, and preserves an explicit pause. */
export function AppVideo({ src, poster, label, className, controls = true, eager = false, onPlay, describedBy }: AppVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const userPaused = useRef(false);
  const automaticPause = useRef(false);
  const visible = useRef(false);
  const reducedMotion = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    let disposed = false;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotion.current = preference.matches;
    userPaused.current = false;
    automaticPause.current = false;
    const load = () => {
      if (video.getAttribute("src") !== src) {
        video.src = src;
        video.load();
      }
    };
    const sync = () => {
      if (visible.current && !document.hidden && !userPaused.current && !reducedMotion.current) {
        load();
        video.play().catch(() => { if (!disposed && visible.current && !document.hidden) setBlocked(true); });
      } else if (!video.paused) {
        automaticPause.current = true;
        video.pause();
      }
    };
    const onPreference = () => { reducedMotion.current = preference.matches; sync(); };
    const loader = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { load(); loader.disconnect(); }
    }, { rootMargin: "180px" });
    const observer = new IntersectionObserver(([entry]) => {
      visible.current = entry.isIntersecting && entry.intersectionRatio >= 0.2;
      sync();
    }, { threshold: [0, 0.2] });
    loader.observe(video);
    observer.observe(video);
    if (eager) load();
    document.addEventListener("visibilitychange", sync);
    preference.addEventListener("change", onPreference);
    return () => {
      disposed = true;
      observer.disconnect();
      loader.disconnect();
      document.removeEventListener("visibilitychange", sync);
      preference.removeEventListener("change", onPreference);
      automaticPause.current = true;
      video.pause();
    };
  }, [src, eager]);

  const toggle = () => {
    const video = ref.current;
    if (!video) return;
    if (video.paused) {
      userPaused.current = false;
      if (video.getAttribute("src") !== src) { video.src = src; video.load(); }
      video.play().catch(() => setBlocked(true));
    } else {
      userPaused.current = true;
      video.pause();
    }
  };

  return <>
    <video ref={ref} poster={poster} className={className} controls={controls || blocked}
      muted playsInline loop autoPlay={false} preload={eager ? "metadata" : "none"}
      aria-label={label} aria-describedby={describedBy}
      onPlay={() => { userPaused.current = false; setPlaying(true); setBlocked(false); onPlay?.(); }}
      onPause={() => {
        setPlaying(false);
        if (automaticPause.current) automaticPause.current = false;
        else userPaused.current = true;
      }}>
      <a href={src}>Download the walkthrough</a>
    </video>
    {!controls && !blocked && <button type="button" onClick={toggle}
      aria-label={`${playing ? "Pause" : "Play"} ${label}`}
      className="absolute bottom-3 right-3 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/70 text-white shadow-lg backdrop-blur-sm transition hover:bg-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
      {playing ? <svg width="12" height="14" viewBox="0 0 12 14" fill="currentColor" aria-hidden="true"><path d="M0 0h4v14H0zM8 0h4v14H8z" /></svg> : <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true"><path d="M2 0l12 7-12 7z" /></svg>}
    </button>}
  </>;
}
