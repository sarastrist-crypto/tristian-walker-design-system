import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { responseSchema, trackReadSchema, bookfunnelEventSchema } from "@/lib/validators";
import { getSessionId } from "@/lib/analytics";
import { env } from "@/lib/env";

describe("validators", () => {
  it("accepts a minimal valid response", () => {
    const r = responseSchema.safeParse({
      first_name: "Maya",
      reading_status: "finished",
      question_id: "default",
      response_text: "The kitchen line.",
      consent_publish: true,
    });
    expect(r.success).toBe(true);
  });

  it("rejects a response that's too long", () => {
    const r = responseSchema.safeParse({
      first_name: "Maya",
      reading_status: "finished",
      question_id: "default",
      response_text: "x".repeat(5000),
      consent_publish: false,
    });
    expect(r.success).toBe(false);
  });

  it("rejects a non-empty honeypot", () => {
    const r = responseSchema.safeParse({
      first_name: "Maya",
      reading_status: "finished",
      question_id: "default",
      response_text: "valid",
      consent_publish: false,
      website: "spam",
    });
    expect(r.success).toBe(false);
  });

  it("requires a valid reading_status enum", () => {
    const r = responseSchema.safeParse({
      first_name: "Maya",
      reading_status: "halfway",
      question_id: "default",
      response_text: "valid",
      consent_publish: false,
    });
    expect(r.success).toBe(false);
  });

  it("validates a track-read payload", () => {
    const r = trackReadSchema.safeParse({
      session_id: "abcdefgh",
      scroll_depth_percent: 75,
      finished_chapter: false,
    });
    expect(r.success).toBe(true);
  });

  it("clamps invalid scroll percentages", () => {
    const r = trackReadSchema.safeParse({
      session_id: "abcdefgh",
      scroll_depth_percent: 150,
    });
    expect(r.success).toBe(false);
  });

  it("accepts a BookFunnel new_subscriber event", () => {
    const r = bookfunnelEventSchema.safeParse({
      event: "new_subscriber",
      email: "reader@example.com",
      first_name: "Maya",
      country_code: "US",
      country_name: "United States",
    });
    expect(r.success).toBe(true);
  });

  it("rejects a BookFunnel event with bogus event type", () => {
    const r = bookfunnelEventSchema.safeParse({
      event: "totally_made_up",
      email: "reader@example.com",
    });
    expect(r.success).toBe(false);
  });
});

describe("env", () => {
  it("exposes the teaser video + poster paths", () => {
    expect(env.VITE_TEASER_VIDEO_PATH).toMatch(/\.mp4$/);
    expect(env.VITE_TEASER_POSTER_PATH).toMatch(/\.(jpg|jpeg|png)$/);
  });

  it("uses an /api base for the function gateway", () => {
    expect(env.VITE_API_BASE).toBe("/api");
  });
});

describe("session id", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("creates and persists a session id", () => {
    const a = getSessionId();
    const b = getSessionId();
    expect(a).toBe(b);
    expect(a.length).toBeGreaterThan(8);
  });
});
