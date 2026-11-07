"use client";

import { Accordion } from "@base-ui/react/accordion";
import type { ReactNode } from "react";
import { cx } from "@/lib/cruise-utils";

export type CruiseAccordionItem = { value: string; title: ReactNode; content: ReactNode };

/**
 * Accordion, spec A5: full-width header buttons (56px), a square +/- box,
 * one or several panels open, a 2px ink rule above an open panel. Base UI
 * Accordion gives the buttons, aria-expanded / aria-controls and the
 * height animation (150ms; none with reduced motion).
 */
export function CruiseAccordion({
  items,
  multiple = false,
  defaultValue,
  className,
}: {
  items: CruiseAccordionItem[];
  /** Let several panels be open at once. */
  multiple?: boolean;
  /** Values of the panels open at first. */
  defaultValue?: string[];
  className?: string;
}) {
  return (
    <Accordion.Root multiple={multiple} defaultValue={defaultValue} className={cx("accordion", className)}>
      {items.map((item) => (
        <Accordion.Item key={item.value} value={item.value} className="accordion-item">
          <Accordion.Header className="accordion-header">
            <Accordion.Trigger className="accordion-trigger">
              <span>{item.title}</span>
              <span className="accordion-icon" aria-hidden="true" />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel className="accordion-panel">
            <div className="accordion-content">{item.content}</div>
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
