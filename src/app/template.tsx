import { ViewTransition } from "react";

/**
 * Page transitions. The template remounts on every navigation, and React's
 * <ViewTransition> (stable in React 19.3, no Next.js flag needed) animates it
 * with the browser's View Transitions API: the old page fades out quickly and
 * the new one fades in and rises 12px (CSS in globals.css). The header and
 * footer live in the layout, outside this, so they stay put.
 *
 * There is no animation on the first page load (better for load speed), in
 * browsers without View Transitions, or with reduced motion.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter="page-enter" exit="page-exit" default="none">
      <div>{children}</div>
    </ViewTransition>
  );
}
