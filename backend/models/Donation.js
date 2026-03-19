// ============================================================
//  Donation Model — LifeLink
//  Collection: donations
//  Tracks blood donation scheduling, completion, and history
// ============================================================

const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema(
  {
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Donor',
      required: [true, 'Donor ID is required'],
    },
    requestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BloodRequest',
      required: [true, 'Blood request ID is required'],
    },
    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Hospital ID is required'],
    },
    bloodGroup: {
      type: String,
      required: [true, 'Blood group is required'],
      enum: {
        values: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        message: '{VALUE} is not a valid blood group',
      },
    },
    unitsDonated: {
      type: Number,
      required: [true, 'Units donated is required'],
      min: [1, 'Minimum 1 unit required'],
      max: [3, 'Maximum 3 units per donation'],
    },
    donationDate: {
      type: Date,
      required: [true, 'Donation date is required'],
    },
    status: {
      type: String,
      enum: {
        values: ['scheduled', 'completed', 'cancelled'],
        message: '{VALUE} is not a valid donation status',
      },
      default: 'scheduled',
    },
  },
  {
    timestamps: true,
  }
);

// -------------------- Indexes ------------------------------

donationSchema.index({ donorId: 1, status: 1 });
donationSchema.index({ hospitalId: 1, status: 1 });
donationSchema.index({ requestId: 1 });
donationSchema.index({ donationDate: -1 });

module.exports = mongoose.model('Donation', donationSchema);
