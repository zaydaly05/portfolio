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

## 3. Build and install the app

You need the [Flutter SDK](https://docs.flutter.dev/get-started/install) with the Android toolchain.

```bash
cd admin_app
flutter pub get
flutter build apk --release
```

The installer is created at `build/app/outputs/flutter-apk/app-release.apk`. Copy it to your phone
(USB, Drive, Telegram…), open it and allow "install unknown apps" when asked. With the phone connected
over USB and USB debugging on, you can also run `flutter install`.

## 4. First launch

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
