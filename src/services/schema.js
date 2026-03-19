// ============================================================
// LifeLink – Firestore Schema Documentation
// ============================================================
// This file defines all collection names, document field
// shapes, and enumerations used across the Firestore database.
// It is the single source of truth for the data model.
// ============================================================

// ---------------------- COLLECTION NAMES ----------------------

export const COLLECTIONS = {
  USERS: 'users',
  SOCIETIES: 'societies',
  MEMBERS: 'members',
  EMERGENCY_REQUESTS: 'emergencyRequests',
  DONATIONS: 'donations',
  NOTIFICATIONS: 'notifications',
  ANALYTICS: 'analytics',
  RARE_DONOR_REGISTRY: 'rareDonorRegistry',
};

// ---------------------- ENUMERATIONS ----------------------

/** Valid user roles stored in users.role */
export const USER_ROLES = {
  DONOR: 'donor',
  SOCIETY: 'society',
  RECEIVER: 'receiver',
  ADMIN: 'admin',
};

/** All supported blood groups */
export const BLOOD_GROUPS = [
  'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Bombay',
];

/** Blood groups classified as rare — triggers priority engine */
export const RARE_BLOOD_GROUPS = ['O-', 'AB-', 'Bombay'];

/** Emergency request status lifecycle */
export const EMERGENCY_STATUS = {
  SEARCHING: 'searching',
  EXPANDED_5KM: 'expanded_5km',
  EXPANDED_15KM: 'expanded_15km',
  CITY_WIDE: 'city_wide',
  FULFILLED: 'fulfilled',
  CLOSED: 'closed',
};

/** Maps escalation stage numbers to status labels */
export const ESCALATION_STAGES = {
  1: EMERGENCY_STATUS.SEARCHING,
  2: EMERGENCY_STATUS.EXPANDED_5KM,
  3: EMERGENCY_STATUS.EXPANDED_15KM,
  4: EMERGENCY_STATUS.CITY_WIDE,
};

/** Notification types */
export const NOTIFICATION_TYPES = {
  EMERGENCY_ALERT: 'emergency_alert',
  ELIGIBILITY_REMINDER: 'eligibility_reminder',
  DONATION_CONFIRMATION: 'donation_confirmation',
};

/** Analytics document IDs */
export const ANALYTICS_DOCS = {
  BLOOD_GROUP_STATS: 'bloodGroupStats',
  CITY_STATS: 'cityStats',
  EMERGENCY_STATS: 'emergencyStats',
};

// ---------------------- ELIGIBILITY RULES ----------------------

/** Minimum gap between donations (days) */
export const DONATION_COOLDOWN_DAYS = 90;

/** Default trust score for new users / members */
export const DEFAULT_TRUST_SCORE = 0;

/** Trust score increment per verified donation */
export const TRUST_SCORE_PER_DONATION = 5;

// ============================================================
// DOCUMENT SHAPE REFERENCE (TypeScript-style for clarity)
// ============================================================
//
// ── users/{uid} ──────────────────────────────────────────────
// {
//   name:        string
//   email:       string
//   role:        "donor" | "society" | "receiver" | "admin"
//   phone:       string
//   city:        string
//   createdAt:   Timestamp
//   isVerified:  boolean
//   trustScore:  number        // default 0
//   lastLogin:   Timestamp
// }
//
// ── societies/{autoId} ───────────────────────────────────────
// {
//   name:             string
//   registrationId:   string     // govt / NGO registration #
//   city:             string
//   headUserId:       string     // uid reference
//   contactPhone:     string
//   contactEmail:     string
//   isVerified:       boolean
//   totalMembers:     number
//   availableMembers: number
//   rareDonorCount:   number
//   createdAt:        Timestamp
//   geoLocation: {
//     lat: number
//     lng: number
//   }
// }
//
// ── members/{autoId} ─────────────────────────────────────────
// {
//   societyId:        string     // societies doc id
//   name:             string
//   bloodGroup:       string
//   phone:            string
//   city:             string
//   isAvailable:      boolean
//   lastDonationDate: Timestamp | null
//   nextEligibleDate: Timestamp | null
//   donationCount:    number
//   trustScore:       number
//   isRare:           boolean
//   geoLocation: {
//     lat: number
//     lng: number
//   }
//   createdAt:        Timestamp
// }
//
// ── emergencyRequests/{autoId} ────────────────────────────────
// {
//   createdByUserId:     string
//   bloodGroup:          string
//   patientCity:         string
//   hospitalName:        string
//   isEconomicallyWeak:  boolean
//   status:              EmergencyStatus
//   escalationStage:     number  (1–4)
//   targetedSocieties:   string[]
//   acceptedBySocietyId: string | null
//   acceptedMemberId:    string | null
//   createdAt:           Timestamp
//   geoLocation: {
//     lat: number
//     lng: number
//   }
//   isRareEmergency:     boolean
//   responseDeadline:    Timestamp
// }
//
// ── donations/{autoId} ───────────────────────────────────────
// {
//   memberId:          string
//   societyId:         string
//   emergencyId:       string
//   donationDate:      Timestamp
//   verifiedBySociety: boolean
//   certificateIssued: boolean
// }
//
// ── notifications/{autoId} ───────────────────────────────────
// {
//   targetUserId:       string
//   type:               NotificationType
//   message:            string
//   relatedEmergencyId: string | null
//   isRead:             boolean
//   createdAt:          Timestamp
// }
//
// ── analytics/{docId} ────────────────────────────────────────
// Flexible key-value maps, e.g.:
// bloodGroupStats: { "A+": 25, "B+": 40, "O-": 5, ... }
// cityStats:       { "Mumbai": 120, "Delhi": 85, ... }
// emergencyStats:  { total: 50, fulfilled: 42, active: 8 }
//
// ── rareDonorRegistry/{autoId} ───────────────────────────────
// {
//   memberId:    string
//   bloodGroup:  string
//   city:        string
//   societyId:   string
//   geoLocation: {
//     lat: number
//     lng: number
//   }
// }
// ============================================================
