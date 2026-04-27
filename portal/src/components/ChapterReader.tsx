import { useEffect, useRef, useState } from "react";
import { marked } from "marked";
import chapterSource from "@/../content/chapter-01.md?raw";
import { Eyebrow } from "./Eyebrow";
import { createScrollTracker } from "@/lib/analytics";

const SPLIT_MARKER = "<!-- continue -->";
const fullHtml = marked.parse(chapterSource, { async: false }) as string;
const splitIndex = fullHtml.indexOf(SPLIT_MARKER);
const preludeHtml =
  splitIndex >= 0 ? fullHtml.slice(0, splitIndex) : fullHtml;
const restHtml =
  splitIndex >= 0 ? fullHtml.slice(splitIndex + SPLIT_MARKER.length) : "";
const hasRest = restHtml.trim().length > 0;

export function ChapterReader() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const restRef = useRef<HTMLElement>(null);
  const [expanded, setExpanded] = useState(false);

  // Re-attach scroll-depth markers whenever the visible content changes.
  // Markers are appended to the section so they cover both prelude and rest.
  useEffect(() => {
    if (!sectionRef.current) return;
    const tracker = createScrollTracker();
    const section = sectionRef.current;
    const milestones = [25, 50, 75, 100] as const;
    const created: HTMLElement[] = [];
    for (const pct of milestones) {
      const m = document.createElement("div");
      m.style.cssText = "position:relative;height:1px;pointer-events:none;";
      m.setAttribute("aria-hidden", "true");
      m.style.top = `${pct}%`;
      section.appendChild(m);
      tracker.observe(m, pct);
      created.push(m);
    }
    return () => {
      tracker.flush();
      tracker.disconnect();
      for (const m of created) m.remove();
    };
  }, [expanded]);

  function expand() {
    setExpanded(true);
    // Wait for fade-in animation to start before nudging the scroll position
    // so the reader sees the new content arrive instead of jumping past it.
    requestAnimationFrame(() => {
      restRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  return (
    <section id="chapter" ref={sectionRef} className="bg-base px-6 py-24 sm:py-32">
      <div className="max-w-reading mx-auto mb-16 text-center">
        <Eyebrow>Chapter One</Eyebrow>
        <h2 className="mt-6 font-heading text-4xl sm:text-5xl font-light text-fg leading-[1.15]">
          A free first chapter.
        </h2>
        <p className="mt-4 text-muted text-lg font-body max-w-md mx-auto">
          Read it here. No login, no popup. If it lands, the rest of the book is one click below.
        </p>
      </div>

      <article
        className="reader relative"
        dangerouslySetInnerHTML={{ __html: preludeHtml }}
      />

      {hasRest && !expanded && (
        <div className="continue-gate">
          <span className="continue-rule" aria-hidden="true" />
          <p className="continue-eyebrow">The Chapter Continues</p>
          <p className="continue-headline">
            Read the rest of <em>Chapter&nbsp;1</em>.
          </p>
          <p className="continue-sub">About eight more minutes, on this page.</p>
          <button type="button" onClick={expand} className="btn-primary mt-2">
            Continue
          </button>
        </div>
      )}

      {hasRest && expanded && (
        <article
          ref={restRef}
          className="reader chapter-rest fade-up"
          dangerouslySetInnerHTML={{ __html: restHtml }}
        />
      )}

      {(!hasRest || expanded) && (
        <div className="chapter-end max-w-reading mx-auto">
          <span className="ornament" aria-hidden="true" />
          <p className="text-muted font-body text-base">
            End of Chapter 1.{" "}
            <a href="#get-the-book" className="text-accent underline-offset-4 hover:underline">
              Get the rest of the book →
            </a>
          </p>
        </div>
      )}
    </section>
  );
}
