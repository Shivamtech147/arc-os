import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  Auth
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  collection,
  setDoc,
  getDoc,
  getDocs,
  onSnapshot,
  deleteDoc,
  writeBatch,
  serverTimestamp,
  Firestore
} from 'firebase/firestore';
import { AuthUser, UserSettings } from '../types';

// Fallback client config for local development
const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyDemoKeyForArcOSMultiDeviceSync12345",
  authDomain: "arc-os-winter-arc.firebaseapp.com",
  projectId: "arc-os-winter-arc",
  storageBucket: "arc-os-winter-arc.appspot.com",
  messagingSenderId: "109876543210",
  appId: "1:109876543210:web:arc0s1234567890abcdef"
};

const getEnvConfig = () => {
  const envApiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  if (envApiKey && envApiKey !== 'AIzaSyDemoKeyForArcOSMultiDeviceSync12345') {
    return {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
    };
  }
  return null;
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

export function initFirebase(customConfig?: UserSettings['firebaseConfig']) {
  const config = customConfig || getEnvConfig() || DEFAULT_FIREBASE_CONFIG;
  try {
    if (!getApps().length) {
      app = initializeApp(config);
    } else {
      app = getApp();
    }
    auth = getAuth(app);
    db = getFirestore(app);
    return { app, auth, db };
  } catch (err) {
    console.warn('Firebase initialization notice:', err);
    return { app: null, auth: null, db: null };
  }
}

export function getFirebaseInstance() {
  if (!app || !auth || !db) {
    return initFirebase();
  }
  return { app, auth, db };
}

// Authentication Helpers
export async function loginWithGoogle(): Promise<AuthUser | null> {
  const { auth } = getFirebaseInstance();
  if (!auth) return null;

  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const u = result.user;
    return {
      uid: u.uid,
      email: u.email,
      displayName: u.displayName,
      photoURL: u.photoURL,
      isAnonymous: u.isAnonymous,
    };
  } catch (err: any) {
    console.warn('Google Popup login notice, checking redirect fallback:', err);
    if (
      err.code === 'auth/popup-blocked' ||
      err.code === 'auth/popup-closed-by-user' ||
      err.code === 'auth/cancelled-popup-request' ||
      err.message?.includes('popup')
    ) {
      try {
        await signInWithRedirect(auth, provider);
        return null;
      } catch (redirectErr) {
        throw redirectErr;
      }
    }
    throw err;
  }
}

export async function checkRedirectResult(): Promise<AuthUser | null> {
  const { auth } = getFirebaseInstance();
  if (!auth) return null;

  try {
    const result = await getRedirectResult(auth);
    if (result && result.user) {
      const u = result.user;
      return {
        uid: u.uid,
        email: u.email,
        displayName: u.displayName,
        photoURL: u.photoURL,
        isAnonymous: u.isAnonymous,
      };
    }
    return null;
  } catch (err: any) {
    console.warn('Redirect auth result check:', err);
    return null;
  }
}

export async function loginWithEmail(email: string, pass: string): Promise<AuthUser | null> {
  const { auth } = getFirebaseInstance();
  if (!auth) return null;

  try {
    const result = await signInWithEmailAndPassword(auth, email, pass);
    const u = result.user;
    return {
      uid: u.uid,
      email: u.email,
      displayName: u.displayName,
      photoURL: u.photoURL,
      isAnonymous: u.isAnonymous,
    };
  } catch (err: any) {
    if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
      const created = await createUserWithEmailAndPassword(auth, email, pass);
      const u = created.user;
      return {
        uid: u.uid,
        email: u.email,
        displayName: u.displayName,
        photoURL: u.photoURL,
        isAnonymous: u.isAnonymous,
      };
    }
    throw err;
  }
}

export async function logoutUser(): Promise<void> {
  const { auth } = getFirebaseInstance();
  if (auth) {
    await firebaseSignOut(auth);
  }
}

export function subscribeToAuthState(callback: (user: AuthUser | null) => void) {
  const { auth } = getFirebaseInstance();
  if (!auth) {
    callback(null);
    return () => {};
  }

  return onAuthStateChanged(auth, (u: FirebaseUser | null) => {
    if (u) {
      callback({
        uid: u.uid,
        email: u.email,
        displayName: u.displayName,
        photoURL: u.photoURL,
        isAnonymous: u.isAnonymous,
      });
    } else {
      callback(null);
    }
  });
}

export { doc, collection, setDoc, getDoc, getDocs, onSnapshot, deleteDoc, writeBatch, serverTimestamp };
