// ============================================================
// Societies Collection Service
// Collection: societies/{autoId}
// ============================================================

import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { COLLECTIONS } from './schema';

const colRef = () => collection(db, COLLECTIONS.SOCIETIES);

/**
 * Register a new society.
 */
export const createSociety = async (data) => {
  const docRef = await addDoc(colRef(), {
    name: data.name,
    registrationId: data.registrationId || '',
    city: data.city,
    headUserId: data.headUserId,
    contactPhone: data.contactPhone || '',
    contactEmail: data.contactEmail || '',
    isVerified: false,
    totalMembers: 0,
    availableMembers: 0,
    rareDonorCount: 0,
    createdAt: serverTimestamp(),
    geoLocation: data.geoLocation || { lat: 0, lng: 0 },
  });
  return docRef.id;
};

/**
 * Get a single society by ID.
 */
export const getSociety = async (societyId) => {
  const snap = await getDoc(doc(db, COLLECTIONS.SOCIETIES, societyId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

/**
 * Fetch a society by its head user's UID.
 */
export const fetchSocietyByHeadUserId = async (uid) => {
  const q = query(colRef(), where('headUserId', '==', uid));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() };
};

/**
 * Get all societies (admin use).
 */
export const getAllSocieties = async () => {
  const snap = await getDocs(colRef());
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

/**
 * Get all societies in a given city.
 */
export const getSocietiesByCity = async (city) => {
  const q = query(colRef(), where('city', '==', city));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

/**
 * Get all verified societies.
 */
export const getVerifiedSocieties = async () => {
  const q = query(colRef(), where('isVerified', '==', true));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

/**
 * Get all pending (unverified) societies.
 */
export const getPendingSocieties = async () => {
  const q = query(colRef(), where('isVerified', '==', false));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

/**
 * Approve a society (admin action).
 */
export const approveSociety = async (societyId) => {
  await updateDoc(doc(db, COLLECTIONS.SOCIETIES, societyId), {
    isVerified: true,
    verifiedAt: serverTimestamp(),
  });
};

/**
 * Reject / revoke verification of a society (admin action).
 */
export const rejectSociety = async (societyId) => {
  await updateDoc(doc(db, COLLECTIONS.SOCIETIES, societyId), {
    isVerified: false,
    verifiedAt: null,
  });
};

/**
 * Update society member counts.
 */
export const updateSocietyCounts = async (societyId, fields) => {
  await updateDoc(doc(db, COLLECTIONS.SOCIETIES, societyId), fields);
};

/**
 * Recalculate society stats from its members list.
 */
export const updateSocietyStats = async (societyId, members) => {
  const totalMembers = members.length;
  const availableMembers = members.filter((m) => m.isAvailable).length;
  const rareDonorCount = members.filter((m) => m.isRare).length;
  await updateSocietyCounts(societyId, {
    totalMembers,
    availableMembers,
    rareDonorCount,
  });
  return { totalMembers, availableMembers, rareDonorCount };
};
