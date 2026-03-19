// ============================================================
// LifeLink – Composite Firestore Query Helpers
// High-level queries used by the Smart Escalation Engine (LSEE),
// dashboard, and map views.
// ============================================================

import { getAvailableDonors, getAvailableDonorsByBlood } from './memberService';
import { getSocietiesByCity, getVerifiedSocieties } from './societyService';
import { getRareDonorsByBloodGroup, getRareDonors } from './rareDonorService';
import { getActiveEmergencies, getActiveRareEmergencies } from './emergencyService';
import { getBloodGroupStats, getCityStats, getEmergencyStats } from './analyticsService';
import { filterByRadius, escalationRadiusKm } from '../utils/bloodUtils';

// ──────────────────────────────────────────────────────────────
// 1. AVAILABLE DONORS — by blood group + city
// ──────────────────────────────────────────────────────────────
/**
 * Fetch available donors matching blood group in a specific city.
 * This is the primary query the escalation engine starts with.
 *
 * Firestore query: members where bloodGroup == X AND city == Y AND isAvailable == true
 *
 * @param {string} bloodGroup
 * @param {string} city
 * @returns {Promise<Array>}
 */
export const queryAvailableDonorsByCityAndBlood = async (bloodGroup, city) => {
  return getAvailableDonors(bloodGroup, city);
};

// ──────────────────────────────────────────────────────────────
// 2. NEARBY SOCIETIES — by city + optional geo radius
// ──────────────────────────────────────────────────────────────
/**
 * Fetch verified societies in a city, optionally filtered to a
 * radius around an emergency location.
 *
 * @param {string} city
 * @param {{ lat: number, lng: number }|null} center
 * @param {number|null} radiusKm – null = no radius filter
 * @returns {Promise<Array>}
 */
export const queryNearbySocieties = async (city, center = null, radiusKm = null) => {
  const societies = await getSocietiesByCity(city);

  if (center && radiusKm) {
    return filterByRadius(societies, center, radiusKm);
  }
  return societies;
};

// ──────────────────────────────────────────────────────────────
// 3. RARE DONORS — fast-path for rare emergencies
// ──────────────────────────────────────────────────────────────
/**
 * Fetch rare donors for a blood group, optionally scoped to a city.
 *
 * @param {string} bloodGroup
 * @param {string|null} city
 * @returns {Promise<Array>}
 */
export const queryRareDonors = async (bloodGroup, city = null) => {
  if (city) {
    return getRareDonors(bloodGroup, city);
  }
  return getRareDonorsByBloodGroup(bloodGroup);
};

// ──────────────────────────────────────────────────────────────
// 4. ESCALATION SEARCH — progressive radius expansion
// ──────────────────────────────────────────────────────────────
/**
 * Run an escalation-stage-aware donor search.
 *
 * Stage 1 → 2 km radius
 * Stage 2 → 5 km radius
 * Stage 3 → 15 km radius
 * Stage 4 → city-wide (no radius limit)
 *
 * @param {string} bloodGroup
 * @param {string} city
 * @param {{ lat: number, lng: number }} center
 * @param {number} stage – 1..4
 * @returns {Promise<Array>}
 */
export const queryDonorsByEscalationStage = async (bloodGroup, city, center, stage) => {
  // For rare blood, always search the full registry
  const radius = escalationRadiusKm(stage);

  // Get all available donors in the city for that blood group
  const donors = stage >= 4
    ? await getAvailableDonorsByBlood(bloodGroup) // country-wide fallback
    : await getAvailableDonors(bloodGroup, city);

  if (radius === null) {
    return donors; // city-wide / no filter
  }

  return filterByRadius(donors, center, radius);
};

// ──────────────────────────────────────────────────────────────
// 5. DASHBOARD AGGREGATES
// ──────────────────────────────────────────────────────────────
/**
 * Fetch all analytics data for the admin dashboard in one call.
 *
 * @returns {Promise<{ bloodGroups: object, cities: object, emergencies: object }>}
 */
export const queryDashboardAnalytics = async () => {
  const [bloodGroups, cities, emergencies] = await Promise.all([
    getBloodGroupStats(),
    getCityStats(),
    getEmergencyStats(),
  ]);

  return { bloodGroups, cities, emergencies };
};

// ──────────────────────────────────────────────────────────────
// 6. ACTIVE EMERGENCIES — for map overlay / live feed
// ──────────────────────────────────────────────────────────────
/**
 * Fetch all active emergencies (excludes fulfilled / closed).
 */
export { getActiveEmergencies, getActiveRareEmergencies };
