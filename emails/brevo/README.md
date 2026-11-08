# Brevo email templates

The HTML files in this folder are the source of truth for JCTEF's Brevo emails. Edit them here so every change is tracked in git, then paste the new version into Brevo.

## confirm-subscription.html

This is the double opt-in email. Brevo sends it when someone signs up for the newsletter on the website. They're added to the list only after they click the button.

Two Brevo placeholders must stay exactly as they are:

| Placeholder | What it does |
| --- | --- |
| `{{ doubleoptin }}` | The confirmation link. It's on the "Confirm my subscription" button. |
| `{{ contact.FIRSTNAME \| default : "there" }}` | The greeting. It uses the first name from the form, or "there" if none was given. |

### Before pasting: the logo

The template uses `LOGO_URL` as a placeholder for the logo, which is the site icon (the green globe favicon). Before pasting into Brevo, replace `LOGO_URL` with:

```text
https://jctef.org/icons/icon-192.png
```

That address only works once the new site is live on jctef.org. To test earlier, upload `public/icons/icon-192.png` to Cloudinary and use its address instead.

### Paste it into Brevo

1. In Brevo, go to **Campaigns → Templates** (or **Transactional → Templates**) → **New template**.
2. Fill in the template details:
   - **Template name:** JCTEF – Confirm subscription
   - **Subject:** Please confirm your subscription to JCTEF updates
   - **From email:** the address in `CONTACT_FROM_EMAIL`, for example info@jctef.org. It must be a verified sender on the jctef.org domain.
   - **From name:** JCTEF
3. Choose **Code your own** and paste the full contents of `confirm-subscription.html`.
4. In the template settings, add the tag **optin**. Brevo needs this tag to use the template for double opt-in.
5. Save, then **activate** the template.
6. Copy the template's **ID**, the number shown in the template list, into `BREVO_DOI_TEMPLATE_ID`:
   - **On your computer:** in `.env.local`
   - **In production:** in the hosting provider's environment variables

### After any edit

Edit the file here first, then paste the new version into the same Brevo template. The template ID stays the same, so nothing else needs to change.

## Volunteer emails

The volunteer form on `/get-involved#volunteer-form` sends two emails. **They don't need to be set up in Brevo.** The website reads these files, fills in the placeholders on the server and sends the finished HTML through Brevo, from `CONTACT_FROM_EMAIL`.

| File | Sent to | Subject |
| --- | --- | --- |
| `volunteer-team-alert.html` | The team (`VOLUNTEER_TO_EMAIL`, default info@jctef.org). Replying goes to the applicant. | New volunteer application: {name} ({role}) |
| `volunteer-received.html` | The applicant. Replying goes to info@jctef.org. | We've received your volunteer application |

To change an email, edit the file and redeploy. The site's renderer understands the same tags the files already use:

- `{{ params.NAME }}`
- `{{ params.NAME | default : "…" }}`
- `{% if params.NAME %}…{% endif %}`
- `{% if params.NAME == "…" %}…{% endif %}`

All values are HTML-escaped. `LOGO_URL` is replaced with the site icon, the favicon, on the live site (`/icons/icon-192.png`).

Available placeholders: `FIRSTNAME`, `FULLNAME`, `EMAIL`, `PHONE`, `LOCATION`, `ROLE`, `AREAS`, `AVAILABILITY`, `EXPERIENCE`, `MESSAGE` and `SUBMITTED_AT` (Lagos time).

### Volunteer contact list

Every applicant is also added or updated as a Brevo contact, so the team has a record.

1. Create a list, for example "Volunteer applicants", and put its ID in `BREVO_VOLUNTEER_LIST_ID`.
2. Go to **Contacts → Settings → Contact attributes** and create a **text** attribute named `VOLUNTEER_ROLE`. `FIRSTNAME`, `LASTNAME` and `SMS` already exist.
3. The API key needs the **Contacts** permission.

If saving the contact fails, the application still goes through and the error is logged on the server.

## Partnership emails

The partnership enquiry form on `/get-involved#partner-form` works like the volunteer form. The site renders these files and sends them through Brevo, so there's nothing to set up in Brevo.

| File | Sent to | Subject |
| --- | --- | --- |
| `partner-team-alert.html` | The team (`PARTNER_TO_EMAIL`, e.g. partner@jctef.org; info@jctef.org if not set). Replying goes to the enquirer. | New partnership enquiry: {{ params.ORGANISATION }} ({{ params.ORG_TYPE }}) |
| `partner-received.html` | The enquirer. Replying goes to `PARTNER_TO_EMAIL`. | We've received your partnership enquiry |

Placeholders: `FIRSTNAME`, `FULLNAME`, `EMAIL`, `PHONE`, `ORGANISATION`, `ROLE`, `ORG_TYPE`, `AREAS`, `WEBSITE`, `MESSAGE` and `SUBMITTED_AT` (Lagos time).

### Partner contact list

1. Create a list, for example "Partnership enquiries", and put its ID in `BREVO_PARTNER_LIST_ID`.
2. Go to **Contacts → Settings → Contact attributes** and create a **text** attribute named `ORG_TYPE`. `FIRSTNAME`, `LASTNAME`, `COMPANY` and `SMS` already exist. If `COMPANY` doesn't, create it as text too.
3. The API key needs the **Contacts** permission.

If saving the contact fails, the enquiry still goes through and the error is logged.

## Related settings

| Variable | Purpose |
| --- | --- |
| `BREVO_API_KEY` | Server-only key with **Contacts** and **Transactional email** permissions |
| `BREVO_LIST_ID` | The newsletter list that confirmed subscribers join |
| `BREVO_DOI_TEMPLATE_ID` | The ID of this template in Brevo |
| `NEXT_PUBLIC_SITE_URL` | Used to build the "confirmed" link: `<site>/newsletter/confirmed` |
| `VOLUNTEER_TO_EMAIL` | Where volunteer applications go (default info@jctef.org) |
| `BREVO_VOLUNTEER_LIST_ID` | List that keeps a record of every applicant |
| `PARTNER_TO_EMAIL` | Where partnership enquiries go, e.g. partner@jctef.org (info@jctef.org if not set) |
| `BREVO_PARTNER_LIST_ID` | List that keeps a record of every enquirer |
