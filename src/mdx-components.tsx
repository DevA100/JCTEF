import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import type { ComponentProps } from "react";

/** Internal links use next/link; external ones open in a new tab. */
function MdxLink({ href = "", children, ...props }: ComponentProps<"a">) {
  // Second line of defence (the MDX sanitiser removes these at build time).
  if (/^(javascript|vbscript|data):/i.test(href.replace(/[\u0000-\u0020]/g, ""))) return <span>{children}</span>;
  if (href.startsWith("/") && !href.startsWith("//")) {
    return (
      <Link href={href} {...props}>
        {children}
      </Link>
    );
  }
  return (
    <a {...props} href={href} target="_blank" rel="noopener noreferrer">
      {children}
      <span className="visually-hidden"> (opens in a new tab)</span>
    </a>
  );
}

const components: MDXComponents = { a: MdxLink };

export function useMDXComponents(): MDXComponents {
  return components;
}
