import { useEffect, useRef, useState } from "react";
import { env } from "@/lib/env";

export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const v = videoRef.current;
    if (!v) return;
    const tryPlay = () => v.play().catch(() => {});
    if (v.readyState >= 2) tryPlay();
    else v.addEventListener("loadeddata", tryPlay, { once: true });
  }, [reduced]);

  const poster = env.VITE_HERO_POSTER_PATH;
  const src = env.VITE_HERO_VIDEO_PATH;

  return (
    <div className="absolute inset-0 overflow-hidden bg-ink">
      {!reduced && (
        <video
          ref={videoRef}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
            loaded ? "opacity-70" : "opacity-0"
          }`}
          src={src}
          poster={poster}
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          onLoadedData={() => setLoaded(true)}
        />
      )}
      {(reduced || !loaded) && (
        <img
          src={poster}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-70"
        />
      )}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(26,26,26,0.45) 0%, rgba(26,26,26,0.65) 70%, rgba(26,26,26,0.85) 100%)",
        }}
        aria-hidden="true"
      />
    </div>
  );
}
