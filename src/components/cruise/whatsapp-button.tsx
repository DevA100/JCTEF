import { MessageCircle } from "lucide-react";
import { cruiseButtonClasses } from "./button";

/** WhatsApp wants the number with its country code and no "+": a Nigerian
 * number (0801…, 801…, +234…) becomes 234801…; others keep their digits. */
export function cruiseWhatsAppNumber(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("234")) return digits;
  if (digits.startsWith("0") && digits.length === 11) return `234${digits.slice(1)}`;
  if (digits.length === 10 && /^[789]/.test(digits)) return `234${digits}`;
  return digits;
}

/** "https://wa.me/2348012345678?text=Hello" */
export const cruiseWhatsAppLink = (phone: string, message?: string) =>
  `https://wa.me/${cruiseWhatsAppNumber(phone)}${message ? `?text=${encodeURIComponent(message)}` : ""}`;

/**
 * WhatsApp button, spec A5: a .brutal link "Chat on WhatsApp" with Lucide's
 * message-circle (no brand logo). Opens wa.me in a new tab with the message
 * filled in. Tones: default (primary) and success.
 */
export function CruiseWhatsAppButton({
  phone,
  message,
  label = "Chat on WhatsApp",
  tone = "default",
  className,
}: {
  /** The number to chat with, in any form (0801…, +234…). */
  phone: string;
  /** Text to start the chat with (URL-encoded for you). */
  message?: string;
  label?: string;
  tone?: "default" | "success";
  className?: string;
}) {
  return (
    <a
      href={cruiseWhatsAppLink(phone, message)}
      target="_blank"
      rel="noopener noreferrer"
      className={cruiseButtonClasses({ variant: tone === "success" ? "success" : "primary", className })}
    >
      <MessageCircle aria-hidden="true" />
      {label}
      <span className="visually-hidden"> (opens in a new tab)</span>
    </a>
  );
}
