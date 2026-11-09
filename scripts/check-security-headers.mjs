/**
 * Fails if netlify.toml's headers for "/*" differ from security-headers.mjs
 * (the source of truth). Runs before every build (npm "prebuild").
 * To regenerate the netlify.toml block, run: node scripts/check-security-headers.mjs --print
 */
import { readFileSync } from "node:fs";
import { securityHeaders } from "../security-headers.mjs";

const block = () =>
  ['[[headers]]', '  for = "/*"', "  [headers.values]", ...securityHeaders.map((h) => `    ${h.key} = ${JSON.stringify(h.value)}`)].join("\n");

if (process.argv.includes("--print")) {
  console.log(block());
  process.exit(0);
}

const toml = readFileSync(new URL("../netlify.toml", import.meta.url), "utf8");
// The "/*" block's values: lines like  Key = "value"  up to the next [[table]].
const start = toml.indexOf('for = "/*"');
if (start === -1) {
  console.error('netlify.toml: no [[headers]] block for "/*". Run: node scripts/check-security-headers.mjs --print');
  process.exit(1);
}
const rest = toml.slice(start);
const end = rest.indexOf("[[", 1);
const values = new Map(
  [...(end === -1 ? rest : rest.slice(0, end)).matchAll(/^\s*([A-Za-z-]+)\s*=\s*"((?:[^"\\]|\\.)*)"\s*$/gm)].map((m) => [
    m[1],
    JSON.parse(`"${m[2]}"`),
  ]),
);
values.delete("for");

const expected = new Map(securityHeaders.map((h) => [h.key, h.value]));
const problems = [];
for (const [key, value] of expected) {
  if (!values.has(key)) problems.push(`missing ${key}`);
  else if (values.get(key) !== value) problems.push(`${key} differs`);
}
for (const key of values.keys()) if (!expected.has(key)) problems.push(`extra ${key}`);

if (problems.length) {
  console.error(`netlify.toml security headers are out of sync with security-headers.mjs: ${problems.join("; ")}.`);
  console.error("Fix: node scripts/check-security-headers.mjs --print, and paste the output into netlify.toml.");
  process.exit(1);
}
console.log(`Security headers: netlify.toml matches security-headers.mjs (${expected.size} headers).`);
