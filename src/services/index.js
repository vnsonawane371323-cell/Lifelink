// ============================================================
// LifeLink Services – Barrel Export
// Import everything from here: import { createUser, addMember, ... } from '@/services'
// ============================================================

// Firebase instances
export { auth, db } from './firebase';

// Schema constants
export {
  COLLECTIONS,
  USER_ROLES,
  BLOOD_GROUPS,
  RARE_BLOOD_GROUPS,
  EMERGENCY_STATUS,
  ESCALATION_STAGES,
  NOTIFICATION_TYPES,
  ANALYTICS_DOCS,
  DONATION_COOLDOWN_DAYS,
  DEFAULT_TRUST_SCORE,
  TRUST_SCORE_PER_DONATION,
} from './schema';

// User operations
export { createUser, getUser, updateUser, recordLogin } from './userService';

// Society operations
export {
  createSociety,
  getSociety,
  getSocietiesByCity,
  getVerifiedSocieties,
  updateSocietyCounts,
} from './societyService';

// Member operations
export {
  addMember,
  getMember,
  getMembersBySociety,
  getAvailableDonors,
  getAvailableDonorsByBlood,
  recordMemberDonation,
  updateMember,
} from './memberService';

// Emergency operations
export {
  createEmergencyRequest,
  getEmergencyRequest,
  getActiveEmergencies,
  getEmergenciesByCity,
  getActiveRareEmergencies,
  escalateEmergency,
  fulfillEmergency,
  closeEmergency,
  updateTargetedSocieties,
} from './emergencyService';

// Donation operations
export {
  recordDonation,
  getDonationsByMember,
  getDonationsBySociety,
  getDonationsByEmergency,
  verifyDonation,
  issueCertificate,
} from './donationService';

// Notification operations
export {
  sendNotification,
  broadcastEmergencyAlert,
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
} from './notificationService';

// Organization operations
export { registerOrganization, verifyInviteCode } from './organizationService';

// Analytics operations
export {
  getBloodGroupStats,
  incrementBloodGroupCount,
  initBloodGroupStats,
  getCityStats,
  incrementCityCount,
  getEmergencyStats,
  incrementEmergencyTotal,
  recordEmergencyFulfilled,
  initEmergencyStats,
} from './analyticsService';

// Rare donor registry
export {
  addRareDonor,
  getRareDonorsByBloodGroup,
  getRareDonorsByCity,
  getRareDonors,
  getAllRareDonors,
} from './rareDonorService';

// Composite query helpers
export {
  queryAvailableDonorsByCityAndBlood,
  queryNearbySocieties,
  queryRareDonors,
  queryDonorsByEscalationStage,
  queryDashboardAnalytics,
} from './queryHelpers';
