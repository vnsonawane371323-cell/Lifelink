// ============================================================
// Example JSON documents for every Firestore collection
// Use these as reference when seeding or testing.
// ============================================================

export const exampleUser = {
  // Document path: users/{uid}
  name: 'Dr. Priya Sharma',
  email: 'priya.sharma@hospital.org',
  role: 'receiver',
  phone: '+91 98765 43210',
  city: 'Mumbai',
  createdAt: '2026-01-15T08:30:00Z', // Firestore Timestamp
  isVerified: true,
  trustScore: 0,
  lastLogin: '2026-02-16T10:00:00Z',
};

export const exampleSociety = {
  // Document path: societies/{autoId}
  name: 'Red Drop Foundation',
  registrationId: 'NGO-MH-20241234',
  city: 'Mumbai',
  headUserId: 'uid_abc123',
  contactPhone: '+91 22 1234 5678',
  contactEmail: 'contact@reddrop.org',
  isVerified: true,
  totalMembers: 120,
  availableMembers: 87,
  rareDonorCount: 4,
  createdAt: '2025-06-01T00:00:00Z',
  geoLocation: {
    lat: 19.076,
    lng: 72.8777,
  },
};

export const exampleMember = {
  // Document path: members/{autoId}
  societyId: 'soc_xyz789',
  name: 'Rahul Desai',
  bloodGroup: 'O-',
  phone: '+91 91234 56789',
  city: 'Mumbai',
  isAvailable: true,
  lastDonationDate: '2025-11-01T00:00:00Z',
  nextEligibleDate: '2026-01-30T00:00:00Z', // +90 days
  donationCount: 5,
  trustScore: 25,
  isRare: true,
  geoLocation: {
    lat: 19.082,
    lng: 72.881,
  },
  createdAt: '2025-03-12T00:00:00Z',
};

export const exampleEmergencyRequest = {
  // Document path: emergencyRequests/{autoId}
  createdByUserId: 'uid_def456',
  bloodGroup: 'O-',
  patientCity: 'Mumbai',
  hospitalName: 'Lilavati Hospital',
  isEconomicallyWeak: false,
  status: 'searching',
  escalationStage: 1,
  targetedSocieties: ['soc_xyz789', 'soc_abc123'],
  acceptedBySocietyId: null,
  acceptedMemberId: null,
  createdAt: '2026-02-16T09:00:00Z',
  geoLocation: {
    lat: 19.0508,
    lng: 72.8296,
  },
  isRareEmergency: true,
  responseDeadline: '2026-02-16T10:00:00Z', // 1 hour window
};

export const exampleDonation = {
  // Document path: donations/{autoId}
  memberId: 'mem_001',
  societyId: 'soc_xyz789',
  emergencyId: 'emg_001',
  donationDate: '2026-02-16T11:30:00Z',
  verifiedBySociety: true,
  certificateIssued: false,
};

export const exampleNotification = {
  // Document path: notifications/{autoId}
  targetUserId: 'uid_abc123',
  type: 'emergency_alert',
  message: 'Urgent: O- blood needed at Lilavati Hospital, Mumbai.',
  relatedEmergencyId: 'emg_001',
  isRead: false,
  createdAt: '2026-02-16T09:01:00Z',
};

export const exampleAnalytics = {
  // Document path: analytics/bloodGroupStats
  'A+': 245,
  'A-': 32,
  'B+': 310,
  'B-': 28,
  'AB+': 65,
  'AB-': 8,
  'O+': 420,
  'O-': 15,
  'Bombay': 2,
};

export const exampleRareDonor = {
  // Document path: rareDonorRegistry/{autoId}
  memberId: 'mem_001',
  bloodGroup: 'O-',
  city: 'Mumbai',
  societyId: 'soc_xyz789',
  geoLocation: {
    lat: 19.082,
    lng: 72.881,
  },
};
