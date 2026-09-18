#!/usr/bin/env node
/* Calibration for qa/merge-marker-guard.mjs, both directions.

   ⛔ WHY THIS EXISTS. "Never trust a check nobody has watched fail on purpose
   at least once" is a standing rule, and this guard had never been watched
   fail. Two real defects were sitting in it when this was written: it did not
   know git's diff3 marker at all, and it would have reported every commented
   `tsconfig.json` as a broken file. Neither was visible from a passing run,
   which is the whole point.

   ⚠️ EVERY FIXTURE IS WRITTEN TO A TEMP DIRECTORY AT RUN TIME AND DELETED
   AFTER. Nothing deliberately broken is ever committed. On September 17 a
   committed broken fixture turned two repo-wide email guards red, and the
   sweep that should have caught it had been piped through `tail`, so all
   twelve rows printed `tail`'s exit code and read green. A fixture on disk is
   a liability; a fixture in `os.tmpdir()` is not.

   Usage:  node qa/__tests__/merge-marker-guard.test.mjs
*/

import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const GUARD = join(dirname(fileURLToPath(import.meta.url)), '..', 'merge-marker-guard.mjs');

const dir = mkdtempSync(join(tmpdir(), 'marker-guard-'));
let failures = 0;

function check(label, { file, body, expect: want, mentions }) {
  const path = join(dir, file);
  writeFileSync(path, body);
  const run = spawnSync('node', [GUARD, path], { encoding: 'utf8' });
  const got = run.status === 0 ? 'pass' : 'fail';
  const out = (run.stdout || '') + (run.stderr || '');

  if (got !== want) {
    console.error(`  FAIL  ${label}\n        expected the guard to ${want}, it ${got}ed\n        ${out.trim().split('\n').join('\n        ')}`);
    failures++;
    return;
  }
  if (mentions && !out.includes(mentions)) {
    console.error(`  FAIL  ${label}\n        ${got}ed correctly but never mentioned "${mentions}"`);
    failures++;
    return;
  }
  console.log(`  ok    ${label}`);
}

console.log('merge-marker-guard calibration\n');

/* --- it fails on what it is for ------------------------------------------ */

check('classic conflict markers fail', {
  file: 'classic.md',
  body: '# Notes\n\n<<<<<<< HEAD\nours\n=======\ntheirs\n>>>>>>> a1b2c3d4e5f60718293a4b5c6d7e8f9012345678\n',
  expect: 'fail',
  mentions: 'conflict marker',
});

/* The regression the September 18 pass added. Git writes this whenever
   merge.conflictStyle is diff3 or zdiff3, and the old pattern did not know it
   existed, so a carelessly resolved diff3 merge passed clean. */
check('diff3 ancestor marker fails', {
  file: 'diff3.md',
  body: '<<<<<<< HEAD\nours\n||||||| merged common ancestor\nbase\n=======\ntheirs\n>>>>>>> feature\n',
  expect: 'fail',
  mentions: '|||||||',
});

check('a bare ======= line fails', {
  file: 'bare.md',
  body: 'before\n=======\nafter\n',
  expect: 'fail',
});

/* --- it passes on what it is not for ------------------------------------- */

check('clean prose passes', {
  file: 'clean.md',
  body: '# A normal file\n\nNothing to see, and a table:\n\n| a | b |\n|---|---|\n| 1 | 2 |\n',
  expect: 'pass',
});

/* A doc explaining conflict markers must stay legal, which is why the pattern
   is anchored to the start of a line. This very repo documents them. */
check('a marker quoted mid-sentence passes', {
  file: 'quoted.md',
  body: 'Resolve it when you see <<<<<<< HEAD in the file, then delete the ======= line.\n',
  expect: 'pass',
});

/* --- JSON, strict where it must be and lenient where it may be ----------- */

check('tsconfig with block comments and a trailing comma passes', {
  file: 'tsconfig.json',
  body: '{\n  "compilerOptions": {\n    /* Bundler mode */\n    "moduleResolution": "bundler",\n    // a line comment\n    "strict": true,\n  },\n}\n',
  expect: 'pass',
});

/* The stripper has to know it is inside a string, or it eats the // in a URL
   and reports a perfectly good file as broken. */
check('a URL inside a JSONC string survives the comment stripper', {
  file: 'tsconfig.url.json',
  body: '{\n  "$schema": "https://json.schemastore.org/tsconfig",\n  /* c */ "compilerOptions": { "strict": true }\n}\n',
  expect: 'pass',
});

check('a genuinely broken tsconfig still fails', {
  file: 'tsconfig.broken.json',
  body: '{\n  /* comment */ "compilerOptions": { "strict": true \n',
  expect: 'fail',
  mentions: 'as JSONC',
});

/* Strictness is preserved everywhere else: a comment in a file something
   fetches at runtime is a real break, not a style. */
check('a comment in an ordinary .json fails', {
  file: 'data.json',
  body: '{\n  // not allowed here\n  "a": 1\n}\n',
  expect: 'fail',
  mentions: 'will not parse',
});

check('valid ordinary json passes', {
  file: 'good.json',
  body: '{"a": 1, "b": ["x", "y"]}\n',
  expect: 'pass',
});

rmSync(dir, { recursive: true, force: true });

console.log('');
if (failures) {
  console.error(`${failures} calibration case${failures === 1 ? '' : 's'} failed\n`);
  process.exit(1);
}
console.log('all calibration cases passed\n');
