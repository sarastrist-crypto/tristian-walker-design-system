import { useEffect, useRef, useState } from "react";
import { Eyebrow } from "./Eyebrow";
import { env } from "@/lib/env";

export function TrailerSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ended, setEnded] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onEnded = () => setEnded(true);
    const onPlay = () => setEnded(false);
    v.addEventListener("ended", onEnded);
    v.addEventListener("play", onPlay);
    return () => {
      v.removeEventListener("ended", onEnded);
      v.removeEventListener("play", onPlay);
    };
  }, []);

  function replay() {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    setEnded(false);
    void v.play();
  }

  return (
    <section
      id="trailer"
      className="bg-base px-6 py-24 sm:py-32 border-t border-black/5"
    >
      <div className="max-w-narrative mx-auto text-center mb-12">
        <Eyebrow>The Trailer &middot; Two Minutes</Eyebrow>
        <h2 className="mt-6 font-heading text-4xl sm:text-5xl font-light text-fg leading-[1.15]">
          A glimpse, <em className="text-accent italic">before you read</em>.
        </h2>
        <p className="mt-4 text-muted font-body max-w-md mx-auto">
          Two minutes. Sound on.
        </p>
      </div>

      <div
        className="relative mx-auto overflow-hidden bg-ink shadow-book"
        style={{
          aspectRatio: "9 / 16",
          maxWidth: "380px",
          borderRadius: "28px",
        }}
      >
        <video
          ref={videoRef}
          src={env.VITE_TEASER_VIDEO_PATH}
          poster={env.VITE_TEASER_POSTER_PATH}
          controls
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div
          className={`absolute inset-0 flex flex-col items-center justify-center text-center px-6 transition-opacity duration-700 ${
            ended
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
          style={{
            background:
              "linear-gradient(180deg, rgba(26,26,26,0.65) 0%, rgba(26,26,26,0.92) 55%, rgba(26,26,26,0.96) 100%)",
          }}
          aria-hidden={!ended}
        >
          <span
            className="font-body text-[0.7rem] uppercase mb-4"
            style={{
              color: "var(--accent-primary)",
              letterSpacing: "0.4em",
              paddingLeft: "0.4em",
            }}
          >
            Continue
          </span>
          <p
            className="font-heading font-light leading-tight text-2xl sm:text-3xl mb-8 max-w-[18ch]"
            style={{ color: "var(--text-light)" }}
          >
            Read Chapter&nbsp;1 below.{" "}
            <em
              style={{ color: "var(--accent-primary)", fontStyle: "italic" }}
            >
              Or take the whole book.
            </em>
          </p>
          <div className="flex flex-col gap-3 w-full max-w-[280px]">
            <a href="#chapter" className="btn-primary">
              Read Chapter 1
            </a>
            <a
              href="#get-the-book"
              className="btn-outline"
              style={{
                borderColor: "var(--text-light)",
                color: "var(--text-light)",
              }}
            >
              Get the full book
            </a>
            <button
              type="button"
              onClick={replay}
              className="font-body text-xs uppercase mt-2 hover:text-accent transition-colors"
              style={{
                color: "rgba(248,245,239,0.55)",
                letterSpacing: "0.2em",
              }}
            >
              Replay
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
