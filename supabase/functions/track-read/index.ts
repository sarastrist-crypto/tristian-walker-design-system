// POST /api/track-read
// Anonymous scroll-depth ping. Session ID only — no PII.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";
import { jsonResponse, preflight } from "../_shared/cors.ts";
import { rateLimit, clientIp } from "../_shared/rateLimit.ts";
import { trackReadSchema } from "../_shared/validators.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const admin = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });

Deno.serve(async (req) => {
  const pre = preflight(req);
  if (pre) return pre;
  const origin = req.headers.get("origin");
  if (req.method !== "POST") return jsonResponse({ error: "method_not_allowed" }, 405, origin);

  const ip = clientIp(req);
  const rl = rateLimit(`track:${ip}`, { windowMs: 30_000, max: 30 });
  if (!rl.allowed) return jsonResponse({ ok: true }, 200, origin); // silent drop

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: "invalid_json" }, 400, origin);
  }

  const parsed = trackReadSchema.safeParse(body);
  if (!parsed.success) return jsonResponse({ error: "invalid_payload" }, 400, origin);

  const { error } = await admin.from("chapter_reads").insert({
    session_id: parsed.data.session_id,
    scroll_depth_percent: parsed.data.scroll_depth_percent,
    finished_chapter: parsed.data.finished_chapter,
    source: parsed.data.source,
  });

  if (error) {
    console.error("track-read insert error:", error);
    return jsonResponse({ error: "db_error" }, 500, origin);
  }

  return jsonResponse({ ok: true }, 200, origin);
});
