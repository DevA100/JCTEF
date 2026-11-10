import "server-only";
import { escapeHtml } from "@/lib/brevo";
import { site } from "@/lib/content";
import { formatPhone } from "@/lib/phone";

/**
 * The email the team receives when someone uses the "Send us a message" form.
 * Styled like emails/brevo/volunteer-team-alert.html (table layout and inline
 * styles, so it renders in Gmail, Outlook and phone mail apps). Every value
 * from the form is HTML-escaped.
 */
/** Amber note shown under the heading of team alerts Turnstile couldn't verify. */
export const UNVERIFIED_NOTE = `
              <p style="margin:12px 0 0 0; padding:8px 12px; background-color:#FFF4D6; border-left:4px solid #E0A100; font-size:13px; line-height:20px; color:#6B4E00;">Not verified by the security check. Please review before responding.</p>`;

export function contactEmail({
  name,
  email,
  phone,
  message,
  verified = true,
  submittedAt = new Date(),
}: {
  name: string;
  email: string;
  /** E.164; shown as "+44 7911 123456". */
  phone?: string;
  message: string;
  /** False when Turnstile couldn't verify the submission: the email says so. */
  verified?: boolean;
  submittedAt?: Date;
}) {
  const when = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Africa/Lagos",
  }).format(submittedAt);
  const firstName = name.trim().split(/\s+/)[0] || name;
  const replyHref = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent("Re: your message to JCTEF")}`;

  const e = escapeHtml;
  const row = (label: string, value: string, last = false) => `
                <tr>
                  <td width="120" style="padding:8px 0;${last ? "" : " border-bottom:1px solid #E3E6EF;"} font-weight:700; color:#13225C; vertical-align:top;">${label}</td>
                  <td style="padding:8px 0;${last ? "" : " border-bottom:1px solid #E3E6EF;"}">${value}</td>
                </tr>`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New message from the website</title>
</head>
<body style="margin:0; padding:0; background-color:#F4F5F8;">
  <div style="display:none; max-height:0; overflow:hidden; mso-hide:all; font-size:1px; line-height:1px; color:#F4F5F8;">
    ${e(message.slice(0, 120))}
  </div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F4F5F8;">
    <tr>
      <td align="center" style="padding:24px 12px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"
               style="width:600px; max-width:100%; background-color:#FFFFFF; border:2px solid #13225C;">

          <tr>
            <td style="padding:16px 24px; background-color:#13225C; font-family:Arial, Helvetica, sans-serif; font-size:13px; font-weight:800; letter-spacing:1px; text-transform:uppercase; color:#9FD49A;">
              New message · jctef.org contact form
            </td>
          </tr>

          <tr>
            <td style="padding:24px 24px 4px 24px; font-family:Arial, Helvetica, sans-serif;">
              <h1 style="margin:0; font-size:22px; line-height:28px; color:#13225C;">${e(name)}</h1>
              <p style="margin:6px 0 0 0; font-size:15px; color:#3B4466;">sent a message through the website.</p>${verified ? "" : UNVERIFIED_NOTE}
            </td>
          </tr>

          <tr>
            <td style="padding:16px 24px 8px 24px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding:16px 18px; background-color:#FDF8EF; border-left:4px solid #58A94F; font-family:Arial, Helvetica, sans-serif; font-size:15px; line-height:24px; color:#13225C; white-space:pre-line;">${e(message)}</td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:8px 24px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
                     style="font-family:Arial, Helvetica, sans-serif; font-size:14px; line-height:22px; color:#3B4466; border-collapse:collapse;">${row(
                       "Email",
                       `<a href="mailto:${e(email)}" style="color:#13225C;">${e(email)}</a>`,
                     )}${row("Phone", phone ? `<a href="tel:${e(phone)}" style="color:#13225C;">${e(formatPhone(phone))}</a>` : "Not given")}${row(
                       "Sent",
                       e(when),
                       true,
                     )}
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:16px 24px 8px 24px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" bgcolor="#58A94F" style="background-color:#58A94F; border:2px solid #13225C; border-right-width:4px; border-bottom-width:4px;">
                    <a href="${replyHref}" target="_blank" rel="noopener noreferrer"
                       style="display:inline-block; padding:12px 22px; font-family:Arial, Helvetica, sans-serif; font-size:14px; font-weight:800; letter-spacing:1px; text-transform:uppercase; color:#13225C; text-decoration:none;">
                      Reply to ${e(firstName)}
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:8px 24px 24px 24px; font-family:Arial, Helvetica, sans-serif; font-size:13px; line-height:20px; color:#6B7290;">
              Or just hit Reply: your answer goes straight to ${e(firstName)}.
              Sent from the contact form on <a href="${site.url}/contact" style="color:#6B7290;">${site.url.replace("https://", "")}/contact</a>.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = [
    `New message from the jctef.org contact form`,
    ``,
    `From: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone ? formatPhone(phone) : "Not given"}`,
    `Sent: ${when}`,
    ...(verified ? [] : [`Not verified by the security check. Please review before responding.`]),
    ``,
    message,
    ``,
    `Reply to this email to answer ${firstName} directly.`,
  ].join("\n");

  return { subject: `Website enquiry from ${name}`.slice(0, 150), html, text };
}
