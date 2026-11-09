/**
 * Makes blog posts (content/blog/*.mdx) safe to publish, whoever wrote them
 * and wherever they were copied from (e.g. the old WordPress site).
 * Runs when posts are compiled, before anything else.
 *
 * - Removes import/export statements and {expressions}: posts can't run code.
 * - Removes <script>, <style>, <object>, <embed>, forms and other risky tags.
 * - Removes inline event handlers (onclick=…), code in attributes, srcdoc.
 * - Removes javascript:, vbscript: and data: links and images.
 * - Opens hand-written external <a> links in a new tab with rel="noopener noreferrer".
 * - Allows <iframe> only for YouTube embeds (youtube.com/embed or
 *   youtube-nocookie.com/embed), keeping only safe attributes.
 */

const BLOCKED_TAGS = new Set([
  "script", "style", "object", "embed", "applet", "form", "input", "button", "textarea",
  "select", "option", "link", "meta", "base", "frame", "frameset", "svg", "math", "template",
  "portal", "noscript",
]);
const URL_ATTRIBUTES = new Set(["href", "src", "action", "formaction", "xlink:href", "poster", "background", "cite"]);
const BLOCKED_ATTRIBUTES = new Set(["srcdoc", "dangerouslysetinnerhtml", "formaction", "style"]);
const YOUTUBE_EMBED = /^https:\/\/(www\.)?(youtube\.com|youtube-nocookie\.com)\/embed\/[\w-]+(\?[\w=&;%-]*)?$/i;
const IFRAME_ATTRIBUTES = new Set(["src", "title", "width", "height", "allow", "allowfullscreen", "loading", "referrerpolicy"]);

/** True for javascript:, vbscript: and data: URLs, however they're disguised. */
export function isUnsafeUrl(url) {
  // Browsers ignore control characters and whitespace inside the scheme.
  const compact = String(url ?? "").replace(/[\u0000- \u007f-\u009f]/g, "").toLowerCase();
  return /^(javascript|vbscript|data):/.test(compact);
}

const isJsx = (node) => node.type === "mdxJsxFlowElement" || node.type === "mdxJsxTextElement";

function stringAttr(node, name) {
  const attr = node.attributes?.find((a) => a.type === "mdxJsxAttribute" && a.name?.toLowerCase() === name);
  return typeof attr?.value === "string" ? attr.value : undefined;
}

function cleanAttributes(node, allowOnly) {
  node.attributes = (node.attributes ?? []).filter((attr) => {
    if (attr.type !== "mdxJsxAttribute") return false; // {...spread}
    const name = String(attr.name ?? "").toLowerCase();
    if (allowOnly && !allowOnly.has(name)) return false;
    if (name.startsWith("on") || BLOCKED_ATTRIBUTES.has(name)) return false;
    if (attr.value && typeof attr.value === "object") return false; // attr={code}
    if (URL_ATTRIBUTES.has(name) && isUnsafeUrl(attr.value)) return false;
    return true;
  });
}

/** Returns what should replace `node` in its parent: [] removes it. */
function sanitize(node, file) {
  switch (node.type) {
    case "mdxjsEsm":
    case "mdxFlowExpression":
    case "mdxTextExpression":
      file?.message?.(`Removed code from a blog post: ${node.type}`);
      return [];
    case "link":
    case "definition":
      if (isUnsafeUrl(node.url)) return node.type === "link" ? sanitizeChildren(node, file).children : [];
      break;
    case "image":
      if (isUnsafeUrl(node.url)) return [];
      break;
    default:
      if (isJsx(node) && node.name) {
        const tag = node.name.toLowerCase();
        if (BLOCKED_TAGS.has(tag)) {
          file?.message?.(`Removed <${node.name}> from a blog post`);
          return [];
        }
        if (tag === "iframe") {
          const src = stringAttr(node, "src");
          if (!src || !YOUTUBE_EMBED.test(src)) {
            file?.message?.(`Removed an <iframe> that isn't a YouTube embed (${src ?? "no src"})`);
            return [];
          }
          cleanAttributes(node, IFRAME_ATTRIBUTES);
          node.children = [];
          return [node];
        }
        cleanAttributes(node);
        // Hand-written external links get the same treatment as Markdown ones.
        if (tag === "a" && /^https?:\/\//i.test(stringAttr(node, "href") ?? "")) {
          node.attributes = node.attributes.filter((attr) => !["target", "rel"].includes(attr.name?.toLowerCase()));
          node.attributes.push(
            { type: "mdxJsxAttribute", name: "target", value: "_blank" },
            { type: "mdxJsxAttribute", name: "rel", value: "noopener noreferrer" },
          );
        }
      }
  }
  return [sanitizeChildren(node, file)];
}

function sanitizeChildren(node, file) {
  if (Array.isArray(node.children)) node.children = node.children.flatMap((child) => sanitize(child, file));
  return node;
}

export default function remarkSanitize() {
  return (tree, file) => {
    sanitizeChildren(tree, file);
  };
}
