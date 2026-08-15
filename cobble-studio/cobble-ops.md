# Cobble Ops — Component Inventory

*Derived from `glisten-pools-app` (multi-tenant pool-service SaaS).*

**Architecture summary:** Multi-tenant SaaS — React + Vite + TypeScript PWA on the frontend, Supabase (PostgreSQL + Row-Level Security + Auth) on the backend, Tailwind for styling. Two distinct app surfaces in one repo: **owner dashboard** (desktop-first, web) and **worker PWA** (mobile-first, offline-capable). Tenant isolation is enforced at the database level via RLS policies keyed on `tenant_id`. Stripe and Mapbox are staged (schema and code present) but not yet deployed.

**Tag legend:**
- 🔧 **Ops-core** — essential to the Cobble Ops pattern
- ♻️ **Shared** — candidate for `@cobble/core`
- 🆕 **New** — to be built as part of productization, not extraction

---

## 1. Multi-Tenant Database Schema with RLS ♻️
**What it does:** Every table is partitioned by `tenant_id`; Postgres RLS policies enforce that a tenant's session can only see/write its own rows. No application-layer filtering needed — security is at the database. Core tables: `tenants`, `users`, `techs`, `customers`, `visits`, `visit_items`, `subscriptions`, `devices`.

**Today:** Pool-specific extras: `visit_items.kind` enum includes `chemical_add`; `customers.service_day` is a weekday enum.

**Pool-specific bits to strip:** `chemical_add` kind value (rename to generic `service_log`), the rigid weekday `service_day` enum.

**Generalized form:** A `@cobble/multitenant-supabase` scaffold — base table set (`tenants`, `users`, `customers`, `visits`, `visit_items`), RLS policy templates, migration patterns. Reused by Cobble Outreach (multi-tenant lead lists), potentially by Creator if/when it goes self-serve.

**Effort:** ~1.5 days. The schema is clean; the work is parameterizing the migration set and writing the RLS template doc.

---

## 2. Device-Bound JWT Auth (Worker) 🔧
**What it does:** Field workers don't have email accounts to sign into. Owner registers a tech in the dashboard → generates a one-time device-bind link → tech opens it on their phone once → server issues a long-lived JWT tied to that device. No `auth.users` row needed; no password.

**Today:** Implemented in `glisten-pools-app/api/auth/device-bind`. Plays a critical role — pool techs and lawn techs and HVAC techs all have the same problem.

**Pool-specific bits to strip:** None — this auth pattern is fully generic.

