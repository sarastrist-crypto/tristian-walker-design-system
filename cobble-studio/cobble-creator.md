# Cobble Creator — Component Inventory

*Derived from `quiet-line-dashboard` (Tristian Walker / Quiet Line book launch + recovery-center outreach).*

**Architecture summary:** Static `index.html` (~237KB single file) + `sw.js` (service worker) + `manifest.webmanifest` + one Netlify Function (`netlify/functions/sync.js`) + Netlify Blob storage. No bundler. State is a single monolithic JSON object kept in localStorage and debounce-synced to a Blob. Dependencies: `@netlify/blobs` only.

**Tag legend:**
- 🔧 **Creator-core** — essential to the Cobble Creator pattern
- ♻️ **Shared** — candidate for `@cobble/core`, usable across Creator + Ops + Outreach
- 🗑️ **Strip** — Quiet-Line-specific content, removed from the pattern

---

## 1. PWA Shell ♻️
**What it does:** Installable mobile-app experience — service worker caches assets for offline use, manifest provides app icon and install prompt, app behaves like a native PWA on iOS/Android home screens.

**Today:** `sw.js` uses network-first for HTML (cache `v5`), cache-first for everything else. `manifest.webmanifest` declares icons, name, theme.

**Generalized form:** A `@cobble/pwa-shell` template that any pattern can drop in — Ops already has its own version (vite-plugin-pwa); Creator's lighter-weight no-bundler version is the better template for static deployments.

**Effort:** ~2 hours to lift and parameterize (name, theme color, icon paths).

---

## 2. Sync Layer ♻️
**What it does:** Bidirectional sync between localStorage (instant) and a remote KV store (durable, cross-device). Debounced on write; last-write-wins; works offline with eventual consistency.

**Today:** `netlify/functions/sync.js` exposes `GET /sync` and `POST /sync`. Stores monolithic state JSON under a single Blob key. CORS enabled. Auth via shared secret in `X-Sync-Secret` header.

**Quiet Line-specific bits to strip:** Hardcoded Blob store name (`quiet-line-dashboard`).

**Generalized form:** A pluggable sync layer with three backend adapters — Netlify Blobs (for Creator's no-bundler deployments), Upstash Redis (already used in Virginia's View), Vercel KV (used in geha-outreach). Single API surface: `sync.get(userKey)` / `sync.put(userKey, state)`. Becomes `@cobble/sync`.

**Effort:** ~1 day. The current single-Blob model needs to become per-user-keyed (see Auth below).

---

## 3. Auth 🔧 *(needs replacement, not extraction)*
**What it does today:** Shared secret in HTML (`state.syncSecret`) — anyone with the URL can read/write everyone's state. This is fine for a single-user personal tool, **not** for a multi-tenant product.

**Replacement needed:** OAuth (Google or magic-link email). User session → `userId`. All sync calls keyed by `user:{userId}:state`.

**Generalized form:** `@cobble/auth` — thin wrapper around NextAuth or Lucia, with adapters for the three storage backends. Same module powers all three patterns.

**Effort:** ~2-3 days. This is the single biggest blocker to making Creator multi-tenant.

---

## 4. Daily Focus Picker 🔧
**What it does:** Each day, the dashboard picks ONE item from a list (a contact, a quote, a topic) as the day's focus. Uses random-weighted selection with repeat-avoidance — items recently focused get lower weight, ensuring rotation.

**Today:** Hardcoded to pick from 41 recovery centers + 10 quotes. `focusIndex` and date tracking live in state.

**Quiet Line-specific bits to strip:** The 41-center list, the 10-quote list, the recovery-center domain framing.

**Generalized form:** Pluggable content pools (Creator user defines: "my contacts," "my quotes," "my topics"). Pick algorithm stays the same. Becomes a core Creator primitive — the heartbeat of the daily ritual.

**Effort:** ~1 day to extract the algorithm and add a content-pool config layer.

---

## 5. Pipeline Tracker 🔧
**What it does:** Tabular view of all contacts, color-coded by stage (e.g., voicemail-left → presentation-scheduled). Inline phone, primary contact name, last-touch date. Click row → opens detail modal.

**Today:** Hardcoded for recovery-center outreach with 5 stages and Quiet-Line-specific stage names.

**Quiet Line-specific bits to strip:** Stage enum values, recovery-center field names.

**Generalized form:** User-configurable pipeline stages (the buyer defines their own: e.g., authors might use "pitched → reviewed → published → followed-up"). Color-coding driven by stage config. Becomes the Creator pattern's CRM view.

**Effort:** ~1.5 days. Need stage-config UI and migration to user-defined stages.

---

## 6. Contact Detail Modal 🔧
**What it does:** Click a contact → opens full-screen modal with editable contact info, historical notes (timestamped), follow-up history, free-text research block. Save persists to state, syncs to Blob.

**Today:** Fields hardcoded for recovery centers (state, director, decision-maker, etc.).

**Quiet Line-specific bits to strip:** Field schema.

**Generalized form:** Schema-driven contact model — buyer defines what fields matter (author might track: agent, publicist, book reviewer, podcast host). Modal renders from schema.

**Effort:** ~2 days. Schema-driven UI is more work than hardcoded fields.

---

## 7. Call Session Wizard 🔧
**What it does:** Modal-based flow for powering through a daily call list. Shows N highest-priority contacts in sequence, with quick-log buttons (Spoke / VM / No Answer), notes field, callback date picker. Built for the "10 calls in 30 minutes" daily ritual.

**Today:** Pulls "top 10" from recovery centers; outcome buttons map to recovery-center stages.

**Quiet Line-specific bits to strip:** Hardcoded outcome → stage mapping.

