// ============================================================
// Members Collection Service
// Collection: members/{autoId}
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
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { COLLECTIONS, DEFAULT_TRUST_SCORE } from './schema';
import {
  calculateNextEligibleDate,
  detectRareBloodGroup,
} from '../utils/bloodUtils';
import { addRareDonor } from './rareDonorService';
import { updateSocietyCounts } from './societyService';

const colRef = () => collection(db, COLLECTIONS.MEMBERS);

/**
 * Add a new member to a society.
 * Automatically handles:
 *   - 90-day eligibility calculation
 *   - Rare blood group detection + registry entry
 *   - Society counter updates
 */
export const addMember = async (data) => {
  const isRare = detectRareBloodGroup(data.bloodGroup);

  const nextEligible = data.lastDonationDate
    ? Timestamp.fromDate(calculateNextEligibleDate(data.lastDonationDate))
    : null;

  const memberDoc = {
    societyId: data.societyId,
    name: data.name,
    bloodGroup: data.bloodGroup,
    phone: data.phone || '',
    city: data.city || '',
    isAvailable: data.isAvailable ?? true,
    lastDonationDate: data.lastDonationDate
      ? Timestamp.fromDate(new Date(data.lastDonationDate))
      : null,
    nextEligibleDate: nextEligible,
    donationCount: data.donationCount || 0,
    trustScore: data.trustScore ?? DEFAULT_TRUST_SCORE,
    isRare,
    geoLocation: data.geoLocation || { lat: 0, lng: 0 },
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(colRef(), memberDoc);
  const memberId = docRef.id;

  // If rare, register in rareDonorRegistry
  if (isRare) {
    await addRareDonor({
      memberId,
      bloodGroup: data.bloodGroup,
      city: data.city || '',
      societyId: data.societyId,
      geoLocation: data.geoLocation || { lat: 0, lng: 0 },
    });
  }

  // Update society totals (fire-and-forget for speed)
  updateSocietyCounts(data.societyId, {
    totalMembers: (data._currentTotal || 0) + 1,
    availableMembers: (data._currentAvailable || 0) + (memberDoc.isAvailable ? 1 : 0),
    rareDonorCount: (data._currentRare || 0) + (isRare ? 1 : 0),
  }).catch(() => {});

  return memberId;
};

/**
 * Get a member by ID.
 */
export const getMember = async (memberId) => {
  const snap = await getDoc(doc(db, COLLECTIONS.MEMBERS, memberId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

/**
 * Fetch all members of a society.
 */
export const getMembersBySociety = async (societyId) => {
  const q = query(colRef(), where('societyId', '==', societyId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

/**
 * Fetch available donors by blood group and city.
 * Core query for the Smart Escalation Engine.
 */
export const getAvailableDonors = async (bloodGroup, city) => {
  const q = query(
    colRef(),
    where('bloodGroup', '==', bloodGroup),
    where('city', '==', city),
    where('isAvailable', '==', true),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

/**
 * Fetch all available donors for a given blood group (any city).
 */
export const getAvailableDonorsByBlood = async (bloodGroup) => {
  const q = query(
    colRef(),
    where('bloodGroup', '==', bloodGroup),
    where('isAvailable', '==', true),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

/**
 * Update member after a completed donation.
 */
export const recordMemberDonation = async (memberId, donationDate) => {
  const date = new Date(donationDate);
  const nextEligible = calculateNextEligibleDate(date);

  await updateDoc(doc(db, COLLECTIONS.MEMBERS, memberId), {
    lastDonationDate: Timestamp.fromDate(date),
    nextEligibleDate: nextEligible ? Timestamp.fromDate(nextEligible) : null,
    isAvailable: false, // ineligible until cooldown
  });
};

/**
 * Update member fields (partial).
 */
export const updateMember = async (memberId, fields) => {
  await updateDoc(doc(db, COLLECTIONS.MEMBERS, memberId), fields);
};
