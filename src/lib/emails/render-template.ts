import "server-only";
import { readFileSync } from "node:fs";
import path from "node:path";
import { escapeHtml } from "@/lib/brevo";
import { site } from "@/lib/content";

/**
 * Renders an email from emails/brevo/<name>.html on the server, so the files
 * there stay the single source of truth and nothing has to be pasted into
 * Brevo. Supports the small subset of Brevo's template language they use:
 *
 *   {{ params.NAME }}                      value, HTML-escaped
 *   {{ params.NAME | default : "text" }}   with a fallback when empty
 *   {% if params.NAME %}…{% endif %}       shown when NAME is not empty
 *   {% if params.NAME == "x" %}…{% endif %}
 *
 * LOGO_URL is replaced with the site icon (the favicon) on the live site.
 */
export function renderEmailTemplate(name: string, params: Record<string, string>): string {
  // Included in the server bundle via outputFileTracingIncludes in next.config.ts.
  let html = readFileSync(path.join(process.cwd(), "emails", "brevo", `${name}.html`), "utf8");

  // Conditionals, innermost first, so nested blocks work too.
  const ifBlock = /\{%\s*if\s+params\.(\w+)(?:\s*==\s*"([^"]*)")?\s*%\}((?:(?!\{%\s*if)[\s\S])*?)\{%\s*endif\s*%\}/;
  for (let match = html.match(ifBlock); match; match = html.match(ifBlock)) {
    const [whole, key, equals, body] = match;
    const value = params[key] ?? "";
    const show = equals === undefined ? value.trim() !== "" : value === equals;
    html = html.replace(whole, show ? body : "");
  }

  // Values, with optional defaults.
  html = html.replace(/\{\{\s*params\.(\w+)(?:\s*\|\s*default\s*:\s*"([^"]*)")?\s*\}\}/g, (_, key: string, fallback?: string) => {
    const value = params[key]?.trim() ? params[key] : (fallback ?? "");
    return escapeHtml(value);
  });

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || site.url).replace(/\/$/, "");
  // The favicon (green globe), 192px for sharp retina display at 64px.
  return html.replaceAll("LOGO_URL", `${siteUrl}/icons/icon-192.png`);
}
