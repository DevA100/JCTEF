"use client";

import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import type { ReactNode } from "react";
import { cx } from "@/lib/cruise-utils";

export type CruiseTabItem<V extends string> = { value: V; label: string; content: ReactNode; disabled?: boolean };
export type CruiseTabsVariant = "underline" | "boxed" | "pill";

/**
 * Tabs, spec A5: `.tabs-*` in theme.css. Underline for page sections, Boxed
 * for settings panels, Pill for filters. Base UI Tabs gives the tablist /
 * tab / tabpanel roles, aria-selected, aria-controls, arrow keys and
 * Home/End; the row scrolls sideways on small screens instead of wrapping.
 */
export function CruiseTabs<V extends string>({
  label,
  items,
  variant = "underline",
  value,
  defaultValue = items[0]?.value,
  onValueChange,
  keepMounted = false,
  className,
}: {
  /** Accessible name for the tab row, e.g. "Order details". */
  label: string;
  items: CruiseTabItem<V>[];
  variant?: CruiseTabsVariant;
  value?: V;
  defaultValue?: V;
  onValueChange?: (value: V) => void;
  /** Render every panel's content in the HTML (hidden until chosen), so it
   * can be found without JavaScript and by search engines. */
  keepMounted?: boolean;
  className?: string;
}) {
  return (
    <BaseTabs.Root
      value={value}
      defaultValue={defaultValue}
      onValueChange={(next) => onValueChange?.(next as V)}
      className={cx(`tabs-${variant}`, className)}
    >
      <BaseTabs.List aria-label={label} activateOnFocus className="tab-list">
        {items.map((item) => (
          <BaseTabs.Tab
            key={item.value}
            value={item.value}
            disabled={item.disabled}
            // Pill: the active chip is --primary, so it gets .on-primary.
            className={(state) => cx("tab", variant === "pill" && state.active && "on-primary")}
          >
            {item.label}
          </BaseTabs.Tab>
        ))}
      </BaseTabs.List>
      {items.map((item) => (
        <BaseTabs.Panel key={item.value} value={item.value} keepMounted={keepMounted} className="tab-panel">
          {item.content}
        </BaseTabs.Panel>
      ))}
    </BaseTabs.Root>
  );
}
