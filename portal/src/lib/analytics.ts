import { env } from "./env";

const SESSION_KEY = "tql_session_id";

function uuid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function getSessionId(): string {
  if (typeof window === "undefined") return "ssr";
  let id = window.sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = uuid();
    window.sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

type Milestone = 25 | 50 | 75 | 100;

export interface ScrollTracker {
  observe: (el: Element, milestone: Milestone) => void;
  flush: () => void;
  disconnect: () => void;
}

interface TrackerOptions {
  source?: string;
  endpoint?: string;
  onError?: (e: unknown) => void;
}

export function createScrollTracker(opts: TrackerOptions = {}): ScrollTracker {
  const seen = new Set<Milestone>();
  let lastDepth = 0;
  const source = opts.source ?? env.VITE_TARGET_AUDIENCE;
  const endpoint = opts.endpoint ?? `${env.VITE_API_BASE}/track-read`;

  const observer =
    typeof IntersectionObserver !== "undefined"
      ? new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              if (!entry.isIntersecting) continue;
              const m = Number(
                (entry.target as HTMLElement).dataset.milestone,
              ) as Milestone;
              if (!m || seen.has(m)) continue;
              seen.add(m);
              lastDepth = Math.max(lastDepth, m);
            }
          },
          { threshold: 0.6 },
        )
      : null;

  function send(finished: boolean): void {
    if (lastDepth === 0) return;
    const payload = JSON.stringify({
      session_id: getSessionId(),
      scroll_depth_percent: lastDepth,
      finished_chapter: finished,
      source,
    });
    try {
      if (typeof navigator !== "undefined" && "sendBeacon" in navigator) {
        navigator.sendBeacon(
          endpoint,
          new Blob([payload], { type: "application/json" }),
        );
      } else {
        void fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
          keepalive: true,
        }).catch(opts.onError ?? (() => {}));
      }
    } catch (e) {
      opts.onError?.(e);
    }
  }

  if (typeof window !== "undefined") {
    window.addEventListener("pagehide", () => send(seen.has(100)), { once: true });
  }

  return {
    observe(el, milestone) {
      (el as HTMLElement).dataset.milestone = String(milestone);
      observer?.observe(el);
    },
    flush() {
      send(seen.has(100));
    },
    disconnect() {
      observer?.disconnect();
    },
  };
}
