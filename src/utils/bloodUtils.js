// ============================================================
// LifeLink – Blood Donation Utilities
// Core logic: eligibility, rare detection, geo, trust scoring
// ============================================================

import { RARE_BLOOD_GROUPS, DONATION_COOLDOWN_DAYS, TRUST_SCORE_PER_DONATION } from '../services/schema';

// ──────────────────────────────────────────────────────────────
// ELIGIBILITY
// ──────────────────────────────────────────────────────────────

/**
 * Calculate the next eligible donation date.
 * 90-day (DONATION_COOLDOWN_DAYS) gap rule.
 *
 * @param {Date|string|number|null} lastDonationDate
 * @returns {Date|null} next eligible date, or null if never donated
 */
export const calculateNextEligibleDate = (lastDonationDate) => {
  if (!lastDonationDate) return null;

  const last = new Date(
    lastDonationDate?.toDate ? lastDonationDate.toDate() : lastDonationDate,
  );

  const next = new Date(last);
  next.setDate(next.getDate() + DONATION_COOLDOWN_DAYS);
  return next;
};

/**
 * Check whether a donor is currently eligible to donate.
 *
 * @param {Date|string|number|null} lastDonationDate
 * @returns {boolean}
 */
export const isDonorEligible = (lastDonationDate) => {
  if (!lastDonationDate) return true; // never donated → eligible

  const nextDate = calculateNextEligibleDate(lastDonationDate);
  return nextDate ? new Date() >= nextDate : true;
};

/**
 * Return the number of days remaining until eligibility.
 *
 * @param {Date|string|number|null} lastDonationDate
 * @returns {number} 0 if already eligible
 */
export const daysUntilEligible = (lastDonationDate) => {
  if (!lastDonationDate) return 0;

  const nextDate = calculateNextEligibleDate(lastDonationDate);
  if (!nextDate) return 0;

  const diff = nextDate.getTime() - Date.now();
  return diff <= 0 ? 0 : Math.ceil(diff / (1000 * 60 * 60 * 24));
};

// ──────────────────────────────────────────────────────────────
// RARE BLOOD DETECTION
// ──────────────────────────────────────────────────────────────

/**
 * Determine if a blood group is classified as rare.
 *
 * @param {string} bloodGroup
 * @returns {boolean}
 */
export const detectRareBloodGroup = (bloodGroup) => {
  return RARE_BLOOD_GROUPS.includes(bloodGroup);
};

// ──────────────────────────────────────────────────────────────
// TRUST SCORE
// ──────────────────────────────────────────────────────────────

/**
 * Calculate updated trust score after a verified donation.
 *
 * @param {number} currentScore
 * @returns {number}
 */
export const incrementTrustScore = (currentScore = 0) => {
  return currentScore + TRUST_SCORE_PER_DONATION;
};

// ──────────────────────────────────────────────────────────────
// GEO UTILITIES
// ──────────────────────────────────────────────────────────────

/**
 * Haversine distance between two {lat, lng} points.
 *
 * @param {{ lat: number, lng: number }} a
 * @param {{ lat: number, lng: number }} b
 * @returns {number} distance in kilometres
 */
export const haversineDistanceKm = (a, b) => {
  const R = 6371; // Earth radius in km
  const toRad = (deg) => (deg * Math.PI) / 180;

  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);

  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);

  const h =
    sinLat * sinLat +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinLng * sinLng;

  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
};

/**
 * Filter an array of documents with geoLocation to those within a radius.
 *
 * @param {{ geoLocation: { lat: number, lng: number } }[]} docs
 * @param {{ lat: number, lng: number }} center
 * @param {number} radiusKm
 * @returns {Array} filtered documents
 */
export const filterByRadius = (docs, center, radiusKm) => {
  return docs.filter((doc) => {
    const loc = doc.geoLocation || doc.data?.()?.geoLocation;
    if (!loc) return false;
    return haversineDistanceKm(center, loc) <= radiusKm;
  });
};

// ──────────────────────────────────────────────────────────────
// ESCALATION HELPERS
// ──────────────────────────────────────────────────────────────

/**
 * Determine the search radius (km) for a given escalation stage.
 *
 * Stage 1 → 2 km   (immediate neighbourhood)
 * Stage 2 → 5 km   (expanded)
 * Stage 3 → 15 km  (wider area)
 * Stage 4 → city-wide (no radius limit)
 *
 * @param {number} stage
 * @returns {number|null} radius in km, null = unlimited
 */
export const escalationRadiusKm = (stage) => {
  const map = { 1: 2, 2: 5, 3: 15, 4: null };
  return map[stage] ?? null;
};

/**
 * Create a response deadline timestamp.
 * Default: 60 minutes from now.
 *
 * @param {number} minutes
 * @returns {Date}
 */
export const createResponseDeadline = (minutes = 60) => {
  return new Date(Date.now() + minutes * 60 * 1000);
};
