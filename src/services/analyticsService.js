// ============================================================
// Analytics Collection Service
// Collection: analytics/{docId}
// ============================================================

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
} from 'firebase/firestore';
import { db } from './firebase';
import { COLLECTIONS, ANALYTICS_DOCS, BLOOD_GROUPS } from './schema';

const docRef = (docId) => doc(db, COLLECTIONS.ANALYTICS, docId);

// ──────────────────────────────────────────────────────────────
// BLOOD GROUP STATS – analytics/bloodGroupStats
// ──────────────────────────────────────────────────────────────

/**
 * Get blood group distribution stats.
 */
export const getBloodGroupStats = async () => {
  const snap = await getDoc(docRef(ANALYTICS_DOCS.BLOOD_GROUP_STATS));
  return snap.exists() ? snap.data() : null;
};

/**
 * Increment a blood group count (e.g., when a new member registers).
 */
export const incrementBloodGroupCount = async (bloodGroup) => {
  await updateDoc(docRef(ANALYTICS_DOCS.BLOOD_GROUP_STATS), {
    [bloodGroup]: increment(1),
  });
};

/**
 * Initialise blood group stats doc with zeros.
 * Call once during system setup.
 */
export const initBloodGroupStats = async () => {
  const initial = {};
  BLOOD_GROUPS.forEach((bg) => {
    initial[bg] = 0;
  });
  await setDoc(docRef(ANALYTICS_DOCS.BLOOD_GROUP_STATS), initial, { merge: true });
};

// ──────────────────────────────────────────────────────────────
// CITY STATS – analytics/cityStats
// ──────────────────────────────────────────────────────────────

/**
 * Get donor counts per city.
 */
export const getCityStats = async () => {
  const snap = await getDoc(docRef(ANALYTICS_DOCS.CITY_STATS));
  return snap.exists() ? snap.data() : null;
};

/**
 * Increment donor count for a city.
 */
export const incrementCityCount = async (city) => {
  await setDoc(
    docRef(ANALYTICS_DOCS.CITY_STATS),
    { [city]: increment(1) },
    { merge: true },
  );
};

// ──────────────────────────────────────────────────────────────
// EMERGENCY STATS – analytics/emergencyStats
// ──────────────────────────────────────────────────────────────

/**
 * Get emergency statistics.
 */
export const getEmergencyStats = async () => {
  const snap = await getDoc(docRef(ANALYTICS_DOCS.EMERGENCY_STATS));
  return snap.exists() ? snap.data() : null;
};

/**
 * Increment total emergency count.
 */
export const incrementEmergencyTotal = async () => {
  await setDoc(
    docRef(ANALYTICS_DOCS.EMERGENCY_STATS),
    { total: increment(1), active: increment(1) },
    { merge: true },
  );
};

/**
 * Mark one emergency as fulfilled (adjust counters).
 */
export const recordEmergencyFulfilled = async () => {
  await updateDoc(docRef(ANALYTICS_DOCS.EMERGENCY_STATS), {
    fulfilled: increment(1),
    active: increment(-1),
  });
};

/**
 * Initialise emergency stats doc.
 */
export const initEmergencyStats = async () => {
  await setDoc(
    docRef(ANALYTICS_DOCS.EMERGENCY_STATS),
    { total: 0, fulfilled: 0, active: 0, expired: 0 },
    { merge: true },
  );
};
