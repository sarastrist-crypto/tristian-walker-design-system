#!/usr/bin/env node
/* Fails the build on a conflict marker left in a tracked file, and on a
   tracked .json that does not parse.

   ⛔ WHY THIS EXISTS (August 14, 2026). A merge on the referral deck was
   resolved with `git add -A && git commit --no-edit` without checking whether
   every marker was gone. Four files shipped with `<<<<<<<` in them, including
   the narrated deck's `timings.json`. That file is fetched at load, and the
   player disables its own play button when the fetch fails, so the whole
   presentation went silent. Tristian found it by pressing play.

   ⚠️ THE PART WORTH REMEMBERING: every check we own passed. The em-dash guard
   walks the same files and does not parse them. The contrast guard renders the
   page and the page renders fine, because a dead play button looks exactly
   like a play button. The reading-level check reads prose. A broken JSON is
   invisible to all of them, and `git add -A` is the exact motion that creates
   it, which is why this runs in CI rather than living in somebody's habits.

   ⚙️ IT WORKS, AND THE SEPTEMBER 18 INCIDENT PROVED IT RATHER THAN DISPROVING
   IT. Markers reached `cobbled-memory`'s `index.md` on `main`, and the copy of
   this guard installed there FAILED within five seconds on the exact merge
   commit. The check was red on `main` for about eight minutes before anybody
   acted on it. So the gap that day was not a missing guard, it was a session
   pushing a conflicted merge and walking away from the red tick. A guard can
   only tell you; the red-check rule is the half that makes somebody look.

   ⚙️ TWO DEFECTS FIXED September 18, 2026, both found by calibrating against
   every repo before installing rather than after:

   1. THE DIFF3 MARKER WAS NEVER CHECKED. Git writes a fourth marker,
      `||||||| merged common ancestor`, whenever `merge.conflictStyle` is
      `diff3` or `zdiff3`. The old pattern matched `<<<<<<<`, `=======` and
      `>>>>>>>` only, so a diff3 conflict resolved carelessly would leave its
      ancestor block behind and pass. Measured across all 11 repos: the only
      line starting with seven pipes is inside a PNG, which is skipped, so
      this costs nothing.

   2. A LATENT FALSE POSITIVE ON JSONC. `tsconfig.json` and friends legally
      carry block comments and trailing commas, and `JSON.parse` rejects
      them. It had never fired only because this repo's own tsconfigs happen
      to have no comments in them. Installing the old version unchanged into
      `pool-website-factory` (30 tsconfigs) or `glisten-pools-app` (2 with
      real comments) would have failed CI on day one, and a guard that cries
      wolf gets switched off before the one real finding arrives. Known JSONC
      paths are now parsed leniently, and everything else stays strict,
      because a comment in a `data.json` that something fetches at runtime is
      a genuine break rather than a style.

   Usage:
     node qa/merge-marker-guard.mjs              every tracked file
     node qa/merge-marker-guard.mjs <path>...    only these files or folders,
                                                 so a file can be checked
                                                 before it is committed
*/

import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

/* Anchored at the start of a line, which is the only place git writes them.
   A doc that quotes a marker mid-sentence stays legal, and this file's own
   comment above would otherwise fail the check it implements. */
const MARKER = /^(<{7}|\|{7}|={7}|>{7})(\s|$)/;

/* Binary and vendored trees: reading them is pointless and slow. */
const SKIP = /\.(png|jpe?g|gif|webp|svg|mp3|mp4|wav|woff2?|ttf|otf|ico|pdf|pptx|docx|xlsx|zip)$/i;

/* Deliberately broken fixtures belong to a test, not to the repo scan. The
   email guards learned this the expensive way on September 17: a fixture
   written to fail turned two repo-wide guards red, and the sweep that should
   have caught it had been piped through `tail`, so every row reported `tail`'s
   exit code. Nothing here is committed broken, but the exclusion stays as the
   cheap insurance it is. */
const FIXTURES = /(^|\/)qa\/__tests__\/fixtures\//;

/* Files that are JSON by extension and JSONC by contract. Everything outside
   this list is parsed strictly. */
