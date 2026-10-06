# Portfolio Admin (mobile app)

A private Android app to manage your portfolio from your phone. It talks to the same server and
database as your website through a small, key-protected admin API. There is **no login screen**:
you enter the website address and your admin key once, and the app remembers them.

What you can do from the app:

| Tab | Actions |
| --- | --- |
| **Home** | See database status, stars / reviews / message counts; change the star count |
| **Content** | Edit **everything the website shows**: projects, experience, certificates, featured stack, skills, languages, education, activities, your profile (name, photo, links, CV link…), the home slides / stats / section cards, FAQ and the page texts. Add, delete and re-order items; reset any section to the built-in content. **Projects → ⋮ → Import from GitHub** adds new repositories automatically |
| **Reviews** | Add, edit, delete reviews |
| **Messages** | Read, copy the sender's email, delete contact-form messages |
| **Settings** | Server address + admin key, connection test, server logs |

Edits to content go live on the website within ~15 seconds.

## 1. Protect the server with an admin key (once)

The admin API is **disabled until you set a secret**. Generate one and add it as an environment
variable on the server:

```bash
openssl rand -hex 32        # copy the output
```

* **Vercel:** Project → Settings → Environment Variables → add `ADMIN_API_KEY` = *the key* → redeploy.
* **Local server:** put `ADMIN_API_KEY=...` in `.env.local`.

The key must be at least 20 characters. After 10 wrong attempts an address is locked out for 15 minutes.

Check it works from your computer:

```bash
cd admin_app
dart run tool/check_server.dart https://YOUR-SITE.vercel.app YOUR_ADMIN_KEY
```

## 2. Set up the CV (PDF)

Your CV keeps its exact LaTeX layout (the one in `latex-cv/main.tex`). Its **content** lives in the database
(admin app → Content → **CV (PDF)**), and a GitHub Action compiles it into the PDF whenever the content changes.
The site then points its CV viewer / download buttons at the new PDF automatically.

One-time setup:

1. Create a secret: `openssl rand -hex 32`.
2. Add it on the server as `CV_BUILD_KEY` (Vercel → Environment Variables) and redeploy.
3. In the GitHub repository → Settings → Secrets and variables → Actions, add two secrets:
   `CV_BUILD_KEY` (same value) and `PORTFOLIO_URL` (e.g. `https://your-portfolio.vercel.app`).
4. Optional, for instant builds: add `GITHUB_TOKEN` on the server (fine-grained token, repository
   permission **Actions: Read and write**). Without it the workflow still runs every 30 minutes.
5. Open the app → Home → **Rebuild now** to generate the first PDF.

If a build fails, the Home card shows the LaTeX error. Your previous PDF stays online.

## 3. Automatic changes need your approval

Once a day (Vercel Cron, 06:00 UTC) and whenever you tap **Check GitHub now**, the server compares your
public GitHub repositories with your portfolio. New ones (with a description or topics) become a **pending
change**. Nothing is published until you decide:

* **In the app:** Home → *Changes to approve* — edit the name / date / stack / description, then **Approve** or **Reject**.
* **On WhatsApp** (when enabled): reply **1** to approve, **3** to reject, or **2 name: …; stack: …; description: …**
  to modify (I ask again afterwards). With several changes waiting, add the code: `1 K7Q2`.

Approving adds the project to your portfolio **and** your CV, rebuilds the CV and sends you the new PDF.
Edits you make yourself in the app are applied immediately (and also rebuild the CV when they affect it).

Setup: add `CRON_SECRET` (min. 20 characters) on the server — Vercel then sends it to the cron job automatically.

### Turning WhatsApp on (it is off until you do)

1. In Kapso/Meta create the webhook pointing to `https://YOUR-SITE/api/whatsapp/webhook` and choose your own
   verify token → `WHATSAPP_VERIFY_TOKEN`; copy the webhook signing secret → `KAPSO_WEBHOOK_SECRET`.
