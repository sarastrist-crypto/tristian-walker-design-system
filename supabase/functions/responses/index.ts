// POST /api/responses
// Validates payload, inserts into responses, fires a Resend email to NOTIFY_EMAIL.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";
import { jsonResponse, preflight } from "../_shared/cors.ts";
import { rateLimit, clientIp } from "../_shared/rateLimit.ts";
import { responseSchema } from "../_shared/validators.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const RESEND_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const NOTIFY_EMAIL = Deno.env.get("NOTIFY_EMAIL") ?? "";
const FROM_EMAIL = Deno.env.get("RESEND_FROM_EMAIL") ?? "portal@thequietlinebook.com";
const TURNSTILE_SECRET = Deno.env.get("TURNSTILE_SECRET_KEY") ?? "";

const admin = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });

async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  if (!TURNSTILE_SECRET) return true;
  if (!token) return false;
  const body = new FormData();
  body.append("secret", TURNSTILE_SECRET);
  body.append("response", token);
  body.append("remoteip", ip);
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body,
  });
  if (!res.ok) return false;
  const data = (await res.json()) as { success: boolean };
  return Boolean(data.success);
}

async function sendNotification(payload: Record<string, unknown>): Promise<void> {
  if (!RESEND_KEY || !NOTIFY_EMAIL) return;
  const subject = `Reader response — ${payload.first_name ?? "anon"}`;
  const text = [
    `From: ${payload.first_name ?? ""}${payload.city ? ` (${payload.city})` : ""}`,
    payload.role_context ? `Context: ${payload.role_context}` : null,
    `Status: ${payload.reading_status}`,
    `Consent to publish: ${payload.consent_publish ? "yes" : "no"}`,
    payload.email ? `Reply-to: ${payload.email}` : null,
    "",
    String(payload.response_text ?? ""),
  ]
    .filter(Boolean)
    .join("\n");
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: [NOTIFY_EMAIL],
      reply_to: payload.email ? String(payload.email) : undefined,
      subject,
      text,
    }),
  }).catch((e) => console.error("Resend send failed:", e));
}

async function hashIp(ip: string): Promise<string> {
  const data = new TextEncoder().encode(ip + (Deno.env.get("IP_SALT") ?? ""));
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 16);
}

Deno.serve(async (req) => {
  const pre = preflight(req);
  if (pre) return pre;
  const origin = req.headers.get("origin");
  if (req.method !== "POST") return jsonResponse({ error: "method_not_allowed" }, 405, origin);

  const ip = clientIp(req);
  const rl = rateLimit(`responses:${ip}`, { windowMs: 60_000, max: 5 });
  if (!rl.allowed) {
    return jsonResponse({ error: "rate_limited", retry_after: rl.retryAfter }, 429, origin);
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: "invalid_json" }, 400, origin);
  }

  const parsed = responseSchema.safeParse(body);
  if (!parsed.success) {
    return jsonResponse({ error: "invalid_payload", details: parsed.error.flatten() }, 400, origin);
  }

  // Honeypot — if filled, silently 200.
  if (parsed.data.website && parsed.data.website.length > 0) {
    return jsonResponse({ ok: true }, 200, origin);
  }

  if (TURNSTILE_SECRET) {
    const ok = await verifyTurnstile(parsed.data.turnstile_token ?? "", ip);
    if (!ok) return jsonResponse({ error: "turnstile_failed" }, 403, origin);
  }

  const ip_hash = await hashIp(ip);

  // The responses.reader_email column has a FK to readers.email, so upsert
  // the reader first when an email is provided. This makes the form
  // self-sufficient — readers don't have to come from BookFunnel first.
  if (parsed.data.email) {
    const { error: readerError } = await admin.from("readers").upsert(
      {
        email: parsed.data.email,
        city: parsed.data.city || null,
        source: "portal_response",
      },
      { onConflict: "email", ignoreDuplicates: false },
    );
    if (readerError) {
      console.error("reader upsert error:", readerError);
      // Non-fatal — fall through and try the response insert with email = null
      // so we still capture the response text.
    }
  }

  const { error } = await admin.from("responses").insert({
    first_name: parsed.data.first_name,
    city: parsed.data.city || null,
    role_context: parsed.data.role_context || null,
    reading_status: parsed.data.reading_status,
    question_id: parsed.data.question_id,
    response_text: parsed.data.response_text,
    give_to: parsed.data.give_to || null,
    give_to_why: parsed.data.give_to_why || null,
    consent_publish: parsed.data.consent_publish,
    reader_email: parsed.data.email || null,
    source: "portal",
    ip_hash,
  });

  if (error) {
    console.error("insert error:", error);
    return jsonResponse({ error: "db_error" }, 500, origin);
  }

  await sendNotification(parsed.data);

  return jsonResponse({ ok: true }, 200, origin);
});
