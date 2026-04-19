# Tristian Walker — Design System

> *From drift to direction — one honest reckoning at a time.*

This design system powers the visual and editorial world of **Tristian Walker**, motivational speaker, advisor, and author of *The Quiet Line*. The brand is built around a single mission: to be the arbiter of **self-agency, self-reliance, and personal & professional growth** — with the long arc pointing toward Tristian's work as a full-time professional motivational speaker.

The brand is warm, welcoming, and engaging. It is literary, not corporate. It is adult, measured, uplifting. It asks the reader to sit with something honest, then hands them a way forward.

---

## Index — What's in this folder

| File | What it's for |
|---|---|
| `README.md` | This file. Brand context, content + visual foundations, iconography notes. |
| `SKILL.md` | Agent skill manifest. Makes this system invocable in Claude Code. |
| `colors_and_type.css` | All tokens: color vars, type vars, semantic classes, shadows, radii, easings. |
| `assets/` | Logos, favicons, icon sprites, illustrations, hero images. |
| `fonts/` | Local `.ttf`/`.woff2` files *(currently using Google Fonts CDN — see note below)*. |
| `preview/` | Small HTML cards that render the design system in the project's Design System tab. |
| `ui_kits/book-site/` | High-fidelity recreation of [thequietlinebook.com](https://thequietlinebook.com) — the book marketing site. |
| `ui_kits/lecture/` | High-fidelity recreation of the *Professional Drift* lecture landing page. |
| `SKILL.md` | Compatibility manifest for use as a downloadable Claude Code skill. |

### Source repos

- **Book site** — `sarastrist-crypto/the-quiet-line-book` (main). React + Vite landing page for *The Quiet Line*. Source of truth for the core brand palette (`src/index.css`) and the "warm, literary" side of the brand.
- **Lecture site** — `sarastrist-crypto/Lecture-Series-Quiet-Line-Home-Page-` (main). A standalone, more typographic lecture landing. Source of truth for the larger, more dramatic Playfair Display treatment and the "curated residency" editorial voice.

Both are public GitHub repos belonging to `sarastrist-crypto`. Nothing here requires access to read.

---

## Content Fundamentals

The voice is **measured, literary, and adult**. It doesn't shout. It doesn't use startup-speak. It reads like a thoughtful author who happens to lead things — because that's what Tristian is.

### Tone

- **Reflective, never breathless.** "Some careers don't collapse — they quietly drift." Not "Unlock your potential!"
- **Honest reckoning > hype.** The brand names the quiet, uncomfortable thing first ("professional drift", "the wall of anonymity", "character decay") and offers the reframe second.
- **Warm authority.** The reader is a peer and a high-performer, not someone being saved. "If you've ever felt capable but disconnected…"
- **Uplifting underneath.** Even the darkest observation is framed as something you can come back from. "The fact that you notice the disconnection means the part of you that knows why you chose a life of service is still awake."

### Pronouns & Address

- "You" is used often, directly, but never accusatorily — always as a mirror.
- "I" appears from Tristian personally in author notes ("I value your inbox as much as my own.").
- "We" is rare; avoid marketing "we."

### Casing

- **Body copy:** Sentence case. Serif em-dashes — never double hyphens.
- **Micro-labels / eyebrows / tags:** ALL CAPS with wide letter-spacing (0.3em–0.8em). These are heavily used.
- **Headings:** Title case OR sentence case with a **single italic phrase** inside, e.g. "The Foundation *is Character*." The italic-inside-serif is the brand's signature typographic move.
- **Section numbers:** "Segment 01", "Signal 01", "01 / Definition". Numbered, two digits, narrative.

### Punctuation

- Full stops on hero taglines ("The Quiet Line.") — the period is a design element.
- Em-dashes with spaces: " — ".
- Pull-quotes in curly quotes.
- Section numbers often followed by " / " or " · " in all-caps contexts.

### Emoji, hashtags, exclamation

- **No emoji.** Zero. The brand is literary.
- **No hashtags.**
- **Exclamation points are rare.** At most one, for a genuine moment of warmth (e.g. "Success! Check your inbox for the first chapter.").

### Vibe

Think: a thoughtful non-fiction author's book jacket. *Atomic Habits* meets *The Artist's Way* meets a boutique hotel's welcome letter. Unhurried. Intentional. Human.

### Recurring brand phrases

- "The Quiet Line"
- "Natural authority"
- "Professional drift"
- "Disciplined range"
- "Honest reckoning"
- "From drift to direction"
- "Motion vs. Movement"
- "Presence / Character / Hospitality"
- "Reserve your seat"

---

## Visual Foundations

### Colors

A **warm, earthen** palette — no cool blues, no neon. The background hum is **cream / parchment**; the accent is **burnt sienna / warm ochre**; the deepest ink is a **warm brown-black**, not a true black.

| Role | Hex | Notes |
|---|---|---|
| `--bg-base` | `#F8F5EF` | Soft warm cream. The default page surface. |
| `--bg-surface` | `#FFFFFF` | Lifted surfaces (cards on cream). |
| `--bg-parchment` | `#FDFCF8` | Lecture-site parchment. Slightly warmer white. |
| `--bg-dark` | `#312D29` | Warm dark grey/brown (dark trust bars). |
| `--bg-ink` | `#1A1A1A` | The lecture site's deep ink. Warm near-black. |
| `--accent-primary` | `#BC744E` | Burnt sienna. Primary brand accent. Used for CTAs, italicized accent text, hairline dividers. |
| `--accent-hover` | `#A05E3D` | Darker sienna for hovers. |
| `--accent-tan` | `#C4A484` | Soft tan (lecture-site primary). A second, quieter accent. |
| `--accent-warm` | `#E6DFD6` | Cashmere beige. Used as a soft section background. |
| `--text-main` | `#2D2925` | Near-black warm grey for body text. |
| `--text-muted` | `#5C554D` | Mid warm grey for secondary copy. |
| `--text-light` | `#F8F5EF` | Cream for text on dark surfaces. |
| `--trust-grey` | `#A8A196` | The warm grey used on dark trust bars and footers. |

**Principles:**
- Imagery, when present, runs **warm** — warm light, golden-hour, a hint of grain. Never cool, never blue-graded, never over-saturated.
- Gradients are **subtle and directional**, never rainbow. `linear-gradient(135deg, #fff 0%, #fcf9f5 100%)` is representative. Acceptable gradient uses: parchment-to-cream hero backgrounds, dark ink radial glows for drama, faint sunrise-to-transparent washes at section tops.
- Avoid: blue-purple SaaS gradients, fluorescent anything, cold greys.

### Type

Two typographic worlds live together, and both are valid:

**World A — "The Book" (warm & literary):**
- Display: **Merriweather** (serif, 700 / 300 / italic)
- Body: **Lato** (sans, 300 / 400 / 700 / italic 400)
- Used on: the book marketing site, author notes, premise/story sections.

**World B — "The Lecture" (editorial & dramatic):**
- Display: **Playfair Display** (serif, 700 / 900 / italic 700)
- Body: **Inter** (sans, 400 / 500 / 700)
- Used on: the Professional Drift lecture page, slide decks, big-stage editorial moments.

Both are loaded from **Google Fonts CDN** today. Local `.ttf`/`.woff2` files are NOT checked into `fonts/` yet — see **Font Substitution Note** below.

**Type rules:**
- Headings are serif. Body is sans. No exceptions.
- The brand's signature move: a serif heading with **one italic phrase** inside it (non-italic + italic on the same line).
- "Eyebrow" / tag labels are always sans, ALL CAPS, wide letter-spacing (0.15em minimum; 0.3em–0.6em is common), small (9–11px), often in `--accent-primary` or muted grey.
- Hero type goes *large*: `clamp(3.5rem, 7vw, 5.5rem)` on the book hero; up to `10rem` on the lecture close.
- Body line-height: 1.6 for sans body; 1.8 for longer-form serif-leaning paragraphs.
- Italic = meaning, not decoration. Italic phrases carry emotional weight.

### Spacing, radii, shadow

- **Spacing scale:** 0.5 / 1 / 1.5 / 2 / 2.5 / 3 / 4 / 5 / 6 / 8 rem. Generous vertical rhythm — `section` padding is typically `5rem`–`8rem` top/bottom.
- **Radii:** `6px` (buttons, inputs), `12px` (standard cards), `16px` (feature cards), `24–64px` (large glass panels on the lecture site). Radii get dramatically larger in editorial contexts.
- **Shadow system:**
  - `--shadow-sm`: `0 2px 4px rgba(0,0,0,0.05)` — subtle card lift
  - `--shadow-md`: `0 10px 30px rgba(0,0,0,0.08)` — capture cards
  - `--shadow-lg`: `0 20px 40px rgba(0,0,0,0.12)` — portrait & key imagery
  - `--shadow-xl`: `0 40px 80px rgba(0,0,0,0.12)` — hover-levitated feature cards
  - `--shadow-book`: `0 30px 60px rgba(0,0,0,0.15)` — THE book cover drop-shadow
  - Accent-tinted shadow on primary buttons: `0 4px 12px rgba(188,116,78,0.25)` (hover → `0 6px 16px rgba(188,116,78,0.35)`)
- **Borders:** thin, warm. `1px solid rgba(0,0,0,0.05)` for dividers. `1.5px` on inputs and outline buttons. `4–5px` on emphasis left-borders ("Who it is for" panels). "Thick top-border of accent" is a recurring motif on dark trust bars (`border-top: 5px solid var(--accent-primary)`).

### Backgrounds & Motifs

- **Dot grid.** Radial-gradient dot pattern (`radial-gradient(#dcdcdc 1px, transparent 1px)`, `background-size: 32px 32px`) appears on lecture pages, often at 5–10% opacity over dark surfaces. Signature texture.
- **Warm gradient heroes.** Gentle cream-to-parchment washes, or dark ink with a radial sunrise glow from the top-center.
- **Full-bleed imagery** is rare; most imagery is **contained and framed** — e.g. the book cover in its own drop-shadowed box, the author portrait rounded 12px.
- **Hairline dividers** under eyebrow tags, using `--accent-primary` at ~30% opacity, 1px tall, 30–200px wide. Very, very common.
- **Glass panels** on the lecture site: `rgba(255,255,255,0.85)` + `backdrop-filter: blur(20px)` + `1px solid rgba(196,164,132,0.15)` — used on "Surgical Distinction" and "Where is the drift loudest" panels.
- No repeating patterns or busy textures beyond the dot grid.
- No hand-drawn illustrations (yet — room to grow).

### Animation

- **Easing:** `cubic-bezier(0.25, 0.8, 0.25, 1)` for standard transitions; `cubic-bezier(0.16, 1, 0.3, 1)` for the long "levitate" ease on feature cards.
- **Durations:** 200–300ms for micro-interactions; 400–600ms for lifts; 1200ms for scroll-reveal fade-ins.
- **Motion patterns:**
  - **Levitate** — cards translate up `-10px` to `-12px` on hover with an enlarged soft shadow. The book cover does this too.
  - **Scroll fade-in** — sections start `opacity: 0; translateY(40px)` and settle to `0` as they enter viewport.
  - **Button hover** — primary buttons translate up `-2px` AND shift to `--accent-hover` AND shadow grows.
- **No bounces, no springy overshoots, no parallax.** The brand is measured.

### Hover & press states

- **Primary button:** bg darkens from sienna → darker sienna; `translateY(-2px)`; shadow grows.
- **Outline button:** fill with `--accent-soft` (12% sienna); border + text shift to accent; `translateY(-2px)`.
- **Text link:** color transitions to `--accent-primary` on hover. A soft underline at `opacity: 0.5` is acceptable.
- **Cards:** levitate (see above) + shadow grows. No color fills.
- **Press:** `active:scale(0.95)` on circular icon buttons. No scale shift on rectangular CTAs.

### Transparency & blur

- Used **purposefully** and sparingly. The "glass panel" treatment is reserved for dramatic, floating feature cards on the lecture page, NOT for every card.
- Floating audio bar at bottom of lecture page uses `rgba(26,26,26,0.95)` + `blur(10px)`.
- Nav darkens to `rgba(255,255,255,0.9)` + `1px sienna-tinted bottom border` when scrolled.

### Corner radii recap

| Usage | Radius |
|---|---|
| Inputs, small buttons | `6px` |
| Standard cards | `12px` |
| Feature cards | `16px` |
| Large floating panels (lecture) | `3rem`–`4rem` (48–64px) |
| Circular play buttons | `100%` |
| Pill tags | `100px` |

### Cards

The brand has **two** card types:

1. **Warm content card** (book site): `background: white`, `border-radius: 12–16px`, `box-shadow: --shadow-sm` or `--shadow-md`, hairline border `1px solid rgba(0,0,0,0.03)`, generous `3rem` padding.
2. **Editorial glass card** (lecture site): `background: rgba(255,255,255,0.85)`, `backdrop-filter: blur(20px)`, larger radii (24–64px), shadow `0_50px_100px_rgba(0,0,0,0.1)`, sits on parchment with dot-grid behind.

### Layout rules

- Max content width: **1200px**; editorial & narrative blocks ladder down to **800px** or **720px** for readability.
- Sections: `padding: 8rem 0` (book site) or `py-40`–`py-60` (lecture site).
- Two-column hero grid: `1fr 1fr`, gap `4rem`.
- Mobile: everything collapses to single-column at `900px`; nav hides at `768px`.
- Sticky header, visible footer. Nothing ever floats permanently except the (optional) audio bar on the lecture page.

---

## Iconography

See the **ICONOGRAPHY** section below for details.

### Approach

The brand uses **very little iconography.** This is intentional. The visual weight is carried by:
1. **Type** (the italic phrase, the numbered label)
2. **Numerals** ("01", "02", "03" as display elements — often Merriweather or Playfair italic)
3. **Hairline dividers and accent lines**

Where icons do appear, they are **thin-stroke, abstract, 1.5px line-weight** (e.g. the compass / lock icons on the lecture page). Outline-only; never filled.

### Icon sources

- The project's own `public/icons.svg` sprite (copied to `assets/legacy-icons.svg`) — contains social icons (X, GitHub, Discord, Bluesky) and a few UI icons, originally from the Vite starter. **These are NOT the brand's production iconography** — they're leftover framework assets and the filename has been changed to `legacy-icons.svg` to make that obvious. Use them only as social-link icons.
- **Primary iconography for new work:** [Lucide icons](https://lucide.dev/) via CDN. Thin 1.5px stroke matches the brand's existing hand-drawn-feeling vector style on the lecture page. **This is a substitution** — the brand doesn't ship a custom icon font today. Flagged below.
- Bespoke abstract icons (compass, lock) on the lecture page are **inline SVGs**, drawn per-use. When we need new ones, match: `stroke-width="1.5"`, `stroke="currentColor"`, no fill, `24×24` viewBox.

### Emoji

**Never.** The brand voice is literary. No emoji anywhere — in copy, in UI, in decks.

### Unicode & dingbats

- Em-dash (`—`) is used **constantly** — it's arguably the brand's most frequent typographic character after the period.
- Middle dot (`·`) appears in hero credential lines ("Sydney Opera House · Carnegie Hall").
- Slash (`/`) in numbered labels ("Segment 01 / The Foundation").
- Curly quotes ("") in all pull-quotes.
- Ampersand (`&`) in titles ("Discipline & Range").
- No checkmarks, no arrows, no emoji stand-ins.

### Logos

- **Primary wordmark:** "Tristian Walker" set in Lato/Inter 700, uppercase, `letter-spacing: 0.15em`. Text-only, no logomark.
- **The Quiet Line wordmark:** "The Quiet **Line***.*" — "Line" italic and in accent color; final period is full-stop size. A purely typographic lockup.
- **Favicon:** `assets/favicon.svg` (inherited from the book site).

There is no graphical monogram today. The wordmarks carry the identity entirely.

---

## Font Substitution Note

**No local font files are shipped in `fonts/` yet.** All fonts are loaded from the Google Fonts CDN:

- Merriweather (book site)
- Lato (book site)
- Playfair Display (lecture site)
- Inter (lecture site)

These are Google Fonts licensed for web/print redistribution, so the CDN-only approach is safe. **If you need offline / self-hosted / print-perfect weights, please provide:**

1. `Merriweather` — 300, 400, 700, + italic 300/400
2. `Lato` — 300, 400, 700, + italic 400
3. `Playfair Display` — 700, 900, + italic 700/900
4. `Inter` — 400, 500, 600, 700

Drop into `fonts/` as `.woff2` and swap the `@import` in `colors_and_type.css` for `@font-face` blocks.

---

## How to use this system

- **Starting a new design?** Include `colors_and_type.css`. It defines everything — variables, base styles, semantic classes.
- **Building a slide?** Reach for World B (Playfair + Inter). Use dark ink or parchment backgrounds. Keep type large.
- **Building a longer-form narrative page or author content?** Reach for World A (Merriweather + Lato). Warm cream background.
- **Recreating the existing sites?** Use the `ui_kits/` — components are already modular.
- **Iconography?** Lucide via CDN. Never emoji. Match existing 1.5px stroke-width.

The golden rule: **this brand is warm, literary, and adult. It doesn't shout. The italic phrase inside the serif heading is the signature move. Protect the period.**
