// Shared CORS helpers for Edge Functions.

const DEFAULT_ALLOW = new Set<string>([
  "http://127.0.0.1:5173",
  "http://localhost:5173",
  "https://read.thequietlinebook.com",
  "https://thequietlinebook.com",
  "https://www.thequietlinebook.com",
  "https://tristianwalker.com",
  "https://www.tristianwalker.com",
]);

export function corsHeaders(origin: string | null, allow = DEFAULT_ALLOW): Record<string, string> {
  const ok = origin && allow.has(origin) ? origin : "*";
  return {
    "Access-Control-Allow-Origin": ok,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
}

export function preflight(req: Request): Response | null {
  if (req.method !== "OPTIONS") return null;
  return new Response(null, { headers: corsHeaders(req.headers.get("origin")) });
}

export function jsonResponse(body: unknown, status = 200, origin: string | null = null): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders(origin),
    },
  });
}
