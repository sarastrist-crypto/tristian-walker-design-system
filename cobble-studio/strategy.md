# Cobble Studio — The Three Patterns

## Context

Cobble Studio is a workshop, not a SaaS. We build custom software for SMBs by cobbling solutions from patterns we've already proven in real client deployments. We get paid for the build; we retain rights to commercialize patterns.

Before we draft any landing page, we need to define **exactly what we sell**. This plan defines the three foundational patterns derived from the three most-developed silos in the existing portfolio (`glisten-pools-app`, `quiet-line-dashboard`, `virginias-view`), specifying for each: what it is, who buys it, what's inside, what work is needed to make it sellable, and how it's priced.

After this plan is locked, the landing page becomes a relatively mechanical exercise — copy = the pattern specs, structure = the three-pattern catalog.

---

## What a "Pattern" Is (Workshop Definition)

A Cobble Pattern is a **catalog item** in the workshop. Each pattern is:

1. A pre-built, partially-configurable solution that solves a specific business problem out of the box.
2. Documented integration points for the bits we customize per client.
3. Paired with a Claude Code skill (a `SKILL.md`) so the next build — by us, a contractor, or the client themselves — starts at ~80% done.
4. Licensed: client gets perpetual use; Cobble retains commercialization rights to the underlying patterns.

Patterns are NOT off-the-shelf SaaS yet. They are **the inventory the workshop draws from when a customer walks in**. After 3-5 successful client deployments per pattern, we evaluate spinning the strongest one into a self-serve product.

---

## The Three Patterns

### PATTERN 1 — Cobble Ops *(derived from `glisten-pools-app`)*

**What it is:** A multi-tenant PWA + Supabase backend for service businesses whose workers go to physical locations.

**Core asset:** GPS-verified, photo-stamped proof-of-visit. Owner sees live crew status on a map; workers run a guided arrival → photo → log flow on mobile; every record is partitioned by tenant with row-level security.

**Verticals it serves:** pool service, lawn care, HVAC, cleaning, pet sitting, mobile salons, pest control, mobile detail.

