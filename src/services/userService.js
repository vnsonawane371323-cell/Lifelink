// ============================================================
// Users Collection Service
// Collection: users/{uid}
// ============================================================

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { COLLECTIONS, DEFAULT_TRUST_SCORE } from './schema';

/**
 * Create a new user document (called during registration).
 */
export const createUser = async (uid, data) => {
  const ref = doc(db, COLLECTIONS.USERS, uid);
  await setDoc(ref, {
    name: data.name || '',
    email: data.email,
    role: data.role,
    phone: data.phone || '',
    city: data.city || '',
    createdAt: serverTimestamp(),
    isVerified: false,
    trustScore: DEFAULT_TRUST_SCORE,
    lastLogin: serverTimestamp(),
  });
};

/**
 * Fetch a user document by UID.
 */
export const getUser = async (uid) => {
  const snap = await getDoc(doc(db, COLLECTIONS.USERS, uid));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

/**
 * Update user fields (partial update).
 */
export const updateUser = async (uid, fields) => {
  await updateDoc(doc(db, COLLECTIONS.USERS, uid), fields);
};

/**
 * Record login timestamp.
 */
export const recordLogin = async (uid) => {
  await updateDoc(doc(db, COLLECTIONS.USERS, uid), {
    lastLogin: serverTimestamp(),
  });
};
