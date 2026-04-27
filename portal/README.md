# The Quiet Line — Reader Portal

Single-page portal for `read.thequietlinebook.com`. Vite + React 19 + Tailwind + Supabase.

## Run locally

```bash
cd portal
cp .env.example .env       # fill in Supabase URL/anon key when you have them
npm install
npm run dev                # → http://127.0.0.1:5173
```

## Project structure

```
portal/
├── content/chapter-01.md       Markdown source for the in-browser reader.
├── public/video/               kitchen-loop.{mp4,webm} + poster.jpg (Remotion output)
├── src/
│   ├── lib/        env, supabase client, validators, scroll analytics
│   ├── components/ Hero, ChapterReader, BookFunnelHandoff, ResponseForm, Footer
│   ├── pages/      Home, Admin, NotFound
│   ├── admin/      AuthGate, ResponsesTable
│   └── styles/     tokens.css (re-exports root design system), reader.css
├── netlify.toml                deploy config + CSP headers
└── tests/smoke.test.ts         vitest
```

## Tokens

`src/styles/tokens.css` re-exports the brand tokens from `../colors_and_type.css`
at the repo root. Tailwind reads those CSS variables via `tailwind.config.ts` —
edit tokens in one place.

## Forking for a new audience

To spin up a variant (`/recovery`, `/communities`, `/teams`):

```bash
# Same Netlify site, different subdirectory deploy + env vars:
VITE_TARGET_AUDIENCE=recovery
VITE_HERO_PITCH=...
VITE_RESPONSE_QUESTION=...
```

No code changes — `source` on every database write picks up the audience name.

## Tests

```bash
npm test
```

Smoke coverage: validators, session-id persistence. The full E2E (form post,
RLS, BookFunnel webhook) lives in the Supabase migration tests, not here.
