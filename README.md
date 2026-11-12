# JCTEF website

The website of the Jacob Chidimma Transformation and Empowerment Foundation (jctef.org). It is built with Next.js and Cruise UI.

## Run it locally

You need Node.js 22. If you use nvm, run `nvm use` and it reads the version from `.nvmrc`.

```bash
npm install
cp .env.example .env.local   # then fill in the values (see "Email setup" below)
npm run dev                  # http://localhost:3000
```

Before you deploy, check the site with:

```bash
npm run build && npm run lint
```

## Where to edit things

| What | Where |
| --- | --- |
| Page text, contact details, social links, events, FAQs, testimonials | `src/lib/content.ts` |
| Blog posts | `content/blog/<slug>.mdx`, one file per post |
| Images | `public/images/` (blog covers: `public/images/blog/`) |

**Events.** An event disappears from the site by itself once its `endsAt` time has passed. If it has no `endsAt`, it disappears at the end of its start day. An event with no date ("to be announced") always shows.

**Homepage photos.** The slideshow behind the homepage heading uses photos hosted on Cloudinary (cloud `dreezy`), listed in `heroSlides` in `src/lib/content.ts`.

1. Upload the photo to the Cloudinary Media Library. Any format works, including iPhone HEIC. Cloudinary converts each photo for every browser and crops it around faces, separately for phones and desktop.
2. Copy its **public ID**, for example `IMG_7078_tocqtx`, into `heroSlides`. Don't paste the full URL.
3. Write `alt` text describing who is in the photo and what is happening.
4. Set `focus` to fine-tune the crop if a face is cut off, for example `"center 30%"`.

Before you upload a photo:

- Use **landscape** photos of about **1920 × 1080 pixels**, ideally **under 300 KB**.
- Use only photos that everyone shown has agreed to.

The site needs `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dreezy` (see `.env.example`). If it's missing, or the list is empty, the homepage shows the illustration layout instead.

**Blog posts.** To add a post, copy an existing `.mdx` file and change its frontmatter (the block between the `---` lines) and the text. The file name becomes the web address: `my-post.mdx` appears at `/blog/my-post`.

## Email setup (Brevo)

The contact form and the newsletter both use Brevo. You do the setup once, then add the details to the hosting environment.

### 1. Create the Brevo account

Sign up at <https://www.brevo.com> using **info@jctef.org**. Then everyone on the team can recover the account, not only the person who set it up.

### 2. Verify the jctef.org domain

1. In Brevo, open **Settings → Senders, domains & dedicated IPs → Domains** and click **Add a domain**. Enter `jctef.org`.
2. Brevo lists DNS records: a Brevo code, DKIM and DMARC. Add each one in the DNS settings wherever jctef.org is registered.
3. Click **Verify** and wait until every record shows a tick. This can take a few hours.
4. Under **Senders**, add a sender on that domain, for example `info@jctef.org` named "JCTEF website". This is the `CONTACT_FROM_EMAIL`.

Until the domain is verified, contact form emails may be rejected or end up in spam.

### 3. Create the newsletter list

1. Go to **Contacts → Lists → Create a list** and name it, for example "JCTEF newsletter".
2. Note the number in the list's **ID** column. This is the `BREVO_LIST_ID`.

**Double opt-in.** Subscribers confirm their email address before they're added to the list. The confirmation email's HTML is kept in this repo at `emails/brevo/confirm-subscription.html`. Follow `emails/brevo/README.md` to paste it into Brevo, tag it `optin`, activate it and copy its ID into `BREVO_DOI_TEMPLATE_ID`. After confirming, subscribers land on `/newsletter/confirmed`.

### 4. Generate the API key

Go to **Settings → SMTP & API → API keys → Generate a new API key**. Give it the **Contacts** and **Transactional email** permissions, and turn off **Authorised IPs** blocking (Security → Authorised IPs), because hosting providers don't use fixed addresses. Name it "jctef.org website" and copy it straight away, because Brevo shows it only once. This is the `BREVO_API_KEY`.

Treat the key like a password:

- don't email it
- don't paste it in chat
- never commit it to git

### 5. Add the environment variables

`.env.example` lists every variable with a short explanation.

- **On your computer:** copy it to `.env.local` and fill in the values. `.env.local` is ignored by git.
- **In production:** open your hosting provider's project settings (on Vercel: **Settings → Environment Variables**), add the same variables, then redeploy.

| Variable | Example | Used by |
| --- | --- | --- |
| `BREVO_API_KEY` | `xkeysib-…` | Contact form and newsletter |
| `CONTACT_TO_EMAIL` | `info@jctef.org` | Contact form: where messages arrive |
| `CONTACT_FROM_EMAIL` | `info@jctef.org` | Contact form: the verified sender |
| `BREVO_LIST_ID` | `3` | Newsletter |
| `BREVO_DOI_TEMPLATE_ID` | `5` | Newsletter confirmation email |
| `NEXT_PUBLIC_SITE_URL` | `https://jctef.org` (`http://localhost:3000` locally) | Link back to the site after confirming |

When someone replies to a contact form email, the reply goes to the visitor, because the visitor's address is set as reply-to.

Both forms have two kinds of spam protection:

- a hidden "honeypot" field that bots fill in and people don't see
- a limit of 5 submissions per visitor every 15 minutes

## Analytics

