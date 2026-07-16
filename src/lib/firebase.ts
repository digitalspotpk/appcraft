import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Values are read from env vars (see .env.local). Falling back to the
// project's own public config keeps local dev working even if the
// .env.local file is ever missing — these are NOT secret values, Firebase
// web API keys are safe to expose in client bundles by design.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "AIzaSyCiJHnvcGognB3AplEWOOG3g1DVn698N0Y",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "appcraft-95bf6.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "appcraft-95bf6",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "appcraft-95bf6.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "136186013951",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "1:136186013951:web:34b5752914653a412284ca",
};

// Initialize Firebase (singleton pattern)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
// NOTE: Firebase Storage is intentionally NOT initialized here. Cloud
// Storage now requires the project to be on the Blaze (pay-as-you-go)
// billing plan, even for free-tier usage. To keep this app 100% free on
// the Spark plan, receipt images are compressed and stored as base64
// strings directly inside Firestore documents instead (see
// `uploadReceipt` in firestore-helpers.ts).
export default app;
