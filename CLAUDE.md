# CLAUDE.md - tristian-walker-design-system

Guidance for Claude Code working in this repo.

## ⚠️ READ THIS FIRST: this repo is NOT the CobbledWorks brand

**Standing operator rule (Tristian, August 14, 2026), every session in this
repo.** Almost every other repo in this org is CobbledWorks: azure `#2E8FE0` and
sunshine `#FFC53D`, Playfair and Inter, jewel-tile icons, no em dashes. **This
repo is a different brand and none of that applies to its output.**

This is the design system for **Tristian Walker the speaker and author**, the
author of *The Quiet Line*. Its look is burnt sienna `#BC744E` on warm cream
`#F8F5EF`, Merriweather and Lato for the book world, Playfair Display and Inter
for the lecture world. Warm, literary, adult. Read
[`README.md`](README.md) and [`SKILL.md`](SKILL.md) before designing anything.

Three collisions that have already caused, or nearly caused, a wrong change:

- **The filename `colors_and_type.css` exists in both brands.** CobbledWorks has
  `brand/tokens/colors_and_type.css` and it is azure led. This repo's file of
  the same name is the sienna and cream one. Applying the wrong palette does not
  make a small mistake, it replaces one brand with another.
- **"The retired cream and sienna neutrals never come back" is a CobbledWorks
  rule about the CobbledWorks palette.** Over here, sienna on cream is the live,
  current, intended look. Draining it is a regression, not a cleanup.
- **⚠️ The house no-em-dash rule does not govern this brand.** The README names
  the spaced em dash as a signature move: "Serif em-dashes, never double
  hyphens." Do not install the em dash guard here, and do not sweep this repo
  for them. That guard belongs in the CobbledWorks repos only.

## What DOES carry over

These are house standards rather than CobbledWorks styling, so they hold here too:

- **No emoji**, which this brand already states more strictly than we do: zero,
  no hashtags, exclamation points rare. The `## <emoji>` section markers in this
  internal file are the operator's filing system and stay.
- **The polish bar.** Real tokens, deliberate typography, depth and motion behind
  `prefers-reduced-motion`, phone first, no unstyled fallbacks.
- **Honest claims.** Never invent a testimonial, a credential, a booking, or a
  conversation that did not happen.
- **Voice, in this brand's own register.** A reader should finish feeling
  respected and never talked down to. Here that reads as measured and literary
  rather than warm and plain.
- **The three-word session title**, the three-hour watch cap, the client-impact
  guardrail, the email review gate, and the red-check rule. Those are about how
  we work, not how anything looks.

Canonical statement of the two-brand split: the `cobbled-works` CLAUDE.md.

## 🏷 Three-word session title

**Standing operator rule (Tristian, July 31, 2026), every repo, every session.**
The first reply of a session leads with a **bolded three-word title** naming what
the session is about, before anything else. Exactly three words, restated on a
genuine pivot, never skipped. Canonical version: the `cobbled-works` CLAUDE.md.

## ⏱ Stop a watch at 3 hours

**Standing operator rule (Tristian, July 28, 2026), every repo, every session.**
No self-scheduled watch, poll, or check-in loop runs past **three hours**,
counted from the first check-in on that subject rather than the last. At the cap,
stop, delete the pending trigger, and write the report: what was watched, why it
stopped, and the single decision waiting on him. Work that only a person can
unblock never starts a loop at all. Canonical version: the `cobbled-works`
CLAUDE.md.

## ⛔ Client-impact guardrail

Anything that could affect a live site, a real booking, or something already in a
person's hands stops and alerts the operator **before** the change, not after.
Treat anything ambiguous as client facing.

## 🔗 Show the work: end with a live, clickable link

**Standing operator rule (Tristian), every finished deliverable, every session.**
Lead the reply with a direct, clickable link to the live result, deep-linked to
the exact page. Real markdown links, one per line, explanation after. Never a
`github.com` link, never a "go look in X" pointer, never "once it deploys." If it
is genuinely not hosted yet, say so and give the one step that makes it live.

## 🔴 A red check gets diagnosed or switched off, never tolerated

**Standing operator rule (Tristian, August 13, 2026), every repo, every session.**
A persistently red check never stays red while everyone works around it, because
a permanent red tick trains the team to ignore that row. Read the failing job
rather than the red tick: `runner_id: 0`, no `steps` array, `total_ms: 0` and a
death in a few seconds means a spending cap, not your code. These sessions are
read-only on Actions, so hand Tristian the workflow's "Run workflow" link rather
than reporting the diagnosis as blocked. Canonical version: the `cobbled-works`
CLAUDE.md.
