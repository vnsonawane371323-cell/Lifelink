// ============================================================
//  Donor Model — LifeLink
//  Collection: donors
//  Linked to User model for medical blood donation profiles
// ============================================================

const mongoose = require('mongoose');

const donorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      unique: true, // One donor profile per user
    },
    bloodGroup: {
      type: String,
      required: [true, 'Blood group is required'],
      enum: {
        values: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        message: '{VALUE} is not a valid blood group',
      },
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    age: {
      type: Number,
      required: [true, 'Age is required'],
      min: [18, 'Minimum age for donation is 18 years'],
      max: [65, 'Maximum age for donation is 65 years'],
    },
    gender: {
      type: String,
      enum: {
        values: ['male', 'female', 'other'],
        message: '{VALUE} is not a valid gender',
      },
      required: [true, 'Gender is required'],
    },
    city: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: undefined,
      },
    },
    lastDonationDate: {
      type: Date,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    totalDonations: {
      type: Number,
      default: 0,
      min: 0,
    },
    reputationScore: {
      type: Number,
      default: 0,
      min: 0,
    },
    badge: {
      type: String,
      enum: ['None', 'Bronze Donor', 'Silver Donor', 'Gold Donor', 'Lifesaver'],
      default: 'None',
    },
    medicalNotes: {
      type: String,
      trim: true,
      maxlength: [500, 'Medical notes cannot exceed 500 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// -------------------- Middleware ----------------------------

/**
 * Pre-save hook to automatically calculate availability based on last donation date.
 * If last donation was less than 90 days ago, donor is unavailable.
 */
donorSchema.pre('save', function (next) {
  if (this.lastDonationDate) {
    const daysSinceLastDonation = Math.floor(
      (Date.now() - this.lastDonationDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    // 90-day waiting period after donation
    this.isAvailable = daysSinceLastDonation >= 90;
  } else {
    // No donation on record — donor is available
    this.isAvailable = true;
  }
  next();
});

// -------------------- Instance Methods ----------------------

/**
 * Calculate days until next eligible donation.
 */
donorSchema.methods.getDaysUntilEligible = function () {
  if (!this.lastDonationDate) return 0;
  
  const daysSinceLastDonation = Math.floor(
    (Date.now() - this.lastDonationDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  return Math.max(0, 90 - daysSinceLastDonation);
};

// -------------------- Indexes ------------------------------

// Compound index for efficient searching
donorSchema.index({ bloodGroup: 1, city: 1, isAvailable: 1 });
donorSchema.index({ state: 1, isAvailable: 1 });

// Leaderboard index
donorSchema.index({ reputationScore: -1 });

// 2dsphere index for geolocation queries
donorSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Donor', donorSchema);