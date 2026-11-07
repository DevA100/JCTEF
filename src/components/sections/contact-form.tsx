"use client";

import { useState } from "react";
import { CruiseAlert } from "@/components/cruise/alert";
import { CruiseButton } from "@/components/cruise/button";
import { CruiseInput } from "@/components/cruise/input";
import { CruisePhoneInput } from "@/components/cruise/phone-input";
import { CruiseTextarea } from "@/components/cruise/textarea";
import { site } from "@/lib/content";

/**
 * Contact form. There is no backend yet, so on submit it opens the
 * visitor's email app with the message filled in, addressed to info@.
 * TODO(JCTEF): replace with a server action or form service so messages
 * arrive without leaving the page.
 */
export function ContactForm() {
  const [opened, setOpened] = useState(false);

  return (
    <form
      className="grid gap-5"
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const name = String(data.get("name") ?? "");
        const subject = `Website enquiry from ${name}`;
        const body = [
          String(data.get("message") ?? ""),
          "",
          `Name: ${name}`,
          `Email: ${data.get("email") ?? ""}`,
          data.get("phone") ? `Phone: ${data.get("phone")}` : "",
        ]
          .filter((line, i) => i < 2 || line)
          .join("\n");
        window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        setOpened(true);
      }}
    >
      <CruiseInput label="Your name" name="name" autoComplete="name" required />
      <CruiseInput label="Email address" name="email" type="email" autoComplete="email" inputMode="email" required />
      <CruisePhoneInput label="Phone number" name="phone" hint="Optional. A Nigerian mobile number, e.g. 0803 123 4567." />
      <CruiseTextarea label="Your message" name="message" required maxLength={2000} autoGrow />
      <div>
        <CruiseButton type="submit">Send message</CruiseButton>
      </div>
      {opened && (
        <CruiseAlert tone="info" title="Your email app should now be open">
          If nothing happened, email us directly at{" "}
          <a href={`mailto:${site.email}`} className="text-link">
            {site.email}
          </a>
          .
        </CruiseAlert>
      )}
    </form>
  );
}
