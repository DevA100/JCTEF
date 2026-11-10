# Website form submissions in Google Sheets

Every time someone sends one of the forms on jctef.org, a new row is added to
a Google Sheet, just like the old Google Form did. The emails from the website
keep working exactly as before. The sheet is an extra copy.

| Form on the website | Tab in the sheet |
| --- | --- |
| Volunteer application (Get Involved) | **Volunteers** |
| Partnership enquiry (Get Involved) | **Partners** |
| Send us a message (Contact) | **Contact messages** |

You don't need to create the tabs. Each one appears, with its column headings,
the first time that form is used. The last column, **Status**, is left empty
for you to track follow-up, for example "Replied" or "Onboarded".

The **Verified** column says whether the website's security check (Cloudflare
Turnstile) confirmed the person was human. "No" usually means the check
couldn't load on their device, so the submission was still accepted, but it
could also be a bot. Look it over before you reply. Tabs created before this
column existed get it automatically, as a new column at the end.

The **Phone** column holds numbers in international (E.164) format, with the
plus sign and country code and no spaces, e.g. +2348031234567 or
+447911123456. People can give a number from any country.

Setup takes about 10 minutes. Do it once.

---

## 1. Create the sheet

1. Sign in to Google as **info@jctef.org**.
2. Go to [sheets.new](https://sheets.new) to create a new spreadsheet.
3. Name it, for example **JCTEF website submissions**.
4. Go to **File → Settings**. Set **Locale** to **Nigeria** (or United Kingdom)
   and **Time zone** to **(GMT+01:00) Lagos**, then **Save settings**.
   This makes dates read as day/month/year.

## 2. Add the script

1. In the sheet, go to **Extensions → Apps Script**. A new tab opens.
2. Delete everything in the editor (the `function myFunction() {}` lines).
3. Open the file **Code.gs** in this folder, copy **all** of it, and paste it
   into the editor.
4. Click the **Save** icon (or press Ctrl+S / Cmd+S).
5. At the top, give the project a name, for example **JCTEF website forms**.

## 3. Add the password (SECRET)

The website sends a password with every submission, so only jctef.org can add
rows to your sheet.

1. In Apps Script, click the **gear icon (Project Settings)** on the left.
2. Scroll to **Script Properties** and click **Add script property**.
3. **Property:** `SECRET`
   **Value:** the long password the web team gave you. Paste it exactly, with
   no spaces before or after.
4. Click **Save script properties**.

## 4. Publish it as a web app

1. Click **Deploy → New deployment** (top right).
2. Click the gear next to **Select type** and choose **Web app**.
3. Fill in:
   - **Description:** Website forms
   - **Execute as:** **Me (info@jctef.org)**
   - **Who has access:** **Anyone**
4. Click **Deploy**.
5. Google asks you to **Authorise access**. Choose info@jctef.org. If you see
   "Google hasn't verified this app", click **Advanced → Go to JCTEF website
   forms (unsafe)**. This is normal for your own scripts. Then click **Allow**.
6. Copy the **Web app URL**. It looks like
   `https://script.google.com/macros/s/AKfy…/exec`.

"Anyone" only means the website can reach the script. Nobody can read the
sheet, and nothing is added without the password.

## 5. Send the details to the web team

Send the **Web app URL** to the web team **privately**, for example in a
direct message, not in a group chat or an email thread with others. They
already have the password.

They'll add both to the website's settings, send a test from each form, and
confirm the rows arrive.

---

## Changing the script later

If you edit Code.gs, for example to change the column headings, publish the
change **without** changing the URL:

1. **Deploy → Manage deployments**.
2. Select the **Website forms** deployment and click the **pencil (Edit)** icon.
3. Under **Version**, choose **New version**.
4. Click **Deploy**.

The URL stays the same, so the website doesn't need updating. (Choosing
**New deployment** instead creates a new URL, which the web team would then
have to change.)

Renaming a column heading in the sheet itself is fine for the Status column,
but don't rename the others. The website matches columns by their heading, so
a renamed heading becomes a new column at the end. If the website starts
sending a new question, it also appears as a new column at the end.

## Keep the sheet private

The sheet contains people's names, emails, phone numbers and messages.

- Share it only with the people who follow up on applications and enquiries.
  Use **Share** and add them by email, as **Viewer** or **Editor**.
- Never set the link to **Anyone with the link**.
- Don't share the password (SECRET) or the web app URL with anyone outside
  the web team.
- When someone leaves the team, remove their access.
- If you think the password has leaked, ask the web team for a new one, update
  it in **Project Settings → Script Properties**, and they'll update the
  website. No redeploy is needed.

## If rows stop appearing

- The website still sends the emails, so nothing is lost. Check the inbox.
- Check that **Who has access** is still **Anyone** (**Deploy → Manage
  deployments**).
- Check that the SECRET in Script Properties matches the one the web team has.
- In Apps Script, the **Executions** page (on the left) shows each submission
  and any errors.
