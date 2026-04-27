// Per-IP soft rate limiter using in-memory state. Edge Function instances
// can be ephemeral, so this is best-effort — fine for casual abuse, not a
// hard ddos shield. Pair with Cloudflare Turnstile if abuse appears.

const buckets = new Map<string, { count: number; resetAt: number }>();

export interface RateLimitOptions {
  windowMs: number;
  max: number;
}

export function rateLimit(key: string, opts: RateLimitOptions): { allowed: boolean; retryAfter: number } {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || b.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + opts.windowMs });
    return { allowed: true, retryAfter: 0 };
  }
  if (b.count >= opts.max) {
    return { allowed: false, retryAfter: Math.ceil((b.resetAt - now) / 1000) };
  }
  b.count += 1;
  return { allowed: true, retryAfter: 0 };
}

export function clientIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("cf-connecting-ip") ??
    "unknown"
  );
}
