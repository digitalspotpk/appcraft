import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

let adminApp: App | null = null;

function getAdminApp(): App | null {
  if (getApps().length > 0) {
    return getApps()[0] ?? null;
  }

  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY
    ? process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, "\n")
    : undefined;

  if (
    process.env.FIREBASE_ADMIN_PROJECT_ID &&
    process.env.FIREBASE_ADMIN_CLIENT_EMAIL &&
    privateKey
  ) {
    return initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey,
      }),
    });
  }

  return null;
}

adminApp = getAdminApp();

export { adminApp };

export function getAdminDb() {
  const app = getAdminApp();
  if (!app) return null;
  try {
    return getFirestore(app);
  } catch {
    return null;
  }
}

export function getAdminAuth() {
  const app = getAdminApp();
  if (!app) return null;
  try {
    return getAuth(app);
  } catch {
    return null;
  }
}
