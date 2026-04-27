import { z } from "zod";

const schema = z.object({
  VITE_SUPABASE_URL: z.string().url().or(z.literal("")),
  VITE_SUPABASE_ANON_KEY: z.string(),
  VITE_BOOKFUNNEL_URL: z.string().url(),
  VITE_HERO_PITCH: z.string().min(1),
  VITE_HERO_VIDEO_PATH: z.string().default("/video/kitchen-loop.mp4"),
  VITE_HERO_POSTER_PATH: z.string().default("/video/kitchen-poster.jpg"),
  VITE_TEASER_VIDEO_PATH: z.string().default("/video/quiet-line-teaser.mp4"),
  VITE_TEASER_POSTER_PATH: z.string().default("/video/quiet-line-teaser-poster.jpg"),
  VITE_CAMPAIGN_END_DATE: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  VITE_TARGET_AUDIENCE: z.enum(["default", "recovery", "communities", "teams"]).default("default"),
  VITE_RESPONSE_QUESTION: z.string().min(1),
  VITE_API_BASE: z.string().default("/api"),
  VITE_TURNSTILE_SITE_KEY: z.string().optional().default(""),
});

const parsed = schema.safeParse(import.meta.env);

if (!parsed.success) {
  console.error("Invalid environment variables:", parsed.error.flatten().fieldErrors);
  throw new Error("Portal env validation failed — check .env against .env.example");
}

export const env = parsed.data;

export function formatCampaignEnd(): string {
  const d = new Date(env.VITE_CAMPAIGN_END_DATE + "T00:00:00Z");
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}
