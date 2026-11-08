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

The template uses `LOGO_URL` as a placeholder for the JCTEF logo.

1. Upload `public/images/jctef-logo.png` to Cloudinary (cloud `dreezy`) with the public ID `jctef-logo`.
2. Replace `LOGO_URL` with:

   ```text
   https://res.cloudinary.com/dreezy/image/upload/f_png,w_320,q_auto/jctef-logo
   ```

   The address forces PNG, because some email apps can't show WebP or AVIF. It requests 320px wide, double the 160px display size, so the logo stays sharp on retina screens.

### Paste it into Brevo

1. In Brevo, go to **Campaigns → Templates** (or **Transactional → Templates**) → **New template**.
2. Fill in the template details:
   - **Template name:** JCTEF – Confirm subscription
   - **Subject:** Please confirm your subscription to JCTEF updates
   - **From email:** the address in `CONTACT_FROM_EMAIL`, for example website@jctef.org. It must be a verified sender on the jctef.org domain.
   - **From name:** JCTEF
3. Choose **Code your own** and paste the full contents of `confirm-subscription.html`.
4. In the template settings, add the tag **optin**. Brevo needs this tag to use the template for double opt-in.
5. Save, then **activate** the template.
6. Copy the template's **ID**, the number shown in the template list, into `BREVO_DOI_TEMPLATE_ID`:
   - **On your computer:** in `.env.local`
   - **In production:** in the hosting provider's environment variables

### After any edit

Edit the file here first, then paste the new version into the same Brevo template. The template ID stays the same, so nothing else needs to change.

## Related settings

| Variable | Purpose |
| --- | --- |
| `BREVO_API_KEY` | Server-only key with **Contacts** and **Transactional email** permissions |
| `BREVO_LIST_ID` | The newsletter list that confirmed subscribers join |
| `BREVO_DOI_TEMPLATE_ID` | The ID of this template in Brevo |
| `NEXT_PUBLIC_SITE_URL` | Used to build the "confirmed" link: `<site>/newsletter/confirmed` |
