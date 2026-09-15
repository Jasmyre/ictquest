/**
 * Slug-parity check (migration 06, #29 / ADR-0001).
 *
 * Every `content/lessons/<lesson>/<subtopic>.mdx` file must resolve to a
 * legacy progress key ({ topic: lesson slug, subtopic: content key }) found
 * in `src/db/lessons.tsx`, and the MDX `slug` must equal the legacy
 * subtopic key — otherwise stored ProgressData rows would stop matching.
 *
 * Run: `node scripts/check-lesson-slug-parity.mjs` (also `npm run lesson:parity`).
 *
 * NOTE: the frontmatter parsing below deliberately mirrors
 * `src/lib/lessons/mdx.ts` (same required keys, same slug===subtopic rule)
 * so this check stays dependency-free in CI. Keep the two in sync.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT_DIR = path.join(root, "content", "lessons");
const LEGACY_DB = path.join(root, "src", "db", "lessons.tsx");

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---/;
const LINE_SPLIT_RE = /\r?\n/;
const FRONTMATTER_KV_RE = /^([A-Za-z_]+):\s*(.*)$/;
const QUOTE_TRIM_RE = /^["']|["']$/g;
const REQUIRED_KEYS = ["lesson", "subtopic", "slug", "title", "order"];

function parseFrontmatter(source, file) {
  const match = source.match(FRONTMATTER_RE);
  if (!match) {
    throw new Error(`${file}: missing frontmatter (--- block).`);
  }
  const raw = {};
  for (const line of match[1].split(LINE_SPLIT_RE)) {
    const kv = line.match(FRONTMATTER_KV_RE);
    if (kv) {
      raw[kv[1]] = kv[2].trim().replace(QUOTE_TRIM_RE, "");
    }
  }
  for (const key of REQUIRED_KEYS) {
    if (!raw[key]) {
      throw new Error(`${file}: frontmatter is missing required key: ${key}`);
    }
  }
  return raw;
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function listMdxFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...listMdxFiles(full));
    } else if (entry.name.endsWith(".mdx")) {
      out.push(full);
    }
  }
  return out;
}

const legacy = fs.readFileSync(LEGACY_DB, "utf8");
const files = listMdxFiles(CONTENT_DIR);
if (files.length === 0) {
  console.error("No MDX lesson files found under content/lessons.");
  process.exit(1);
}

let failed = false;
const seen = new Set();
for (const file of files) {
  const rel = path.relative(root, file);
  const fm = parseFrontmatter(fs.readFileSync(file, "utf8"), rel);
  const key = `${fm.lesson}/${fm.subtopic}`;
  if (seen.has(key)) {
    console.error(`DUPLICATE: ${rel} reuses ${key}`);
    failed = true;
  }
  seen.add(key);
  if (!legacy.includes(`slug: "${fm.lesson}"`)) {
    console.error(`MISSING lesson slug for ${rel}: "${fm.lesson}"`);
    failed = true;
  }
  // Word-boundary match on the content key (e.g. `html_introduction:` or the
  // shorthand `quiz,`), so a shared substring elsewhere in the legacy DB
  // cannot fake a match.
  const subtopicKey = new RegExp(`\\b${escapeRegExp(fm.subtopic)}\\s*[:,]`);
  if (!subtopicKey.test(legacy)) {
    console.error(`MISSING subtopic key for ${rel}: "${fm.subtopic}"`);
    failed = true;
  }
  if (fm.slug !== fm.subtopic) {
    console.error(
      `SLUG MISMATCH in ${rel}: slug "${fm.slug}" !== subtopic "${fm.subtopic}"`
    );
    failed = true;
  }
  if (!failed) {
    console.log(`OK ${key} (${rel})`);
  }
}

if (failed) {
  console.error("\nSlug-parity check FAILED.");
  process.exit(1);
}
console.log(`\nSlug-parity check passed for ${files.length} file(s).`);
