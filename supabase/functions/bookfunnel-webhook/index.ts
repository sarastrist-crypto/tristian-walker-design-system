// POST /api/bookfunnel-webhook
// BookFunnel does not sign webhooks, so we authenticate via a secret token
// in the URL path: /bookfunnel-webhook/<TOKEN>.
// Register that exact URL in the BookFunnel Integrations dashboard.
//
// Payload contract (verified against the BookFunnel docs):
// https://authors.bookfunnel.com/help/bookfunnel-webhooks/

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";
import { bookfunnelEventSchema } from "../_shared/validators.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const TOKEN = Deno.env.get("BOOKFUNNEL_WEBHOOK_TOKEN") ?? "";

const admin = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });

function plain(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return mismatch === 0;
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return plain({ error: "method_not_allowed" }, 405);
  if (!TOKEN) {
    console.error("BOOKFUNNEL_WEBHOOK_TOKEN not set");
    return plain({ error: "not_configured" }, 503);
  }

  const url = new URL(req.url);
  // Path looks like /functions/v1/bookfunnel-webhook/<TOKEN>
  const provided = url.pathname.split("/").pop() ?? "";
  if (!timingSafeEqual(provided, TOKEN)) {
    return plain({ error: "unauthorized" }, 401);
  }

  let body: unknown;
  try {
    // BookFunnel can send either JSON or form params — handle both.
    const ct = req.headers.get("content-type") ?? "";
    if (ct.includes("application/json")) {
      body = await req.json();
    } else {
      const fd = await req.formData();
      body = Object.fromEntries(fd.entries());
    }
  } catch {
    return plain({ error: "invalid_body" }, 400);
  }

  const parsed = bookfunnelEventSchema.safeParse(body);
  if (!parsed.success) {
    console.error("bookfunnel webhook invalid payload:", parsed.error.flatten());
    return plain({ error: "invalid_payload" }, 400);
  }

  const evt = parsed.data;
  const consentMarketing = evt.event === "new_subscriber";

  const { error } = await admin
    .from("readers")
    .upsert(
      {
        email: evt.email,
        bookfunnel_id: evt.download_code ?? null,
        consent_marketing: consentMarketing,
        source: "bookfunnel",
      },
      { onConflict: "email", ignoreDuplicates: false },
    );

  if (error) {
    console.error("readers upsert error:", error);
    return plain({ error: "db_error" }, 500);
  }

  return plain({ ok: true });
});
