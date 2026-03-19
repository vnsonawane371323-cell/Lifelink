// ============================================================
// Emergency Requests Collection Service
// Collection: emergencyRequests/{autoId}
// Powers the Smart Escalation Engine (LSEE)
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
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { COLLECTIONS, EMERGENCY_STATUS } from './schema';
import {
  detectRareBloodGroup,
  createResponseDeadline,
} from '../utils/bloodUtils';

const colRef = () => collection(db, COLLECTIONS.EMERGENCY_REQUESTS);

/**
 * Create a new emergency blood request.
 * Automatically classifies rare emergencies.
 */
export const createEmergencyRequest = async (data) => {
  const isRare = detectRareBloodGroup(data.bloodGroup);

  const docRef = await addDoc(colRef(), {
    createdByUserId: data.createdByUserId,
    bloodGroup: data.bloodGroup,
    patientCity: data.patientCity,
    hospitalName: data.hospitalName || '',
    isEconomicallyWeak: data.isEconomicallyWeak || false,
    status: EMERGENCY_STATUS.SEARCHING,
    escalationStage: 1,
    targetedSocieties: data.targetedSocieties || [],
    acceptedBySocietyId: null,
    acceptedMemberId: null,
    createdAt: serverTimestamp(),
    geoLocation: data.geoLocation || { lat: 0, lng: 0 },
    isRareEmergency: isRare,
    responseDeadline: Timestamp.fromDate(
      createResponseDeadline(data.deadlineMinutes || 60),
    ),
  });

  return docRef.id;
};

/**
 * Get a single emergency request.
 */
export const getEmergencyRequest = async (requestId) => {
  const snap = await getDoc(doc(db, COLLECTIONS.EMERGENCY_REQUESTS, requestId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

/**
 * Fetch all active (non-closed, non-fulfilled) emergencies.
 */
export const getActiveEmergencies = async () => {
  const q = query(
    colRef(),
    where('status', 'not-in', [EMERGENCY_STATUS.FULFILLED, EMERGENCY_STATUS.CLOSED]),
    orderBy('createdAt', 'desc'),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

/**
 * Fetch emergencies by city.
 */
export const getEmergenciesByCity = async (city) => {
  const q = query(colRef(), where('patientCity', '==', city));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

/**
 * Fetch all rare emergencies that are still active.
 */
export const getActiveRareEmergencies = async () => {
  const q = query(
    colRef(),
    where('isRareEmergency', '==', true),
    where('status', '==', EMERGENCY_STATUS.SEARCHING),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

/**
 * Escalate an emergency to the next stage.
 * Stage 1 → 2 → 3 → 4 (city-wide)
 */
export const escalateEmergency = async (requestId, currentStage) => {
  const nextStage = Math.min(currentStage + 1, 4);

  const statusMap = {
    2: EMERGENCY_STATUS.EXPANDED_5KM,
    3: EMERGENCY_STATUS.EXPANDED_15KM,
    4: EMERGENCY_STATUS.CITY_WIDE,
  };

  await updateDoc(doc(db, COLLECTIONS.EMERGENCY_REQUESTS, requestId), {
    escalationStage: nextStage,
    status: statusMap[nextStage] || EMERGENCY_STATUS.CITY_WIDE,
  });

  return nextStage;
};

/**
 * Mark emergency as fulfilled.
 */
export const fulfillEmergency = async (requestId, societyId, memberId) => {
  await updateDoc(doc(db, COLLECTIONS.EMERGENCY_REQUESTS, requestId), {
    status: EMERGENCY_STATUS.FULFILLED,
    acceptedBySocietyId: societyId,
    acceptedMemberId: memberId,
  });
};

/**
 * Close an emergency (cancelled or expired).
 */
export const closeEmergency = async (requestId) => {
  await updateDoc(doc(db, COLLECTIONS.EMERGENCY_REQUESTS, requestId), {
    status: EMERGENCY_STATUS.CLOSED,
  });
};

/**
 * Update targeted societies list (after escalation broadens search).
 */
export const updateTargetedSocieties = async (requestId, societyIds) => {
  await updateDoc(doc(db, COLLECTIONS.EMERGENCY_REQUESTS, requestId), {
    targetedSocieties: societyIds,
  });
};
