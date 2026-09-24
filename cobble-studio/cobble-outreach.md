# Cobble Outreach — Component Inventory

*Derived from `virginias-view` (real-estate newsletter + AI outreach dashboard) and `geha-outreach` (scraping + enrichment patterns).*

**Architecture summary:** Two coordinated halves in one product. **(1) Python CLI** that turns a CSV of contacts into branded newsletter PDFs/HTML using Jinja2 + WeasyPrint. **(2) TypeScript serverless dashboard** on Vercel — 12 production API endpoints covering OAuth, lead management, AI copy generation, Gmail drafting, reply summarization, bulk send, tracking, and spend caps. **Google Sheets serves as the CRM** (no traditional database). **Upstash Redis** tracks monthly spend and activity log. **Anthropic** is the LLM (8 reusable prompts in a registry). `geha-outreach` adds Cheerio-based lead scraping with KV-cached enrichment.

**Tag legend:**
- 🔧 **Outreach-core** — essential to the Cobble Outreach pattern
- ♻️ **Shared** — candidate for `@cobble/core`
- 🗑️ **Strip** — vertical-specific (real estate / federal union), removed from the pattern
- 🆕 **New** — to be built as part of productization

---

## 1. CSV Import + Field Mapping ♻️
**What it does:** Reads a CSV of contacts (currently Paragon 5 real-estate export format), normalizes columns, validates required fields, dedupes, writes to the working dataset.

**Today:** Hardcoded Paragon 5 column names ("Mailing Address," "Primary Agent," etc.).

**Vertical-specific bits to strip:** Paragon 5 column mappings.

**Generalized form:** User uploads any CSV → UI presents column-mapping wizard (map source columns to canonical fields: name, email, phone, address, custom fields). Save mapping as named template for reuse.

**Effort:** ~1.5 days.

**Reuse:** Shared across Outreach and Ops (Ops imports customer lists).

---

## 2. Newsletter Template System 🔧
**What it does:** Jinja2 templates render a contact's data into a branded HTML page. WeasyPrint converts the HTML to PDF. Templates support per-section variants (intro, market data, listings, sign-off), color/brand variables, image embedding.

**Today:** Templates are real-estate-shaped (market stats, MLS listings, agent bio).

**Vertical-specific bits to strip:** Real-estate sections.

**Generalized form:** A library of starter templates per vertical (real estate, financial advisor, recruiter, fundraiser). Each is a Jinja2 file the buyer customizes. The rendering engine is fully generic.

**Effort:** ~2 days to extract engine + write 3-4 starter templates.

---

## 3. Branded Newsletter PDF/HTML Output 🔧
**What it does:** Output formats — print-ready PDF (CMYK-aware) and email-safe HTML. Brand tokens (colors, fonts, logo) injected at render time.

**Today:** Mostly generic; brand tokens are hardcoded per Virginia's View deployment.

**Generalized form:** Brand tokens read from tenant config. Plugs into the `@cobble/brand-tokens` package shared across all three patterns.

**Effort:** ~0.5 day.

---

## 4. OAuth (Google) ♻️
**What it does:** Google OAuth flow, refresh-token handling, scoped access (Gmail send/read, Sheets read/write). Token storage in Upstash, encrypted.

**Today:** Production-grade; serves dashboard auth, Gmail access, Sheets access.

**Generalized form:** `@cobble/google-auth` — extracted as standalone module. Shared with any future pattern that integrates Google services.

**Effort:** ~1 day to extract.

---

## 5. Google Sheets as CRM Adapter 🔧
**What it does:** Treats a Google Sheet as the CRM database — reads/writes contact rows, status columns, last-touched timestamps. Owner can open the Sheet directly to view/edit data. Real-time sync via Sheets API.

**Today:** Hardcoded to a specific sheet structure (real-estate lead schema).

**Vertical-specific bits to strip:** Sheet schema.

**Generalized form:** `@cobble/sheets-crm` — adapter that takes a sheet ID + a schema config (which columns map to which canonical fields). Powerful because it gives SMB buyers a zero-DB CRM they already know how to use.

**Effort:** ~2 days. Schema mapping + read/write helpers + change watcher.

