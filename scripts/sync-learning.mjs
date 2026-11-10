// Copy the Learning Center content from a wiki-playground checkout into
// learning/content/, replacing what's there.
//
//   npm run sync-learning                 # from ../wiki-playground
//   npm run sync-learning -- ~/path/to/wiki-playground

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { compileLearning, BuildError } from "../learning/compile.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const wiki = path.resolve(process.argv[2] ?? path.join(ROOT, "..", "wiki-playground"));
const src = path.join(wiki, "content");
const dest = path.join(ROOT, "learning", "content");

if (!fs.existsSync(path.join(src, "site.yml"))) {
  console.error(`No wiki content at ${src}\nPass the wiki-playground folder: npm run sync-learning -- <path>`);
  process.exit(1);
}

// Check the incoming content compiles before replacing anything.
try {
  compileLearning(src);
} catch (e) {
  if (e instanceof BuildError) {
    console.error(`\nNot synced — the wiki content has an error:\n${e.message}\n`);
    process.exit(1);
  }
  throw e;
}

fs.rmSync(dest, { recursive: true, force: true });
fs.cpSync(src, dest, { recursive: true, filter: (f) => path.basename(f) !== ".DS_Store" });

let rev = "";
try {
  const git = (...a) => execFileSync("git", ["-C", wiki, ...a], { encoding: "utf8" }).trim();
  rev = ` (${git("rev-parse", "--abbrev-ref", "HEAD")} @ ${git("rev-parse", "--short", "HEAD")}${git("status", "--porcelain", "content") ? ", with uncommitted changes" : ""})`;
} catch {}
console.log(`Synced ${path.relative(ROOT, dest)} from ${wiki}${rev}`);
