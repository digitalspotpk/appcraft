# 📱 Deploy AppCraft from Termux — 100% Free (Step by Step)

This guide deploys your Next.js app using **Termux on your Android phone**.
Hosting is **Vercel** (free Hobby plan — no credit card, native Next.js
support, works perfectly with Termux). Firebase stays on the free **Spark**
plan for Auth + Firestore — nothing here needs Blaze/paid billing.

> Why not Firebase Hosting? Its full SSR support for Next.js runs through
> Cloud Functions, which requires the Blaze plan. Vercel doesn't.

---

## 0. What you need first

- A free **GitHub** account → https://github.com/join
- A free **Vercel** account → https://vercel.com/signup (sign up with GitHub, one tap)
- Your phone, with Termux installed from **F-Droid** (not the outdated Play Store version): https://f-droid.org/packages/com.termux/

---

## 1. Set up Termux

Open Termux and run:

```bash
# Give Termux access to your phone's storage (so it can see the project folder
# if you downloaded the zip to your Downloads folder)
termux-setup-storage

# Update packages
pkg update -y && pkg upgrade -y

# Install Node.js, git, and unzip
pkg install -y nodejs-lts git unzip

# Confirm versions
node -v
npm -v
git --version
```

---

## 2. Get the project onto your phone

If you downloaded the project zip from this chat to your phone's Downloads folder:

```bash
cd ~
mkdir -p appcraft && cd appcraft
unzip /sdcard/Download/appcraft-saas-platform-development.zip -d .
ls
```

You should see `package.json`, `src/`, `.env.local`, etc.

---

## 3. Install dependencies

```bash
cd ~/appcraft
npm install
```

This can take a few minutes on a phone — that's normal. If it fails on a
native module, re-run `npm install` once more (Termux's ARM builds
sometimes need a retry).

---

## 4. Quick local test (optional but recommended)

```bash
npm run dev
```

Open the printed URL (usually `http://localhost:3000`) in your phone's
browser to confirm the app loads, the new landing page shows for logged-out
visitors, and login/signup work. Stop it with `Ctrl+C` when done.

---

## 5. Push the project to GitHub

```bash
cd ~/appcraft
git init
git add .
git commit -m "Initial commit — AppCraft ready for deployment"
```

Now create an empty repository on GitHub (via your phone's browser):
1. Go to https://github.com/new
2. Name it `appcraft` (or anything you like)
3. Leave it empty — do **not** add a README/.gitignore there
4. Click **Create repository**

GitHub will show you a remote URL. Back in Termux:

```bash
git remote add origin https://github.com/YOUR_USERNAME/appcraft.git
git branch -M main
git push -u origin main
```

You'll be asked for your GitHub username and a **Personal Access Token**
(not your password — GitHub removed password auth for git operations).
Create one at https://github.com/settings/tokens → **Generate new token
(classic)** → check the `repo` box → generate → copy it and paste it as
the password when Termux asks.

> ✅ Because `.env.local` and the service-account key filename are already
> listed in `.gitignore`, your Firebase secrets will **not** be pushed to
> GitHub. Only your code goes up.

---

## 6. Deploy to Vercel

**Easiest path — no CLI needed:**

1. On your phone, go to https://vercel.com/new
2. Click **Import Git Repository**, choose the `appcraft` repo you just pushed
3. Vercel auto-detects Next.js — leave the build settings as default
4. Before clicking Deploy, open **Environment Variables** and paste in
   every value from your `.env.local` file (one by one — key, then value):
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
   - `NEXT_PUBLIC_WHATSAPP_NUMBER`
   - `FIREBASE_ADMIN_PROJECT_ID`, `FIREBASE_ADMIN_CLIENT_EMAIL`,
     `FIREBASE_ADMIN_PRIVATE_KEY` (only if you plan to use admin features —
     safe here because Vercel keeps these server-side and never ships
     them to the browser)
5. Click **Deploy**. Wait ~1-2 minutes.

**Alternative — CLI from Termux**, if you prefer staying in the terminal:

```bash
npm install -g vercel
vercel login          # opens a link to confirm in your browser
vercel                # first run: answer the setup prompts
vercel --prod         # deploy to production
```

When prompted, add the same environment variables (`vercel env add <NAME>`)
or paste them in the Vercel dashboard afterwards — either works.

---

## 7. One crucial Firebase step: authorize your new domain

Google Sign-In and Firebase Auth will silently fail on your live URL until
you allow it:

1. Firebase Console → **Authentication** → **Settings** → **Authorized domains**
2. Click **Add domain**
3. Paste your Vercel URL, e.g. `appcraft.vercel.app`
4. Save

---

## 8. You're live 🎉

Visit your Vercel URL — you should see the new landing page. Sign up,
verify the dashboard loads, and check the admin account (see
`DEPLOYMENT_GUIDE.md` §8 to promote your account to admin).

### Redeploying after future changes

From Termux, any time you edit code:

```bash
cd ~/appcraft
git add .
git commit -m "Describe your change"
git push
```

Vercel automatically redeploys on every push to `main` — no extra steps.

---

## Troubleshooting

- **`npm install` fails on Termux** — run `pkg install -y python make clang` first (some packages need a native build toolchain), then retry.
- **Git push asks for password repeatedly** — you're using your GitHub account password instead of a Personal Access Token; generate one as described in step 5.
- **Google Sign-In error `auth/unauthorized-domain`** — you skipped step 7. Add your exact Vercel domain to Firebase's authorized domains list.
- **Blank page / Firestore errors in production** — double-check every `NEXT_PUBLIC_...` variable was added in Vercel's Environment Variables and that you redeployed after adding them (env var changes need a redeploy to take effect).
