// GET /api/testimonials/published
// Public, read-only feed of approved testimonials for tristianwalker.com
// and thequietlinebook.com. Anon key + RLS-protected view.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";
import { corsHeaders, preflight } from "../_shared/cors.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const ANON = Deno.env.get("SUPABASE_ANON_KEY")!;

const client = createClient(SUPABASE_URL, ANON, { auth: { persistSession: false } });

function stripHtml(s: string): string {
  return s.replace(/<[^>]*>/g, "");
}

Deno.serve(async (req) => {
  const pre = preflight(req);
  if (pre) return pre;
  const origin = req.headers.get("origin");
  if (req.method !== "GET") {
    return new Response(JSON.stringify({ error: "method_not_allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
    });
  }

  const { data, error } = await client
    .from("public_testimonials")
    .select("first_name, city, role_context, response_text, created_at")
    .limit(50);

  if (error) {
    console.error("testimonials select error:", error);
    return new Response(JSON.stringify({ error: "db_error" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
    });
  }

  const sanitized = (data ?? []).map((r) => ({
    first_name: stripHtml(String(r.first_name ?? "")),
    city: r.city ? stripHtml(String(r.city)) : null,
    role_context: r.role_context ? stripHtml(String(r.role_context)) : null,
    response_text: stripHtml(String(r.response_text ?? "")),
    created_at: r.created_at,
  }));

  return new Response(JSON.stringify({ testimonials: sanitized }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=300, s-maxage=300",
      ...corsHeaders(origin),
    },
  });
});
