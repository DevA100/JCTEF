import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import type { ComponentProps } from "react";

/** Internal links use next/link; external ones open in a new tab. */
function MdxLink({ href = "", children, ...props }: ComponentProps<"a">) {
  if (href.startsWith("/")) {
    return (
      <Link href={href} {...props}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
      <span className="visually-hidden"> (opens in a new tab)</span>
    </a>
  );
}

const components: MDXComponents = { a: MdxLink };

export function useMDXComponents(): MDXComponents {
  return components;
}
