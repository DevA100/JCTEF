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
