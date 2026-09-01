import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  Firestore,
  Unsubscribe
} from 'firebase/firestore';
import type { Registration, EventSettings } from '../types/registration';

// Firebase configuration with environment fallback
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDummyKeyForRyvantaPortal2026",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "ryvanta-events.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "ryvanta-events",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "ryvanta-events.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1029384756",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1029384756:web:abcdef123456"
};

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let isFirestoreAvailable = false;

try {
  if (import.meta.env.VITE_FIREBASE_API_KEY && import.meta.env.VITE_FIREBASE_PROJECT_ID) {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app);
    isFirestoreAvailable = true;
  }
} catch (error) {
  console.warn("Firestore initialization deferred:", error);
  isFirestoreAvailable = false;
}

export { db, isFirestoreAvailable };

// Collections
export const REGISTRATIONS_COLLECTION = 'registrations';
export const SETTINGS_COLLECTION = 'settings';
export const SETTINGS_DOC_ID = 'event_settings';

/**
 * Cloud Database Service Layer
 */
export class CloudDatabase {
  /**
   * Subscribe to live real-time updates for all registrations
   */
  static subscribeRegistrations(
    onData: (registrations: Registration[]) => void,
    onError?: (err: Error) => void
  ): Unsubscribe {
    if (!db || !isFirestoreAvailable) {
      return () => {};
    }

    const q = query(collection(db, REGISTRATIONS_COLLECTION), orderBy('createdAt', 'desc'));
    return onSnapshot(
      q,
      (snapshot) => {
        const records: Registration[] = [];
        snapshot.forEach((docSnap) => {
          records.push(docSnap.data() as Registration);
        });
        onData(records);
      },
      (error) => {
        console.error("Firestore sync error:", error);
        if (onError) onError(error);
      }
    );
  }

  /**
   * Save or update a registration document in Firestore
   */
  static async saveRegistration(record: Registration): Promise<void> {
    if (!db || !isFirestoreAvailable) return;
    const docRef = doc(db, REGISTRATIONS_COLLECTION, record.id);
    await setDoc(docRef, record, { merge: true });
  }

  /**
   * Update payment status of a registration
   */
  static async updatePaymentStatus(id: string, paymentStatus: Registration['paymentStatus']): Promise<void> {
    if (!db || !isFirestoreAvailable) return;
    const docRef = doc(db, REGISTRATIONS_COLLECTION, id);
    await updateDoc(docRef, { paymentStatus });
  }

  /**
   * Delete registration document
   */
  static async deleteRegistration(id: string): Promise<void> {
    if (!db || !isFirestoreAvailable) return;
    const docRef = doc(db, REGISTRATIONS_COLLECTION, id);
    await deleteDoc(docRef);
  }

  /**
   * Get live organizer settings from Firestore
   */
  static async getSettings(): Promise<EventSettings | null> {
    if (!db || !isFirestoreAvailable) return null;
    const docRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
    const snap = await getDoc(docRef);
    return snap.exists() ? (snap.data() as EventSettings) : null;
  }

  /**
   * Save organizer settings in Firestore
   */
  static async saveSettings(settings: EventSettings): Promise<void> {
    if (!db || !isFirestoreAvailable) return;
    const docRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
    await setDoc(docRef, settings, { merge: true });
  }
}