The site uses [PostHog](https://posthog.com) (EU Cloud, data stored in the EU) to count visits and see which pages and buttons are used. It's set up in `src/instrumentation-client.ts`; events are sent with `track()` from `src/lib/analytics.ts`, which does nothing if PostHog isn't loaded, so analytics can never break a form or a button.

### Setup

1. Create a PostHog account in the **EU** region and a project for jctef.org.
2. In the project: **Settings → Project → Web analytics**, turn on **Enable cookieless tracking** and save. Without it, PostHog throws away the visits of everyone who hasn't accepted cookies, which is most visitors.
3. Check **Settings → Project → General → IP data capture** is set to discard IPs (the default for EU organisations).
4. On Netlify, add `NEXT_PUBLIC_POSTHOG_KEY` (the project token, starting `phc_`) for the **Production** context only, then redeploy. It's public by design. Deploy previews on `*.netlify.app` can't use the proxy (Netlify changes a header on that domain that PostHog can't read), so leave the variable unset there.

Without `NEXT_PUBLIC_POSTHOG_KEY` (for example on your computer), nothing loads and no cookie banner appears.

The browser never talks to posthog.com: requests go to `jctef.org/k7q2/…`, which Netlify forwards to PostHog (`netlify.toml`), or Next.js does locally (`next.config.ts`). The path comes from `analytics-proxy.mjs`, and the build fails if `netlify.toml` and that file disagree. Because of this, the Content Security Policy needs no PostHog entries.

### Consent

- **Before a visitor chooses, after Decline, and when the browser sends Do Not Track or Global Privacy Control:** cookieless mode. Nothing is stored on the device; PostHog counts visitors with an anonymous hash made on its servers, which can't follow a person from one day to the next.
- **After Accept:** PostHog stores a cookie and some local storage, so returning visitors and whole visits can be recognised.
- The banner at the bottom of the page asks once. The choice is kept in the browser (`jctef-analytics-consent` in localStorage). **Cookie settings** in the footer opens it again. The [privacy page](https://jctef.org/privacy) explains this to visitors; its copy is `privacy` in `src/lib/content.ts` and should be reviewed by the team.

### What's tracked

Page views (including moves between pages without a reload, counted once each), how long people stay, and clicks on links and buttons outside forms (PostHog autocapture), plus these events:

| Event | When | Properties |
| --- | --- | --- |
| `donate_clicked` | Any link to the Flutterwave donate page | `location`: `header`, `menu` (mobile), `hero`, `footer`, or the page (`home`, `get_involved`, `programmes`, …) |
| `volunteer_application_submitted` | The application was sent | `role`, `verified` |
| `partner_enquiry_submitted` | The enquiry was sent | `org_type`, `verified` |
| `contact_message_sent` | The message was sent | `verified` |
| `newsletter_signup_started` | The confirmation email was sent | none |
| `newsletter_confirmed` | Someone opened `/newsletter/confirmed` from that email | none |
| `reset_register_clicked` | A link to the RESET registration page | `location` |
| `whatsapp_clicked` | A WhatsApp link | `location` (`footer`, `contact`) |
| `cohort_join_clicked` | "Join the next cohort" on `/institute` | none |
| `programme_viewed` | A programme's section reaches the middle of the screen on `/programmes` (once per programme per visit) | `programme` (its name) |
| `blog_post_read` | A reader scrolls past about 75% of a post | `slug` |

`verified` says whether the Cloudflare security check confirmed a person (see the Verified column in the Google Sheet). Form events fire only after the server accepted the form, never for spam caught by the honeypot.

### What isn't tracked

- No names, email addresses, phone numbers or anything typed into a form, ever. Clicks inside forms aren't autocaptured at all.
- No `identify()`: the site has no logins, so visitors stay anonymous.
- Web addresses are cleaned before sending: query parameters that could hold personal data (`email`, `name`, `token`, anything containing `@`, …) are removed.
- No session recordings. They're switched off in code; if they're ever turned on, form fields and all text inside forms are masked.

### Checking that events arrive

1. Open jctef.org in a normal browser window (not a headless or automated one: PostHog drops those as bots).
2. Open the developer tools, **Network** tab, and filter for `k7q2`. You should see requests to `/k7q2/e/` (events) and `/k7q2/flags/` with status `200`.
3. In PostHog, open **Activity** (or **Explore → Events**): your `$pageview` appears within a minute. Click Donate and look for `donate_clicked`.
4. Before you choose in the banner, events show the person as `$posthog_cookieless`. Click **Accept** and the next events have a normal anonymous ID. **Decline** (via Cookie settings) switches back.
5. Nothing showing? Check the variable is set for Production on Netlify and you redeployed, that cookieless tracking is on in the project, that the deploy log says "Processed … redirect rules", and that an ad blocker isn't blocking the page itself.

### Suggested dashboards

- **Weekly overview:** visitors and page views (Web analytics), top pages, top referrers and countries.
- **Donations:** `donate_clicked` per week, broken down by `location`, to see which buttons work.
- **Applications and enquiries:** `volunteer_application_submitted` by `role`, `partner_enquiry_submitted` by `org_type`, `contact_message_sent`, each per week, plus the share with `verified = false`.
- **Newsletter funnel:** `newsletter_signup_started` → `newsletter_confirmed` (confirmation rate).
- **Content:** `blog_post_read` by `slug` against blog page views, and `programme_viewed` by `programme`.
- **Events and cohorts:** `reset_register_clicked`, `cohort_join_clicked` and `whatsapp_clicked` per week.

Funnels that follow one person across days only work for visitors who accepted cookies; counts and trends include everyone.