**Generalized form:** Configurable outcome buttons; uses the buyer's pipeline stages from Component #5.

**Effort:** ~1 day.

---

## 8. Timestamped Notes ♻️
**What it does:** Notes field auto-prepends `[YYYY-MM-DD HH:MM]` on each new entry. Existing notes are append-only — you can't edit history. Status changes auto-calculate next-follow-up; manual override sticks.

**Today:** Used in contact detail modals + dashboard's own daily notes field.

**Generalized form:** A small utility (`@cobble/timestamped-notes`) — a textarea component + a notes-array data model. Reusable in Ops (visit notes), Outreach (lead notes), Creator (contact notes). One of the cleanest extractions.

**Effort:** ~3 hours.

---

## 9. Variant Cycler 🔧
**What it does:** "Walker Talks" — each quote has 3 narration script variants. Dashboard remembers the last variant used per quote and rotates to the next one. Lets the creator do multiple takes without repeating themselves.

**Today:** Hardcoded as `walkerTalkVariant: 0-2` for 10 quotes.

**Quiet Line-specific bits to strip:** The 10 quotes and 30 narration scripts.

**Generalized form:** N-variant rotation primitive — buyer defines content items, each with N variants (could be 2, 3, 5). Cycler tracks last-used per item. Useful for: daily prompt variants, alternate book pitch versions, A/B subject lines.

**Effort:** ~4 hours.

---

## 10. Canvas Asset Renderer 🔧
**What it does:** Loads a static JPG, applies brightness/saturate/contrast adjustments, layers a per-item color palette as a soft-light overlay, adds vignette. Renders entirely client-side via `<canvas>`. Output is downloadable as personalized social-card image.

**Today:** Bound to the 10 quotes' color palettes (teal, plum, rose, cobalt, etc.).

**Quiet Line-specific bits to strip:** The hardcoded 10-palette mapping.

**Generalized form:** Buyer defines color palette per content item; renderer applies dynamically. Becomes "personalized asset generation per content item" — useful for any creator who needs branded social cards without pre-baking them in Photoshop.

**Effort:** ~1 day. Canvas code is the dense part; making palettes user-configurable is the easy part.

---

## 11. Teleprompter 🔧
**What it does:** Full-screen scrolling text reader with speed (px/sec), font size, mirror-flip controls. Designed for recording on-device while reading a script. Tap to start/pause; speed adjustment during scroll.

**Today:** Reads from "Walker Talk" scripts.

**Quiet Line-specific bits to strip:** None — the teleprompter component itself is fully generic.

**Generalized form:** `<CobbleTeleprompter script={...} />` — drop-in component. Could be its own micro-product even outside the Cobble Creator pattern.

**Effort:** ~4 hours to extract and parameterize.

---

## 12. AI Prompt Display 🔧
**What it does:** Shows the day's AI photography prompt with art direction. Buyer copies it before regenerating an image (paste into Midjourney, DALL-E, etc.). Pattern is: prompt is generated/selected → user copies → user regenerates externally → user uploads result back.

**Today:** Quiet Line uses pre-written prompts per quote.

**Quiet Line-specific bits to strip:** The Quiet-Line prompt library.

**Generalized form:** Either (a) buyer provides their own prompt library, or (b) Cobble pipes the buyer's daily focus content through Anthropic to generate fresh prompts. Option (b) plugs into the shared AI provider abstraction (see Cobble Outreach's prompt registry).

**Effort:** ~6 hours for option (a); ~1.5 days for option (b).

---

## Summary tables

### Shared core candidates (`@cobble/core`)

| Component | Reuse pattern across patterns |
|---|---|
| PWA Shell | All three patterns can deliver as PWA |
| Sync Layer | All three patterns need cross-device state persistence |
| Auth | All three patterns need OAuth + user-keyed storage |
| Timestamped Notes | Visit notes (Ops), lead notes (Outreach), contact notes (Creator) |

### Creator-specific components

| Component | What makes it Creator-unique |
|---|---|
| Daily Focus Picker | Daily-ritual UX is the Creator pattern's signature |
| Pipeline Tracker | Creator's CRM view; Outreach has its own version |
| Contact Detail Modal | Schema-driven, but Creator's schema differs from Ops/Outreach |
| Call Session Wizard | Daily-call ritual specific to creator outreach pace |
| Variant Cycler | Multi-take content production is a creator workflow |
| Canvas Asset Renderer | Personalized social cards is a creator workflow |
| Teleprompter | Content production tool — creator-specific |
| AI Prompt Display | Creator-specific content prompt pattern |

### Total extraction effort estimate

| Tier | Components | Time |
|---|---|---|
| Shared core | PWA Shell, Sync Layer, Auth, Timestamped Notes | ~4-5 days |
| Creator-specific | All 8 Creator components above | ~7-9 days |
| Strip Quiet Line content | Remove 10 quotes, 41 centers, recovery-center stage names | ~1 day |
| Buffer / testing | | ~2 days |
| **Total runway** | | **~14-17 days (≈3 weeks)** |

This is ~1 week more than the original 2-week estimate. The original estimate didn't fully account for the schema-driven pipeline/contact work or building the auth layer.

---

## Architectural decision worth flagging

Should the **shared core** be built as part of the Creator extraction, or only when the second pattern (Ops) extraction begins?

- **Build now:** higher upfront cost (~4-5 extra days), but Ops and Outreach inherit it cleanly.
- **Build later:** Creator ships faster, but we likely refactor when Ops/Outreach reuse hits.

**Recommendation: build the shared core during Creator extraction.** The components are concrete enough (Sync, Auth, PWA, Notes) that designing them in isolation now is low-risk, and avoids the second-system rewrite trap.
