import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore, getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

export const isFirebaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
  !process.env.NEXT_PUBLIC_FIREBASE_API_KEY.includes("YOUR_")
);

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "",
};

// Initialize safely — empty strings won't crash Cloudflare Workers (unlike fake placeholder keys)
let app: FirebaseApp;
try {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
} catch (e) {
  console.warn("[Firebase] App init failed:", e);
  app = initializeApp({ apiKey: "", projectId: "", appId: "" }, "fallback");
}

export const auth = getAuth(app);

let dbInstance;
try {
  dbInstance = initializeFirestore(app, {
    experimentalForceLongPolling: true,
    ignoreUndefinedProperties: true,
  });
} catch {
  dbInstance = getFirestore(app);
}

export const db = dbInstance;
export const storage = getStorage(app);

export default app;