const JSONC = /(^|\/)(tsconfig|jsconfig)[^/]*\.json$|(^|\/)\.vscode\/|(^|\/)devcontainer\.json$|(^|\/)\.devcontainer\//i;

/* Strip `//` and block comments and trailing commas, STRING-AWARE, because a
   naive stripper eats the `//` in "https://example.com" and reports a valid
   file as broken. */
function stripJsonc(text) {
  let out = '';
  let i = 0;
  let inStr = false;
  let esc = false;
  let pendingComma = false;
  const flush = () => {
    if (pendingComma) {
      out += ',';
      pendingComma = false;
    }
  };
  while (i < text.length) {
    const c = text[i];
    if (inStr) {
      out += c;
      if (esc) esc = false;
      else if (c === '\\') esc = true;
      else if (c === '"') inStr = false;
      i++;
      continue;
    }
    if (c === '/' && text[i + 1] === '/') {
      while (i < text.length && text[i] !== '\n') i++;
      continue;
    }
    if (c === '/' && text[i + 1] === '*') {
      i += 2;
      while (i < text.length && !(text[i] === '*' && text[i + 1] === '/')) i++;
      i += 2;
      continue;
    }
    if (c === ',') {
      flush();
      pendingComma = true;
      i++;
      continue;
    }
    /* Whitespace may pass while a comma is held, so `1, }` collapses to `1 }`
       and `1, 2` comes back as `1 ,2`. Both are valid JSON; only the parse
       result matters here, never the formatting. */
    if (/\s/.test(c)) {
      out += c;
      i++;
      continue;
    }
    if (c === '}' || c === ']') {
      pendingComma = false;
      out += c;
      i++;
      continue;
    }
    flush();
    if (c === '"') inStr = true;
    out += c;
    i++;
  }
  flush();
  return out;
}

function walk(target, acc) {
  let st;
  try {
    st = statSync(target);
  } catch {
    return acc;
  }
  if (st.isDirectory()) {
    for (const name of readdirSync(target)) {
      if (name === '.git' || name === 'node_modules') continue;
      walk(join(target, name), acc);
    }
  } else {
    acc.push(target);
  }
  return acc;
}

const args = process.argv.slice(2);
const files = args.length
  ? args.flatMap((a) => walk(a, []))
  : execFileSync('git', ['ls-files'], { encoding: 'utf8' })
      .split('\n')
      .filter(Boolean)
      .filter((f) => !FIXTURES.test(f));

const markers = [];
const badJson = [];

for (const file of files) {
  if (SKIP.test(file)) continue;
  let text;
  try {
    text = readFileSync(file, 'utf8');
  } catch {
    continue;
  }
  if (text.includes('\0')) continue;

  const lines = text.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (MARKER.test(lines[i])) markers.push(`${file}:${i + 1}  ${lines[i].slice(0, 60)}`);
  }

  /* A JSON file that does not parse is the same class of defect: it was
     produced by a machine, nobody reads it, and the page that needs it fails
     quietly at runtime instead of at build time. */
  if (file.endsWith('.json')) {
    const jsonc = JSONC.test(file);
    try {
      JSON.parse(jsonc ? stripJsonc(text) : text);
    } catch (e) {
      badJson.push(`${file}  ${jsonc ? '(as JSONC) ' : ''}${e.message.split('\n')[0]}`);
    }
  }
}

if (!markers.length && !badJson.length) {
  console.log(
    `clean - ${files.length} file${files.length === 1 ? '' : 's'} scanned, no conflict markers, every JSON parses`
  );
  process.exit(0);
}

if (markers.length) {
  console.error(
    `\n${markers.length} conflict marker${markers.length === 1 ? '' : 's'} left in tracked files:\n`
  );
  markers.forEach((m) => console.error('  ' + m));
  console.error('\nA merge was committed before every marker was resolved.');
}

if (badJson.length) {
  console.error(
    `\n${badJson.length} tracked JSON file${badJson.length === 1 ? '' : 's'} will not parse:\n`
  );
  badJson.forEach((m) => console.error('  ' + m));
  console.error('\nRegenerate it from its source script rather than hand-editing it.');
}

console.error('');
process.exit(1);
