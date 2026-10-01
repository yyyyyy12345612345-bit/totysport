import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { initializeFirestore, getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";

export const isFirebaseConfigured = true;

// Firebase client credentials are public by design — security is via Firebase Security Rules
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyB4V0uw6vSMyiU8gr8j_D8n8yuU6Mj1Z4c",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "totysport-8ff4a.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "totysport-8ff4a",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "totysport-8ff4a.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "921661633736",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:921661633736:web:5f68790fbb6822cb2e21fd",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-93BBLFPWPP",
};

// Internal nullable instances
let _app: FirebaseApp | null = null;
let _auth: Auth | null = null;
let _db: Firestore | null = null;
let _storage: FirebaseStorage | null = null;

try {
  _app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
} catch (e) {
  console.warn("[Firebase] App init skipped:", (e as Error).message);
}

if (_app) {
  try { _auth = getAuth(_app); } catch (e) {
    console.warn("[Firebase] Auth init skipped:", (e as Error).message);
  }
  try {
    _db = initializeFirestore(_app, {
      experimentalForceLongPolling: true,
      ignoreUndefinedProperties: true,
    });
  } catch {
    try { _db = getFirestore(_app); } catch {}
  }
  try { _storage = getStorage(_app); } catch {}
}

// Export with type assertions so the rest of the codebase doesn't need null checks.
// If Firebase fails to init, runtime calls will throw meaningful errors.
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const auth = _auth as Auth;
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const db = _db as Firestore;
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const storage = _storage as FirebaseStorage;

export default _app;