| | |
|---|---|
| **In the box (existing code)** | Multi-tenant Supabase schema with RLS · Worker PWA (route, camera w/ GPS, issue flagging) · Owner dashboard (live crew map, proof log, customer roster) · Device-bound JWT for techs (no auth.users needed) · Plan-tiered feature gating (trial/solo/crew/fleet) · Stripe subscription scaffold |
| **Work to productize** | ~3 weeks. Abstract pool-specific `ChemicalAdd` → generic `service_log`; replace `service_day` enum with flexible recurrence; complete Mapbox + Stripe deployment (currently staged); add brand-token theming; add AI route optimization & photo verification (Cobble's AI angle on this pattern). |
| **Who buys it** | Service business owners with 3–50 technicians who want accountability + scheduling without paying ServiceTitan ($199–499/mo). |
| **Pricing** | Seed: $8–15k (we host on branded subdomain; Cobble retains commercialization). Standard: $30–50k (client owns infra; small royalty if Cobble commercializes). |
| **Reference customer** | Glisten Pools |

---

### PATTERN 2 — Cobble Outreach *(derived from `virginias-view` + `geha-outreach`)*

**What it is:** An AI-powered outreach engine — Anthropic + Gmail + Google Sheets — that turns a list of contacts into a managed campaign with email drafts, reply summarization, spend caps, and analytics.

**Core asset:** Two halves that combine into one workflow: a Python CLI that turns CSVs into branded newsletter PDFs/HTML, and a TypeScript serverless dashboard with **12 production endpoints** covering OAuth, lead management, AI copy generation, Gmail drafting, reply summarization, bulk send, and monthly spend tracking.

**Verticals it serves:** real estate, financial advisors, insurance agents, B2B SDRs, recruiters, fundraising, political/nonprofit organizing.

| | |
|---|---|
| **In the box (existing code)** | Python newsletter pipeline (Jinja2 + WeasyPrint, CSV-driven, brand-themed templates) · 12 Vercel serverless endpoints (auth, leads, drafts, reply summaries, blast preview/send, overview, spend, activity, settings, tracking pixel) · Anthropic prompt registry (8 reusable prompts) with monthly USD spend cap · Gmail draft + reply-scan integration · Google Sheets as CRM (no DB required) · Upstash Redis for spend & activity |
| **Work to productize** | ~2–3 weeks. Merge overlapping patterns from `geha-outreach` (Cheerio scrape + KV-cached enrichment) into a shared `@cobble/outreach-engine` library; abstract Paragon 5 CSV → generic CSV mapper; pluggable LLM provider; brand-token theming. |
| **Who buys it** | Solo professionals or small teams (1–20 ppl) who need to systematically reach prospects with personalized messaging but can't afford a marketing team or six SaaS tools stitched together. |
| **Pricing** | Seed: $5–12k. Standard: $25–40k. |
| **Reference customers** | Virginia's View (real estate), GEHA Outreach (federal-employee union targeting) |

---

### PATTERN 3 — Cobble Creator *(derived from `quiet-line-dashboard`)*

**What it is:** A daily-ritual operations hub for authors, speakers, teachers, and coaches — a single place to run today's content production (teleprompter, AI photo prompts) and outreach pipeline (book/talk follow-ups, call notes).

**Core asset:** The "daily ritual" pattern. Every day the creator opens the dashboard and sees: today's focus contact, today's content prompt (with a built-in teleprompter to record), and a 1-tap call/follow-up workflow. All state syncs across devices via Netlify Blobs.

**Verticals it serves:** self-published authors, professional speakers, online course creators, coaches, podcast hosts.

| | |
|---|---|
| **In the box (existing code)** | Daily ritual UI (random-weighted focus pick, repeat-avoidance) · Content prompt with AI photo direction · In-browser teleprompter (speed/font/mirror controls) · Pipeline color-coded outreach tracker · Timestamped notes + follow-up scheduling · Cross-device sync (Netlify Blobs + service worker, debounced last-write-wins) · Canvas-based quote/asset rendering with filter stacking |
| **Work to productize** | ~2 weeks. Strip Quiet Line-specific content (10 quotes, 41 recovery centers); add real auth + per-user state partitioning (currently single-user via shared secret); make content types pluggable (book/lecture/course). |
| **Who buys it** | Authors and speakers doing their own promotion who need a single place to manage daily content output + outreach — alternative to stitching Mailchimp + Calendly + a Notion CRM. |
| **Pricing** | Seed: $4–8k. Standard: $18–30k. |
| **Reference customers** | Quiet Line Dashboard (Tristian Walker — book launch + recovery-center outreach), Tristian Walker Web (speaker site) |

> **Parked for v2 — "Cobble Author Intro" SEO Pattern.** A future companion module (author bio landing page generator with Schema.org Author markup, OpenGraph cards, JSON-LD book/lecture metadata, RSS / podcast feed generator, social card templates). Does not exist in any current repo. Punted to v2 so we can ship Cobble Creator faster; revisit after the first Creator deployment validates demand.

---

## What Connects All Three Patterns

The shared foundation across all patterns — extracted once, used everywhere:

- **`@cobble/brand-tokens`** — design system as code (colors, fonts, dot-grid, `<em>` rule) + Claude Code skill. Already duplicated across 5 repos; one extraction, all patterns inherit.
- **AI provider abstraction** — Anthropic Claude wrapper with monthly spend cap + prompt registry. Already mostly built in `virginias-view/dashboard`.
- **Identity & multi-tenancy patterns** — Supabase RLS pattern (from Ops) for the heavy patterns; namespace partitioning (KV-key prefix) for the lighter ones.
- **PWA shell** — service worker + manifest + install prompt. Already in Ops and Creator.
- **Claude Code skill packaging** — every pattern ships its own `SKILL.md` so future engagements start at 80% done. Pattern proven by `tristian-walker-design-system`.

---

## What Cobble Studio Actually Sells

A typical engagement looks like this:

1. Client describes their business problem in a 30-minute discovery call.
2. Cobble identifies which pattern forms the foundation (often one primary + utilities from another).
3. Cobble deploys the pattern, branded and customized for the client, in 1–3 weeks.
4. Client pays Cobble for the build; Cobble retains rights to commercialize all or part of the solution.
5. Patterns proven across 3+ client deployments graduate into the shared core or become self-serve products.

The landing page sells exactly this story: *pick the pattern closest to your problem, see the price band, see real reference deployments, book a discovery call.*

---

## Sequencing (Revised)

| # | Pattern | Productization runway | Why this order |
|---|---|---|---|
| **1** | **Cobble Creator** | ~2 weeks | You ARE the buyer — first pitch lands with conviction; Quiet Line Dashboard already serves as the live demo; tightest brand alignment with the Tristian Walker / Quiet Line aesthetic; existing network of authors/speakers/coaches. Lead pattern. Author Intro SEO module deferred to v2. |
| 2 | Cobble Ops | ~3 weeks | Highest revenue ceiling; most complete codebase; Glisten Pools is a working reference. Expansion into a vertical (service businesses) you're newer to — easier after Creator wins fund confidence and budget. |
| 3 | Cobble Outreach | ~2–3 weeks | Most production-grade infrastructure (12 endpoints, OAuth, spend cap, prompt registry) but most crowded competitive space. Best entered after lessons from the first two patterns inform positioning. |

**Why the change:** Originally locked Ops first based on revenue ceiling and code completeness. Revisited after recognizing the Quiet Line Dashboard's depth (daily-ritual UX, real teleprompter, canvas asset rendering, pipeline CRM) and the asymmetry in domain credibility — Cobble Studio's operator already lives in the authors/speakers world. A confident first sale from an existing network beats a higher-ceiling cold pitch.

---

## Verification (How We Test This Plan)

This plan is correct if:

1. Each pattern's **"Who buys it"** sentence resonates with at least 3 real prospects in informal conversations — before we invest a single hour in productization work.
2. Each pattern's **"Verticals it serves"** list survives a "would you actually use this for [vertical]?" test with one sample customer per vertical.
3. The **work-to-productize estimates** hold within 25% (3 weeks doesn't become 8) once we actually begin extraction.

Validation order: pitch Cobble Creator to 3 authors / speakers / coaches in your existing network within the next 30 days **before** writing any abstraction code. If the pitch falls flat, the pattern isn't really a product — it's just a one-off codebase wearing product clothes.

---

## Next Steps (After This Plan Is Approved)

1. **Cobble Creator sales sheet** — one-pager: price band, buyer profile, deliverables, the Quiet Line Dashboard as the live reference. This is the first asset to draft since Creator is the lead pattern.
2. **Cobble Creator extraction sequencing** — decide which abstractions ship first (likely: strip Quiet Line content into a swappable starter, add real auth + per-user state partitioning, pluggable content types).
3. **Validation pitches** — book 3 conversations with authors / speakers / coaches in your existing network using the Creator sales sheet as the pitch artifact. Do this BEFORE any extraction code is written.
4. **Landing page draft** — structured around the three patterns + the workshop story, with Cobble Creator as the hero. Sales sheets for Ops and Outreach can follow.
