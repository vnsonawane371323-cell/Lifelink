// Utility functions for LifeLink
export const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
};

export const formatDateTime = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
};

export const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Bombay'];

export const roles = ['Donor', 'Society', 'Receiver', 'Admin'];

// Re-export all blood-domain utilities for convenience
export {
  calculateNextEligibleDate,
  detectRareBloodGroup,
  isDonorEligible,
  daysUntilEligible,
  haversineDistanceKm,
  filterByRadius,
  escalationRadiusKm,
  incrementTrustScore,
  createResponseDeadline,
} from './bloodUtils';
