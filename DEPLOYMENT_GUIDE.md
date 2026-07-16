# 🚀 AppCraft by DigitalSpot — Complete Setup & Deployment Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Firebase Project Setup](#firebase-project-setup)
3. [Local Development Setup](#local-development-setup)
4. [Environment Variables](#environment-variables)
5. [Database (Firestore) Schema Setup](#firestore-schema-setup)
6. [Firebase Security Rules](#firebase-security-rules)
7. [Firebase Hosting Deployment](#firebase-hosting-deployment)
8. [First-Time Admin Configuration](#first-time-admin-configuration)
9. [Git & CI/CD](#git-cicd)
10. [Troubleshooting](#troubleshooting)

---

## 1. Prerequisites

Install these tools before starting:

```bash
# Node.js (v18+)
node --version  # should be 18+

# npm
npm --version

# Firebase CLI
npm install -g firebase-tools

# Git
git --version
```

---

## 2. Firebase Project Setup

### 2.1 Create Firebase Project

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Click **"Add project"**
3. Enter project name: `appcraft-digitalspot`
4. Enable Google Analytics (optional)
5. Click **"Create project"**

### 2.2 Enable Authentication

1. In Firebase Console → **Authentication** → **Sign-in method**
2. Enable **Email/Password**
3. Enable **Google** (click, configure web client ID)
4. Save

### 2.3 Enable Firestore Database

1. Firebase Console → **Firestore Database** → **Create database**
2. Select **"Start in production mode"**
3. Choose your region (e.g., `us-central1` or closest to your users)
4. Click **Enable**

### 2.4 ~~Enable Firebase Storage~~ — Not needed anymore ✅

This app **no longer uses Firebase Storage**, because Google now requires
the paid **Blaze** billing plan to use Cloud Storage buckets, even for
free-tier usage. To keep this project 100% free on the **Spark** (free)
plan, receipt images are compressed in the browser and saved as base64
text directly inside Firestore documents instead. You can skip this step
entirely — nothing to enable in the Storage tab.

### 2.5 Get Firebase Web Config


1. Firebase Console → ⚙️ **Project Settings** → **Your apps**
2. Click **"Add app"** → Select **Web (</>)**
3. Register app name: `AppCraft Web`
4. Copy the `firebaseConfig` object — you'll need this for `.env.local`

### 2.6 Get Service Account (Admin SDK)

1. Firebase Console → ⚙️ **Project Settings** → **Service accounts**
2. Select **Node.js** → Click **"Generate new private key"**
3. Download the JSON file — keep it **SECRET**
4. Extract: `project_id`, `client_email`, `private_key`

---

## 3. Local Development Setup

```bash
# Clone / navigate to your project
cd appcraft-digitalspot

# Install dependencies
npm install

# Copy environment template
cp .env.local.example .env.local   # or manually create .env.local

# Fill in environment variables (see section 4)
nano .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 4. Environment Variables

✅ **Already done for you** — a `.env.local` file with your real project
values (client config + admin service account) is already sitting in the
project root. You don't need to create or re-type anything. It's listed in
`.gitignore`, so it will never be committed to Git.

For reference, here's what it contains:

```env
# ================================================================
# Firebase Client SDK (Public — safe to expose in browser)
# ================================================================
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef...

# ================================================================
# Firebase Admin SDK (Server-side ONLY — NEVER expose publicly)
# ================================================================
FIREBASE_ADMIN_PROJECT_ID=your-project-id
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n"

# ================================================================
# App Configuration
# ================================================================
NEXT_PUBLIC_APP_NAME=AppCraft by DigitalSpot
NEXT_PUBLIC_WHATSAPP_NUMBER=923001234567
```

> ⚠️ **IMPORTANT**: Never commit `.env.local` to Git. It's already in `.gitignore`.

---

## 5. Firestore Schema Setup

Run these commands to initialize the Firestore database with the correct structure.
Open Firebase Console → **Firestore** → create these collections manually, OR use the Firebase Admin SDK script below.

### Initialize via Script

Create `scripts/init-firestore.js`:

```javascript
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json'); // your downloaded key

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function init() {
  // System Config
  await db.doc('config/system').set({
    appName: 'AppCraft by DigitalSpot',
    maintenanceMode: false,
    maintenanceMessage: 'We are upgrading our systems.',
    maintenanceEta: '2 hours',
    alertBannerActive: true,
    alertBannerMessage: '🚀 Welcome to AppCraft! Track your orders in real-time.',
    alertBannerType: 'info',
    whatsappNumber: '923001234567',
    pushNotificationsEnabled: true,
    loyaltyPointsRate: 10,
    currency: 'USD',
    updatedAt: new Date().toISOString(),
  });

  console.log('✅ Firestore initialized!');
  process.exit(0);
}

init().catch(console.error);
```

```bash
node scripts/init-firestore.js
```

### Collection Structure

| Collection | Documents | Purpose |
|-----------|-----------|---------|
| `users/{uid}` | AppUser | User profiles & roles |
| `orders/{id}` | Order | Client orders |
| `payments/{id}` | Payment | Payment submissions |
| `portfolio/{id}` | PortfolioProject | Showcase projects |
| `notifications/{id}` | Notification | Push notifications |
| `tickets/{id}` | Ticket | Support tickets |
| `config/system` | SystemConfig | App-wide settings |

---

## 6. Firebase Security Rules

### Firestore Rules

Go to Firebase Console → **Firestore** → **Rules** and paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper: check if user is authenticated
    function isAuth() {
      return request.auth != null;
    }

    // Helper: check if user is admin
    function isAdmin() {
      return isAuth() &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Helper: check if user owns document
    function isOwner(uid) {
      return isAuth() && request.auth.uid == uid;
    }

    // Config — admin write, authenticated read
    match /config/{doc} {
      allow read: if isAuth();
      allow write: if isAdmin();
    }

    // Users — own profile read/write, admin full access
    match /users/{userId} {
      allow read: if isOwner(userId) || isAdmin();
      allow create: if isOwner(userId);
      allow update: if isOwner(userId) || isAdmin();
      allow delete: if isAdmin();
    }

    // Orders — client sees own, admin sees all
    match /orders/{orderId} {
      allow read: if isAdmin() ||
        (isAuth() && resource.data.clientId == request.auth.uid);
      allow create: if isAuth();
      allow update: if isAdmin() ||
        (isAuth() && resource.data.clientId == request.auth.uid);
      allow delete: if isAdmin();
    }

    // Payments — client sees own, admin sees all
    match /payments/{paymentId} {
      allow read: if isAdmin() ||
        (isAuth() && resource.data.clientId == request.auth.uid);
      allow create: if isAuth();
      allow update: if isAdmin();
      allow delete: if isAdmin();
    }

    // Portfolio — public read, admin write
    match /portfolio/{projectId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // Notifications
    match /notifications/{notifId} {
      allow read: if isAdmin() ||
        (isAuth() && (
          resource.data.userId == request.auth.uid ||
          resource.data.isBroadcast == true
        ));
      allow create: if isAdmin();
      allow update: if isAuth() && resource.data.userId == request.auth.uid;
      allow delete: if isAdmin();
    }

    // Tickets
    match /tickets/{ticketId} {
      allow read: if isAdmin() ||
        (isAuth() && resource.data.clientId == request.auth.uid);
      allow create: if isAuth();
      allow update: if isAdmin() ||
        (isAuth() && resource.data.clientId == request.auth.uid);
      allow delete: if isAdmin();
    }
  }
}
```

### Storage Rules

Not applicable — this app no longer uses Firebase Storage (see §2.4).
Receipts are saved as base64 fields inside Firestore `payments` documents,
so they're already covered by the Firestore rules above.

---

## 7. Hosting Deployment

⚠️ **Update:** Firebase Hosting's full SSR support for Next.js also runs
through Cloud Functions/Cloud Run, which **also requires the Blaze plan**.
Since the goal is a fully free deployment, use the dedicated
**[TERMUX_DEPLOY_GUIDE.md](./TERMUX_DEPLOY_GUIDE.md)** instead — it deploys
this app to **Vercel** (free Hobby tier, native Next.js support, no card
needed) straight from Termux. Firebase itself stays free for Auth +
Firestore only. The steps below are kept for reference if you ever move to
Firebase Hosting on a paid plan.

### 7.1 Initialize Firebase (CRITICAL: Prevent file overwrite)

```bash
# Login to Firebase
firebase login

# Initialize Firebase in project root
# IMPORTANT: Answer carefully to avoid overwriting files!
firebase init
```

**During `firebase init`, answer as follows:**

```
? Which Firebase features do you want to set up?
  ✅ Firestore
  ✅ Hosting: Configure files for Firebase Hosting

? Please select an option: Use an existing project
? Select a default Firebase project: [your-project-id]

? What file should be used for Firestore Rules? firestore.rules
? What file should be used for Firestore indexes? firestore.indexes.json

? What do you want to use as your public directory? out
  ⚠️ TYPE "out" NOT "public" — this prevents overwriting your files!

? Configure as a single-page app (rewrite all urls to /index.html)? No
  ⚠️ Type "N" — Next.js handles its own routing

? Set up automatic builds and deploys with GitHub? No (do manually first)

? File out/index.html already exists. Overwrite? No
  ⚠️ ALWAYS type "N" for any existing file prompts!
```

### 7.2 Deploy to Firebase Hosting

```bash
# Build Next.js for static export
npm run build

# If using Next.js with server-side features (API routes),
# deploy to Firebase Hosting + Cloud Functions instead:
# See section 7.3 for SSR deployment

# For static export only:
# Add to next.config.ts: output: 'export'
# Then:
npm run build
firebase deploy --only hosting
```

### 7.3 Full SSR Deployment (Recommended)

Since this app uses API routes, use Firebase Hosting + Cloud Functions:

```bash
# Install Firebase Functions
npm install firebase-functions
npm install -g firebase-tools

# Deploy everything
firebase deploy
```

Or deploy to **Vercel** (easiest for Next.js):

```bash
npm install -g vercel
vercel --prod
```

Set environment variables in Vercel dashboard under **Settings → Environment Variables**.

---

## 8. First-Time Admin Configuration

### 8.1 Create Your Admin Account

1. Open the app: [your-domain.com](https://your-domain.com)
2. Go to `/signup` and create your account with your admin email
3. Note your **User UID** from Firebase Console → Authentication → Users

### 8.2 Promote to Admin via Firebase Console

**Option A: Firebase Console (GUI)**
1. Firebase Console → **Firestore**
2. Navigate to: `users` → `{your-uid}` document
3. Edit the `role` field → change `"client"` to `"admin"`
4. Click **Update**

**Option B: Firebase Admin Script**
```javascript
// scripts/make-admin.js
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

const UID = 'YOUR_USER_UID_HERE';

db.doc(`users/${UID}`).update({ role: 'admin' })
  .then(() => {
    console.log('✅ User promoted to admin!');
    process.exit(0);
  });
```

```bash
node scripts/make-admin.js
```

### 8.3 Configure System Settings

1. Log in as admin
2. Go to **Profile** → **Admin Panel** (/admin)
3. Click **⚙️ Config** tab
4. Set:
   - **App Name**: Your branding
   - **WhatsApp Number**: Your support number (format: `923001234567`)
   - **Alert Banner**: Your welcome message
5. Click **💾 Save Configuration**

### 8.4 Add Portfolio Projects

1. Admin Panel is not yet connected to a portfolio editor UI — add via Firestore:
2. Firebase Console → **Firestore** → **portfolio** collection
3. Add documents with fields:
   ```json
   {
     "title": "My Project",
     "category": "Mobile App",
     "description": "Project description",
     "iframeUrl": "https://your-project-url.com",
     "liveUrl": "https://your-project-url.com",
     "tags": ["React Native", "Firebase"],
     "isLive": true,
     "isFeatured": true,
     "gradient": "linear-gradient(135deg, #7c3aed, #06b6d4)",
     "icon": "🛒",
     "sortOrder": 1,
     "createdAt": "2024-01-01T00:00:00.000Z"
   }
   ```

### 8.5 Configure Payment Methods

Add payment methods to Firestore:
- Collection: `config` → Document: `paymentMethods`
```json
{
  "methods": [
    {
      "id": "easypaisa",
      "name": "EasyPaisa",
      "type": "easypaisa",
      "details": "+92 300-1234567",
      "instructions": "Send payment to the number above and upload screenshot",
      "isActive": true,
      "icon": "📱"
    }
  ]
}
```

---

## 9. Git & CI/CD

### 9.1 Initialize Git Repository

```bash
# Initialize
git init
git branch -M main

# Add .gitignore (already created)
cat .gitignore

# Initial commit
git add .
git commit -m "feat: Initial AppCraft by DigitalSpot SaaS portal"

# Connect to GitHub
git remote add origin https://github.com/YOUR_USERNAME/appcraft-digitalspot.git
git push -u origin main
```

### 9.2 GitHub Actions CI/CD (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Firebase Hosting

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_FIREBASE_API_KEY: ${{ secrets.NEXT_PUBLIC_FIREBASE_API_KEY }}
          NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: ${{ secrets.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN }}
          NEXT_PUBLIC_FIREBASE_PROJECT_ID: ${{ secrets.NEXT_PUBLIC_FIREBASE_PROJECT_ID }}
          NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: ${{ secrets.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET }}
          NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID }}
          NEXT_PUBLIC_FIREBASE_APP_ID: ${{ secrets.NEXT_PUBLIC_FIREBASE_APP_ID }}

      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
          projectId: YOUR_PROJECT_ID
```

Add secrets in **GitHub → Repository → Settings → Secrets**.

---

## 10. Troubleshooting

### "Firebase not configured" errors
- Ensure `.env.local` has all `NEXT_PUBLIC_FIREBASE_*` variables filled
- Restart the dev server after editing `.env.local`

### "Permission denied" Firestore errors
- Check Firestore Rules are published (not in draft)
- Verify the user document in `users/{uid}` has `role: "admin"` for admin features

### Google Sign-in not working
- Add `localhost` to **Firebase Console → Authentication → Authorized domains**
- Add your production domain too

### Images not loading
- Check `next.config.ts` `images.remotePatterns` includes your domains

### "Maintenance mode" stuck
- Go to Firestore → `config/system` → set `maintenanceMode: false`
- Or log in as admin and toggle it off in Admin Panel → Config

### WhatsApp button not appearing
- Check `NEXT_PUBLIC_WHATSAPP_NUMBER` in environment variables
- Format: country code + number, no spaces or `+` (e.g., `923001234567`)

---

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout (providers, fonts)
│   ├── page.tsx           # Home/Dashboard
│   ├── login/page.tsx     # Authentication
│   ├── signup/page.tsx    # Registration
│   ├── portfolio/page.tsx # Portfolio showcase
│   ├── orders/
│   │   ├── page.tsx       # Orders list
│   │   ├── new/page.tsx   # New order form
│   │   └── [id]/page.tsx  # Order detail + stepper
│   ├── notifications/page.tsx
│   ├── profile/
│   │   ├── page.tsx       # User profile
│   │   └── security/page.tsx
│   ├── admin/
│   │   ├── page.tsx       # Admin dashboard
│   │   └── users/page.tsx # User management
│   └── api/health/route.ts
├── components/            # Reusable UI components
│   ├── AppLayout.tsx      # Shell with auth guard
│   ├── BottomNav.tsx      # Mobile bottom navigation
│   ├── TopHeader.tsx      # Sticky top bar
│   ├── SplashScreen.tsx   # Animated splash
│   ├── WhatsAppFAB.tsx    # Floating action button
│   ├── MaintenanceScreen.tsx
│   ├── AlertBanner.tsx
│   ├── OrderCard.tsx
│   ├── OrderStepper.tsx
│   └── StatCard.tsx
├── contexts/
│   ├── AuthContext.tsx    # Firebase Auth
│   └── ThemeContext.tsx   # Dark/Light mode
├── lib/
│   ├── firebase.ts        # Client SDK init
│   ├── firebase-admin.ts  # Admin SDK init
│   └── firestore-helpers.ts # CRUD operations
└── types/index.ts         # TypeScript interfaces
```

---

## Support

For assistance, contact **DigitalSpot** via:
- 💬 WhatsApp: [wa.me/923001234567](https://wa.me/923001234567)
- 📧 Email: support@digitalspot.com

---

*AppCraft by DigitalSpot — Built with Next.js 16, Firebase, Tailwind CSS*
