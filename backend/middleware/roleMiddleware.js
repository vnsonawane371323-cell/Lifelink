// ============================================================
//  Role Middleware — LifeLink
//  Additional role-based access control helpers
// ============================================================

const { authorize } = require('./authMiddleware');

// ----------------------------------------------------------------
//  Pre-built middleware for common role combinations
// ----------------------------------------------------------------

/**
 * Medical staff only (hospitals and admin)
 */
const medicalStaffOnly = authorize('hospital', 'admin');

/**
 * Donor management access (donors, societies, admin)
 */
const donorManagement = authorize('donor', 'society', 'admin');

/**
 * Blood bank operations (hospitals, societies, admin)
 */
const bloodBankOperations = authorize('hospital', 'society', 'admin');

/**
 * Admin only access
 */
const adminOnly = authorize('admin');

/**
 * Donor only access
 */
const donorOnly = authorize('donor');

/**
 * Hospital only access
 */
const hospitalOnly = authorize('hospital');

/**
 * Society only access
 */
const societyOnly = authorize('society');

// ----------------------------------------------------------------
//  Dynamic role middleware factory
//  Usage: roleMiddleware('donor', 'admin')
// ----------------------------------------------------------------
const roleMiddleware = (...roles) => {
  return authorize(...roles);
};

module.exports = {
  roleMiddleware,
  medicalStaffOnly,
  donorManagement,
  bloodBankOperations,
  adminOnly,
  donorOnly,
  hospitalOnly,
  societyOnly,
  // Re-export authorize for direct use
  authorize,
};