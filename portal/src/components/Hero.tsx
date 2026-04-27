import { HeroVideo } from "./HeroVideo";
import { Eyebrow } from "./Eyebrow";
import { env } from "@/lib/env";

export function Hero() {
  return (
    <section
      id="hero"
      className="relative isolate min-h-[92vh] flex items-center justify-center overflow-hidden text-light"
    >
      <HeroVideo />

      <div className="relative z-10 max-w-narrative px-6 text-center fade-up">
        <Eyebrow className="!text-accent-tan">A Book by Tristian Walker</Eyebrow>

        <h1 className="mt-6 font-heading font-light text-light text-[clamp(3rem,7vw,5.5rem)] leading-[1.05] tracking-tight">
          The Quiet <em className="not-italic font-normal italic text-accent">Line</em>.
        </h1>

        <p
          className="mt-8 font-heading font-light text-[clamp(1.05rem,1.5vw,1.35rem)] leading-relaxed max-w-[40ch] mx-auto"
          style={{ color: "rgba(248,245,239,0.92)" }}
        >
          {env.VITE_HERO_PITCH}
        </p>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="#chapter" className="btn-primary">
            Read Chapter 1
          </a>
          <a
            href="#get-the-book"
            className="btn-outline"
            style={{ borderColor: "var(--text-light)", color: "var(--text-light)" }}
          >
            Get the full book
          </a>
        </div>

        <p className="mt-10 text-sm font-body tracking-wide uppercase" style={{ color: "rgba(248,245,239,0.6)" }}>
          By Tristian Walker
        </p>
      </div>
    </section>
  );
}
