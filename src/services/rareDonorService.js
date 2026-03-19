// ============================================================
// Rare Donor Registry Service
// Collection: rareDonorRegistry/{autoId}
// Purpose: Instant broadcast during rare blood emergencies
// ============================================================

import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { db } from './firebase';
import { COLLECTIONS } from './schema';

const colRef = () => collection(db, COLLECTIONS.RARE_DONOR_REGISTRY);

/**
 * Add a member to the rare donor registry.
 * Called automatically when a member with a rare blood group joins.
 */
export const addRareDonor = async (data) => {
  const docRef = await addDoc(colRef(), {
    memberId: data.memberId,
    bloodGroup: data.bloodGroup,
    city: data.city,
    societyId: data.societyId,
    geoLocation: data.geoLocation || { lat: 0, lng: 0 },
  });
  return docRef.id;
};

/**
 * Fetch all rare donors for a specific blood group.
 */
export const getRareDonorsByBloodGroup = async (bloodGroup) => {
  const q = query(colRef(), where('bloodGroup', '==', bloodGroup));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

/**
 * Fetch all rare donors in a city.
 */
export const getRareDonorsByCity = async (city) => {
  const q = query(colRef(), where('city', '==', city));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

/**
 * Fetch rare donors by blood group AND city.
 */
export const getRareDonors = async (bloodGroup, city) => {
  const q = query(
    colRef(),
    where('bloodGroup', '==', bloodGroup),
    where('city', '==', city),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

/**
 * Get ALL rare donors (for admin dashboard / map overlay).
 */
export const getAllRareDonors = async () => {
  const snap = await getDocs(colRef());
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};