**Generalized form:** `@cobble/device-auth` — drop-in module for any pattern serving workers without business email. This is one of the **strongest** reusable assets in Ops because it solves a real industry problem (workers don't want one more email/password).

**Effort:** ~1 day to extract as standalone module.

**Reuse beyond Ops:** Massive. Field service businesses universally have this problem.

---

## 3. OAuth Auth (Owner) ♻️
**What it does:** Standard Supabase Auth — email/magic-link or Google OAuth — for tenant owners + dashboard admins.

**Generalized form:** Same as the `@cobble/auth` module proposed for Creator. Owner-side Auth in Ops and user-side Auth in Creator/Outreach all share the same primitive.

**Effort:** Counted under Creator extraction; no extra cost here.

---

## 4. GPS-Verified Photo Capture 🔧
**What it does:** The signature feature. Worker arrives at customer site → opens "start visit" → app requests browser geolocation, checks distance from customer's stored lat/lng, blocks or warns if too far. Then opens device camera, captures photo, attaches EXIF + GPS + timestamp + worker ID, uploads to Supabase Storage. The photo is the proof of work.

**Today:** Built around pool servicing flow — photo per chemical add.

**Pool-specific bits to strip:** Photo prompts ("show pool water," "show test strip").

**Generalized form:** Buyer configures what photos are required per visit type (lawn care: before/after; HVAC: serial number plate; cleaning: before/after key rooms). The verification engine (GPS check + EXIF stamp + storage path) stays identical.

**Effort:** ~2 days. Photo-prompt configurability is the new bit; the engine is already done.

**Reuse beyond Ops:** Limited — this is the Ops differentiator.

---

## 5. Live Crew Map 🔧
**What it does:** Owner-facing dashboard view — every active tech's last GPS position plotted on a Mapbox map, with a status badge (on-route, on-site, done) and route trail for the day. Auto-refreshes.

**Today:** Mapbox is staged (token in env, components present) but not deployed.

**Generalized form:** Mostly already generic — works for any worker-on-route business. Needs deployment, not abstraction.

**Effort:** ~1.5 days. Mostly Mapbox account setup, token wiring, and one round of UX polish.

**Reuse beyond Ops:** Low — Outreach and Creator don't have field workers.

---

## 6. Visit / Proof Log 🔧
**What it does:** Per-customer history of every visit — date, tech, photos, GPS-verified status, chemical adds (or whatever the buyer's vertical calls it), issues flagged. Owner can audit. Customer can be sent a view-only link as proof.

**Today:** `visits` and `visit_items` tables. `visit_items.kind` includes `chemical_add` with pool-specific fields (chemical type, amount).

**Pool-specific bits to strip:** Chemical-add UI, chemical inventory.

**Generalized form:** Polymorphic `visit_items.kind` with buyer-defined item types. Lawn care: `treatment_log` (product, area). HVAC: `service_log` (parts, hours). Cleaning: `task_log` (rooms, completion). One table, JSON-typed payload per kind, schema config per tenant.

**Effort:** ~2 days. Polymorphic item kinds + buyer schema config.

---

## 7. Customer Roster 🔧
**What it does:** CRUD for the tenant's customers — name, address (geocoded), phone, email, billing info, service recurrence pattern. Click into detail → visit history + notes.

**Today:** `service_day` is a rigid weekday enum (Mon/Tue/.../Sun).

**Pool-specific bits to strip:** The weekday enum.

**Generalized form:** Replace with iCal-style RRULE-lite recurrence (`every 2 weeks on Tuesday`, `every month on the first Monday`, etc.). Drives route generation.

**Effort:** ~2 days. Recurrence is non-trivial but library code (rrule.js) exists.

---

## 8. Today's Route View (Worker) 🔧
**What it does:** Worker logs in → sees today's stops in optimal order (currently address-distance optimized, not traffic-aware). Each stop is a card: customer name, address, expected duration, prior-visit summary. Tap → start visit flow.

**Today:** Route ordering is naive (Euclidean by GPS).

**Generalized form:** Same UI, with pluggable route optimizer (naive today; AI-route-optimization upgrade tomorrow — see #14).

**Effort:** ~1 day.

---

## 9. End-of-Day Completion Flow 🔧
**What it does:** Worker hits "done for the day" → summary screen (X stops, Y photos, Z issues), sync any pending offline-cached visits, prompt to top up gas / restock chemicals (pool-specific today). Owner gets daily summary notification.

**Today:** Restock prompt is pool-specific.

**Pool-specific bits to strip:** Restock chemical inventory.

**Generalized form:** Buyer-configurable end-of-day checklist (restock supplies, refuel vehicle, return to depot, etc.).

**Effort:** ~1 day.

---

## 10. Plan-Based Feature Gating ♻️
**What it does:** Subscription tier (`trial`/`solo`/`crew`/`fleet`) drives which features are unlocked. Trial countdown UI. Upgrade prompts at gate points. Plan limits enforced server-side (max techs, max customers, etc.).

**Today:** Hardcoded plan definitions in code.

**Generalized form:** `@cobble/plan-gating` — plans defined declaratively in config (`{ name, monthly_price, limits: { techs, customers, ... }, features: [...] }`); gate enforcement is a single hook (`usePlanFeature('live_map')`). Useful for all three patterns when any goes self-serve.

**Effort:** ~1.5 days.

---

## 11. Stripe Subscription Mirror ♻️
**What it does:** `subscriptions` table mirrors Stripe state (subscription_id, status, current_period_end, plan). Stripe webhook handler keeps mirror in sync. Customer portal link for billing management. Server-side enforcement reads from mirror, not from Stripe directly (avoids API roundtrip on every request).

**Today:** Scaffolded but not deployed (no live Stripe account).

**Generalized form:** `@cobble/stripe-mirror` — schema + webhook handler + portal link helper. Same for all three patterns when commercialized.

**Effort:** ~1 day to extract; ~0.5 day to deploy live Stripe for Glisten Pools.

---

## 12. Tech / Device Management 🔧
**What it does:** Owner-side UI to add/remove techs, generate device-bind links, revoke devices, see last-seen timestamps.

**Today:** Pool tech terminology.

**Generalized form:** "Worker" replaces "tech" in copy. Same data model.

**Effort:** ~0.5 day (mostly copy).

---

## 13. Issue Flagging 🔧
**What it does:** During a visit, worker can flag an issue (broken equipment, unsafe condition, customer dispute). Flag is a typed entry with photos and notes; routes to owner inbox; can be assigned for follow-up.

**Today:** Issue categories are pool-specific (algae bloom, pump failure, etc.).

**Pool-specific bits to strip:** Issue categories.

**Generalized form:** Buyer-defined issue taxonomy. Same UI + data model.

**Effort:** ~1 day.

---

## 14. AI Route Optimization 🆕 *(new — to be built)*
**What it does:** Replace naive Euclidean route ordering with an LLM-augmented optimizer that accounts for time windows, traffic patterns, tech specialization (e.g., only Maria does pet-friendly chemistry), and historical visit duration.

**Why now:** Adds Cobble's AI angle to a pattern that's otherwise mostly conventional SaaS. Differentiator.

**Effort:** ~3 days. Uses the same Anthropic wrapper as Outreach.

---

## 15. AI Photo Verification 🆕 *(new — to be built)*
**What it does:** After a worker uploads a "completed visit" photo, send it to Claude with a vertical-specific prompt ("Does this look like a properly serviced pool? Reply yes/no/uncertain with one-sentence rationale."). Owner gets a confidence flag on every visit. Suspicious photos get flagged for review.

**Why now:** The proof-of-work pattern becomes 10× stronger with AI verification. Charges a real premium.

**Effort:** ~2 days. Uses Claude vision via the same Anthropic wrapper.

---

## 16. AI Customer Communication Drafts 🆕 *(new — to be built)*
**What it does:** After a flagged issue or a missed visit, draft a customer-facing email/SMS in the owner's tone. Owner reviews, edits, sends.

**Why now:** Closes a real ops loop. Reduces owner workload.

**Effort:** ~1.5 days.

---

## Summary tables

### Shared core candidates (`@cobble/core`)

| Component | Reuse pattern across patterns |
|---|---|
| Multi-Tenant Supabase Schema with RLS | Outreach (lead lists), Creator (if self-serve) |
| OAuth Auth | All three patterns |
| Plan-Based Feature Gating | All three patterns when commercialized |
| Stripe Subscription Mirror | All three patterns when commercialized |
| Device-Bound JWT Auth | Reusable in any future field-service pattern |

### Ops-specific components

| Component | What makes it Ops-unique |
|---|---|
| GPS-Verified Photo Capture | Signature differentiator — proof-of-work |
| Live Crew Map | Field-workers-on-route only |
| Visit / Proof Log | Per-visit work records — Ops-specific shape |
| Customer Roster | Geocoded + recurring service — Ops-specific |
| Today's Route View | Worker-on-route only |
| End-of-Day Completion | Field-work-day specific |
| Tech / Device Management | Worker-roster management |
| Issue Flagging | Field-incident reporting |

### New components to build

| Component | Why now |
|---|---|
| AI Route Optimization | Cobble's AI differentiator |
| AI Photo Verification | 10× the proof-of-work value proposition |
| AI Customer Comm Drafts | Closes a real owner workload loop |

### Total extraction effort estimate

| Tier | Components | Time |
|---|---|---|
| Shared core (delta beyond Creator extraction) | Multi-tenant schema, Plan gating, Stripe mirror, Device auth | ~5 days |
| Ops-specific extraction + de-pool-ing | All 8 Ops components above | ~10 days |
| New AI components | Route opt, Photo verify, Comm drafts | ~6.5 days |
| Buffer / testing / live Stripe + Mapbox deploy | | ~3 days |
| **Total runway** | | **~24-25 days (≈5 weeks)** |

This is ~2 weeks more than the original 3-week estimate. The delta is mostly the AI components, which weren't in the original count but are essential to the "Cobbled Works' AI angle on this pattern" line in the strategy plan.

---

## Architectural decisions worth flagging

**1. Device-Bound JWT is a hidden gem.** This component alone could justify selling Cobble Ops to verticals well beyond pool service (lawn care, HVAC, cleaning, mobile detail, salon, pet care) — workers without email is a *universal* field-service problem. Worth marketing prominently in the Ops one-pager.

**2. AI components are mandatory, not optional.** Without them, Cobble Ops is ServiceTitan-lite at 1/10 the price. With them, it's a category creator. Don't ship the Ops pattern without at least Photo Verification.

**3. Polymorphic `visit_items` is the key abstraction.** Getting the buyer-defined visit-item schema right is what makes Ops actually vertical-agnostic. This is the single highest-risk abstraction in the extraction.