2. Set `KAPSO_API_KEY`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_PHONE` (your private number) and finally
   `WHATSAPP_ENABLED=true`.
3. **24-hour rule:** WhatsApp only lets the business send normal messages within 24 hours after *you* last
   wrote to the business number. Outside that window (typically the first message of the day) approval
   requests need an approved **utility template**. Create one in Kapso (suggested body:
   `Portfolio update {{1}}: {{2}} Reply 1 to approve, 2 followed by changes to modify, or 3 to reject.`)
   and set `WHATSAPP_APPROVAL_TEMPLATE` to its name. Whatever you answer opens the window, so the
   confirmation and the new CV PDF can then be delivered. You can always decide in the app instead.
4. Only your number, on requests carrying a valid signature, can approve anything.

## 4. Build and install the app

**No Flutter needed:** in GitHub open Actions → *Build admin app (APK)* → *Run workflow*. When it finishes, open the run and download the `portfolio-admin-apk` artifact (a zip containing `app-release.apk`), then install it on your phone.

Or build it yourself:

You need the [Flutter SDK](https://docs.flutter.dev/get-started/install) with the Android toolchain.

```bash
cd admin_app
flutter pub get
flutter build apk --release
```

The installer is created at `build/app/outputs/flutter-apk/app-release.apk`. Copy it to your phone
(USB, Drive, Telegram…), open it and allow "install unknown apps" when asked. With the phone connected
over USB and USB debugging on, you can also run `flutter install`.

## 5. First launch

Open the app → it opens **Settings** → enter

* **Website address:** e.g. `https://your-portfolio.vercel.app`
* **Admin key:** the `ADMIN_API_KEY` value

and tap **Save & test connection**. Done.

## Good to know

* **Reviews, messages and stars** live in MongoDB, so they need `MONGODB_URI` on the server. The
  Home tab shows a warning when the database is not connected.
* **All site content lives in the database** (collection `portfoliosections`, one document per section). On
  first run the server copies the built-in content from `data/defaults.js` into the database; after that the
  database is the source of truth. *Reset to built-in* (⋮ menu in a section) restores that section.
* **Texts can use placeholders**: `{name}`, `{firstName}`, `{projectsCount}`, `{certificatesCount}`,
  `{internshipsCount}`, `{skillCategoriesCount}`, `{location}`.
* **Home stats** can show a live number (`github_repos`, `projects`, `skill_categories`, `certificates`,
  `internships`) or a `fixed` number you type.
* **Images / PDFs** are edited as links (for example Cloudinary URLs); the app does not upload files.
* The two LinkedIn recommendations shown on the site come from the codebase, not the database, so
  they cannot be edited here.
* Page `<title>` tags and search-engine metadata in the HTML files are static.
* The text already inside the HTML files is only a fallback shown if the server cannot be reached.
* The admin key is saved on the phone only and sent in an `x-admin-key` header over HTTPS.
  Anyone who has it can change your portfolio, so keep it private; to revoke it, change
  `ADMIN_API_KEY` on the server.
* To test against a server on your local network over plain `http://`, add
  `android:usesCleartextTraffic="true"` to the `<application>` tag in
  `android/app/src/main/AndroidManifest.xml`.

## Development

```bash
flutter analyze
flutter test
```

## Contacts vault & monthly broadcast

The broadcast itself stays manual in Kapso (once a month, approved template
`portfolio_published_alert`). The app keeps a safe copy of your numbers so a
phone-contacts mishap never loses them:

- **Contacts vault** (dashboard) — add, edit, import (paste numbers, lines or a
  vCard) and export. Local numbers like `01017741741` become `201017741741`
  (change the default with `DEFAULT_COUNTRY_CODE`).
- **Never deleted** — "delete" only moves a contact to the trash and it can be
  restored. Every edit keeps the previous values (last 20).
- **Backup** — use *Export* to copy a CSV (`name,phone_e164,…`) and import that
  file into Kapso before each monthly send.

### Which number does what
- **Kapso sender (+968 7785 0544, "Techno Express")** — the business number that sends the monthly broadcast to your Kapso contacts. You send it manually in Kapso. This app never reads, edits or imports your Kapso contact list.
- **Your private number (+201017741741)** — set as `WHATSAPP_PHONE`. The business number messages it for approvals and sends the new CV; only replies from this number are accepted.
- The contacts vault is only an independent backup copy. `ALLOW_SERVER_BROADCAST` stays `false`.
