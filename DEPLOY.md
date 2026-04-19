# Deploy notes

This folder is a static site — `ui_kits/ui_kit.html` + sibling assets. No build step.

## What to ship

```
assets/         (favicon + images)
colors_and_type.css
ui_kits/
preview/        (optional — delete if you don't want the token cards public)
```

## What NOT to ship

- `uploads/` — private manuscript drafts and screenshots. Already covered by `.gitignore`.
- `README.md`, `SKILL.md`, `DEPLOY.md`, `package.json`, `package-lock.json`, `.claude/`.
- Any `*_files/` Save-Page-As cruft.

## HTTP headers to set at the CDN / web server

The page ships with a `<meta http-equiv="Content-Security-Policy">` that covers scripts, styles, fonts, images, and form actions. Two directives are **silently ignored** in meta and must be sent as HTTP response headers at the server:

```
Content-Security-Policy: frame-ancestors 'self' https://claude.ai https://claude.com
X-Frame-Options: SAMEORIGIN
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()
X-Content-Type-Options: nosniff
```

Adjust the `frame-ancestors` allowlist to match the hosts that legitimately embed this page. Default `'self'` is safe if nobody embeds it.

## Netlify / Vercel / Cloudflare Pages

Drop the above into `_headers` (Netlify/CF Pages) or `vercel.json`:

```
# _headers
/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()
  Content-Security-Policy: frame-ancestors 'self'
```

## Local preview

```
npm install
npm start
# → http://127.0.0.1:8765/ui_kits/ui_kit.html
```

Binds to `127.0.0.1` only — not exposed on LAN.
