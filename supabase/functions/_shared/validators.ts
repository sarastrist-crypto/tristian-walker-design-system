// Server-side validation. Mirrors portal/src/lib/validators.ts but
// duplicated here so Edge Functions don't import from the portal app.

import { z } from "https://esm.sh/zod@3.23.8";

export const responseSchema = z.object({
  first_name: z.string().trim().min(1).max(60),
  city: z.string().trim().max(80).optional().or(z.literal("")),
  role_context: z.string().trim().max(200).optional().or(z.literal("")),
  reading_status: z.enum(["just_started", "mid_book", "finished", "came_back"]),
  question_id: z.string().min(1).max(60),
  response_text: z.string().trim().min(1).max(4000),
  consent_publish: z.boolean(),
  email: z.string().email().optional().or(z.literal("")),
  website: z.string().max(0).optional(),
  turnstile_token: z.string().optional(),
});

export const trackReadSchema = z.object({
  session_id: z.string().min(8).max(64),
  scroll_depth_percent: z.number().int().min(0).max(100),
  finished_chapter: z.boolean().default(false),
  source: z.string().max(40).default("portal"),
});

export const bookfunnelEventSchema = z.object({
  event: z.enum(["book_claimed", "new_subscriber"]),
  email: z.string().email(),
  first_name: z.string().optional().default(""),
  last_name: z.string().optional().default(""),
  ip_address: z.string().optional(),
  country_code: z.string().length(2).optional(),
  country_name: z.string().optional(),
  page_id: z.string().optional(),
  book_id: z.string().optional(),
  download_code: z.string().optional(),
  download_link: z.string().url().optional(),
});

export type BookFunnelEvent = z.infer<typeof bookfunnelEventSchema>;
