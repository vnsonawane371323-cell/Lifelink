// ============================================================
// Donations Collection Service
// Collection: donations/{autoId}
// ============================================================

import {
  collection,
  doc,
  addDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
  increment,
} from 'firebase/firestore';
import { db } from './firebase';
import { COLLECTIONS } from './schema';
import { calculateNextEligibleDate, incrementTrustScore } from '../utils/bloodUtils';
import { updateMember } from './memberService';

const colRef = () => collection(db, COLLECTIONS.DONATIONS);

/**
 * Record a completed donation.
 * Side effects:
 *   1. Update member's lastDonationDate, nextEligibleDate, availability
 *   2. Increment member's donationCount and trustScore
 */
export const recordDonation = async (data) => {
  const donationDate = data.donationDate || new Date();

  // 1. Create donation document
  const docRef = await addDoc(colRef(), {
    memberId: data.memberId,
    societyId: data.societyId,
    emergencyId: data.emergencyId || '',
    donationDate: Timestamp.fromDate(new Date(donationDate)),
    verifiedBySociety: data.verifiedBySociety || false,
    certificateIssued: false,
  });

  // 2. Update the member record
  const nextEligible = calculateNextEligibleDate(donationDate);
  await updateMember(data.memberId, {
    lastDonationDate: Timestamp.fromDate(new Date(donationDate)),
    nextEligibleDate: nextEligible ? Timestamp.fromDate(nextEligible) : null,
    isAvailable: false,
    donationCount: increment(1),
    trustScore: increment(5), // TRUST_SCORE_PER_DONATION
  });

  return docRef.id;
};

/**
 * Get all donations for a member.
 */
export const getDonationsByMember = async (memberId) => {
  const q = query(
    colRef(),
    where('memberId', '==', memberId),
    orderBy('donationDate', 'desc'),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

/**
 * Get all donations for a society.
 */
export const getDonationsBySociety = async (societyId) => {
  const q = query(
    colRef(),
    where('societyId', '==', societyId),
    orderBy('donationDate', 'desc'),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

/**
 * Get donations linked to an emergency.
 */
export const getDonationsByEmergency = async (emergencyId) => {
  const q = query(colRef(), where('emergencyId', '==', emergencyId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

/**
 * Verify a donation (society admin action).
 */
export const verifyDonation = async (donationId) => {
  await updateDoc(doc(db, COLLECTIONS.DONATIONS, donationId), {
    verifiedBySociety: true,
  });
};

/**
 * Issue certificate for a donation.
 */
export const issueCertificate = async (donationId) => {
  await updateDoc(doc(db, COLLECTIONS.DONATIONS, donationId), {
    certificateIssued: true,
  });
};