**Reuse:** Could be reused in Ops as an alternative to Supabase for customer roster (for buyers who don't want a database).

---

## 6. Lead Management Endpoints 🔧
**What it does:** REST endpoints — `GET /leads`, `POST /leads`, `PATCH /leads/:id`, `DELETE /leads/:id`. Backed by Google Sheets adapter. Owner UI consumes these.

**Today:** Generic enough.

**Generalized form:** Same endpoints, schema-configurable.

**Effort:** ~1 day to harden + document.

---

## 7. Anthropic Prompt Registry ♻️
**What it does:** Eight reusable prompts (email_first_touch, follow_up_friendly, follow_up_assertive, reply_summary, lead_research, etc.) stored as versioned templates. Each prompt has variables, a system prompt, recommended model, expected token count. Calls Anthropic with cost tracking.

**Today:** Prompts are Outreach-specific in copy but the registry pattern is generic.

**Generalized form:** `@cobble/prompt-registry` — the registry mechanism itself. Each pattern ships its own prompt library on top:
- Outreach prompts: email drafts, reply summaries, lead research
- Ops prompts: photo verification, route optimization, customer comms
- Creator prompts: content variants, photo prompts, post drafts

**Effort:** ~1 day to extract registry; prompts themselves stay vertical-specific.

**Reuse:** Massive. Foundation for AI in all three patterns.

---

## 8. AI Copy Generation Endpoint 🔧
**What it does:** `POST /generate` — given a lead ID and a prompt name, generates personalized email copy. Returns draft + token usage.

**Today:** Calls Anthropic via the prompt registry.

**Generalized form:** Same endpoint, pluggable LLM provider (Anthropic / OpenAI / local). The registry handles model selection.

**Effort:** ~1 day to add provider plug.

---

## 9. Gmail Draft Creation 🔧
**What it does:** Generated copy is pushed into the user's Gmail as a draft (not sent automatically). User reviews in their normal Gmail UI, hits send when ready. Reduces send-anxiety; integrates with how users already work.

**Today:** Production-grade, fully working.

**Generalized form:** No changes needed; this is the Outreach pattern's killer integration. Most outreach tools force you into their UI; Outreach uses Gmail as the actual interface.

**Effort:** ~0 days. Already generic.

---

## 10. Bulk Send / Blast Engine 🔧
**What it does:** `POST /blast/preview` — generates drafts for N selected leads, returns preview. `POST /blast/send` — actually sends (or drafts to Gmail). Rate-limited, spend-capped, supports throttling (e.g., 1 every 30 seconds to avoid spam flags).

**Today:** Production-grade.

**Generalized form:** Same engine, configurable rate limits per tenant plan.

**Effort:** ~0.5 day.

---

## 11. Reply Summarization (AI) 🔧
**What it does:** Scans Gmail for replies to outgoing campaign emails. Each thread → AI summary (sentiment, intent, suggested next action). Owner sees a daily digest: "12 replies — 4 positive, 6 questions, 2 unsubscribes — here's what each wants."

**Today:** Production-grade, used daily.

**Generalized form:** No changes needed beyond pluggable LLM.

**Effort:** ~0 days.

**Reuse beyond Outreach:** High value — Ops could use it for customer email triage.

---

## 12. Tracking Pixel + Open Detection 🔧
**What it does:** Each outgoing email embeds a 1x1 pixel pointing to `/track/:campaign/:lead`. When the pixel is fetched, open is logged. UI shows open rates per campaign and per lead.

**Today:** Production-grade.

**Generalized form:** No changes needed.

**Effort:** ~0 days.

---

## 13. Monthly Spend Cap ♻️
**What it does:** Every AI call adds its cost to a monthly running total in Upstash. If the tenant's monthly cap is reached, further AI calls are blocked with a clear error. UI shows usage as a progress bar. Resets on the 1st.

**Today:** Production-grade. Anthropic-only.

**Generalized form:** `@cobble/spend-cap` — model-pricing-aware, multi-provider, per-tenant. Reused by all three patterns (every pattern uses AI = every pattern needs cost control).

**Effort:** ~1 day to extract as standalone module.

**Reuse:** All three patterns.

---

## 14. Activity Log ♻️
**What it does:** Every meaningful action — copy generated, draft created, email sent, reply received — logged to Upstash with timestamp + actor + entity. Powers a "what happened this week" view.

**Today:** Generic structure.

**Generalized form:** `@cobble/activity-log` — drop-in for any pattern that needs an audit trail.

**Effort:** ~0.5 day.

**Reuse:** All three patterns.

---

## 15. Overview Dashboard (Analytics) 🔧
**What it does:** Owner home view — sends-this-week, opens, replies, pipeline movement, AI spend bar. Charts via simple SVG.

**Today:** Real-estate-shaped KPI labels.

**Generalized form:** Buyer-configurable KPI tiles drawn from the activity log + lead-management data.

**Effort:** ~1.5 days.

---

## 16. Settings UI 🔧
**What it does:** Per-tenant config — sender name, sender email, brand colors, sheet ID, AI provider, spend cap, scheduling windows, OAuth re-connect.

**Today:** Generic enough.

**Generalized form:** Same UI, schema-driven.

**Effort:** ~0.5 day.

---

## 17. Lead Scraping + Enrichment 🔧 *(from geha-outreach)*
**What it does:** Given a URL or a search query, Cheerio scrapes the page, extracts contact info, enriches the lead row. Results are KV-cached so repeat scrapes are free. Used to bulk-enrich a sparse lead list before outreach.

**Today:** Hardcoded selectors for specific union/federal employee directories (geha-outreach context).

**Vertical-specific bits to strip:** Site-specific selectors.

**Generalized form:** A scrape-rule library — declarative selectors per site. Buyer-configurable. AI-augmented fallback: when no rule matches, hand the page to Claude and ask "extract any contact info as JSON."

**Effort:** ~2 days. The AI fallback is the new bit and makes this 10× more useful.

---

## 18. Pluggable LLM Provider 🆕 *(new — to be built)*
**What it does:** Today, Outreach calls Anthropic directly. Add an abstraction so the user can pick provider (Anthropic / OpenAI / local Ollama). Same prompt registry, different backend.

**Why now:** Some buyers will already have OpenAI accounts; some will want cheaper models for high-volume tasks.

**Effort:** ~1.5 days.

---

## 19. A/B Subject Line Testing 🆕 *(new — to be built)*
**What it does:** Generate N subject-line variants per campaign; auto-route 20% of sends to each variant; pick the winner based on open rate; route the remaining 80% to the winner.

**Why now:** Real outreach pros do this manually; automating it is a real value-add.

**Effort:** ~2 days.

---

## Summary tables

### Shared core candidates (`@cobble/core`)

| Component | Reuse pattern across patterns |
|---|---|
| CSV Import + Field Mapping | Ops (customer import), Outreach (lead import) |
| Google OAuth | All three patterns when integrating Google services |
| Anthropic Prompt Registry | All three patterns (each ships its own prompt library) |
| Monthly Spend Cap | All three patterns |
| Activity Log | All three patterns |
| Google Sheets CRM Adapter | Optional Ops alternative for non-DB buyers |

### Outreach-specific components

| Component | What makes it Outreach-unique |
|---|---|
| Newsletter Template System | Print/HTML mass communication is Outreach territory |
| Branded Newsletter Output | Same |
| Lead Management Endpoints | Lead-centric data model |
| AI Copy Generation Endpoint | Outreach-specific prompts |
| Gmail Draft Creation | The killer integration — outreach-native |
| Bulk Send / Blast Engine | Mass outreach by definition |
| Reply Summarization | Inbox-management for high-volume outreach |
| Tracking Pixel + Open Detection | Campaign analytics |
| Overview Dashboard | Outreach KPIs |
| Settings UI | Outreach config surface |
| Lead Scraping + Enrichment | Lead-acquisition workflow |

### New components to build

| Component | Why now |
|---|---|
| Pluggable LLM Provider | Buyer flexibility + cost control |
| A/B Subject Line Testing | Real value-add that pros do manually today |

### Total extraction effort estimate

| Tier | Components | Time |
|---|---|---|
| Shared core (delta beyond Creator + Ops extractions) | CSV mapper, prompt registry, spend cap, activity log, sheets adapter | ~6 days |
| Outreach-specific extraction + de-vertical-ing | All 11 Outreach components above | ~11 days |
| New components | LLM provider plug, A/B testing | ~3.5 days |
| Buffer / testing / deploy | | ~2.5 days |
| **Total runway** | | **~23 days (≈4.5 weeks)** |

This is ~2 weeks more than the original 2-3 week estimate. The original undercounted the Python newsletter pipeline work and the shared-core extractions.

---

## Architectural decisions worth flagging

**1. The Gmail-draft pattern is genuinely differentiated.** Most outreach tools force you into their dashboard to manage replies. Outreach uses Gmail as the actual inbox — users live in Gmail, the dashboard just orchestrates. Lead with this in marketing.

**2. Google Sheets as CRM is the "anti-feature" feature.** SMB buyers fear databases. Telling them "your CRM is just a Google Sheet you can open and edit anytime" lowers the buying friction dramatically. Worth keeping even when the schema-driven version exists.

**3. The shared core builds up across patterns.** By the time Outreach extraction begins (after Creator and Ops), most of the shared core (Auth, Sheets adapter, Spend Cap, Activity Log, Prompt Registry) already exists. Outreach's effort estimate assumes those are done.

**4. AI provider abstraction is the cleanest single AI investment.** All three patterns need it; building it once during Outreach extraction means Creator and Ops inherit it free.
