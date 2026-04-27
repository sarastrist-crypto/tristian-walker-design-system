# Reader portal — repo map

Three things now live in this repo, on top of the existing brand design system.

| Path                    | What it is                                                 |
| ----------------------- | ---------------------------------------------------------- |
| `colors_and_type.css`, `ui_kits/`, `assets/`, `preview/` | the existing brand design system (unchanged) |
| `portal/`               | the Vite + React 19 reader portal app — `read.thequietlinebook.com` |
| `remotion/`             | scaffold for the kitchen-scene hero loop (placeholder still) |
| `supabase/`             | DB migrations + four Edge Functions                         |

## Portal at a glance

```
portal/
├── content/chapter-01.md        Chapter 1 source. Includes <!-- continue -->
│                                marker that splits prelude vs. rest in the UI.
├── public/
│   ├── video/
│   │   ├── quiet-line-teaser.mp4         (~11 MB — re-rendered, all segments)
│   │   ├── quiet-line-teaser-poster.jpg  (~200 KB)
│   │   └── kitchen-poster.jpg            (placeholder for the future hero loop)
│   ├── og-image.jpg             1200×630, composed from drift-doorway.jpg
│   ├── favicon.svg
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── lib/                     env (zod-validated), supabase client,
│   │                            validators, scroll analytics
│   ├── components/              Hero, HeroVideo, TrailerSection,
│   │                            ChapterReader, BookFunnelHandoff,
│   │                            ResponseForm, Footer, Eyebrow, ErrorBoundary
│   ├── pages/                   Home, Admin, Privacy, NotFound
│   ├── admin/                   AuthGate (magic link), ResponsesTable
│   └── styles/                  tokens.css (re-exports root design system),
│                                base.css (Tailwind + buttons/forms),
│                                reader.css (chapter typography)
├── vercel.json                  deploy config + CSP/HSTS headers
├── vite.config.ts | vitest.config.ts | tailwind.config.ts | tsconfig.json
└── tests/smoke.test.ts          11 cases (validators, env, session id)
```

## How the page reads top to bottom

1. **Hero** — kitchen-poster background (waiting on real Remotion render),
   title with the brand italic move on *Line*, two CTAs.
2. **TrailerSection** — phone-framed 9:16 trailer, click-to-play.
   On `ended`, an end-card overlay fades in with "Read Chapter 1" and
   "Get the full book" buttons + a quiet replay link.
3. **ChapterReader** — opens with the HOSPITAL · Hour Zero prelude (drop cap,
   six paragraphs). A "Continue" gate then waits for a tap to reveal the
   rest (Part I → cul-de-sac chapter → Hour Unknown coda). Page lands light;
   the reader chooses to expand.
4. **BookFunnelHandoff** — handoff to BookHip (`VITE_BOOKFUNNEL_URL`) with
   campaign-end framing pulled from `VITE_CAMPAIGN_END_DATE`.
5. **ResponseForm** — first name (req), city, role, reading status, response,
   email (opt), consent. Honeypot + soft IP-rate-limit; Turnstile optional.
6. **Footer** — name · tristianwalker.com · `/privacy` · copyright.

`/admin` is gated by Supabase magic link; allowlist comes from the
`app.admin_email` setting on the database.

## What's stubbed and needs Tristian's input

- Real `kitchen-loop.mp4` for the hero — Remotion compositions are scaffolded
  in `remotion/`, but no production still has been generated. Today the hero
  shows the static poster only. (That's a perfectly valid permanent design
  choice — flag if you want to commit to it.)
- `VITE_HERO_PITCH` is the placeholder line "Some careers don't collapse —
  they quietly drift." Replace if you want a different framing.
- `vercel.json` line 12 has the placeholder `YOUR-PROJECT.supabase.co` —
  swap to your real Supabase subdomain before the first deploy.
- BookFunnel webhook URL must be registered in the BookFunnel Integrations
  dashboard once `BOOKFUNNEL_WEBHOOK_TOKEN` is set as a Supabase secret.

## Deploy steps (when ready)

```bash
# 1. Supabase
supabase link --project-ref <ref>
supabase db push
supabase functions deploy responses track-read bookfunnel-webhook testimonials
supabase secrets set \
  BOOKFUNNEL_WEBHOOK_TOKEN=$(openssl rand -hex 16) \
  RESEND_API_KEY=re_... \
  NOTIFY_EMAIL=tristian@... \
  ADMIN_EMAIL=tristian@... \
  IP_SALT=$(openssl rand -hex 16)

# 2. Allow the admin email at the database level
psql "$DATABASE_URL" -c "alter database postgres set app.admin_email = 'tristian@...';"

# 3. Vercel
# Connect the repo, set root directory to portal/, framework Vite, build npm run build,
# add every VITE_* env var from portal/.env.example.
# Edit portal/vercel.json line 12 → real Supabase project subdomain.

# 4. DNS
# CNAME read.thequietlinebook.com → cname.vercel-dns.com (target shown in Vercel domain settings)
```
