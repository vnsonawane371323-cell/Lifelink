const mongoose = require('mongoose');

const bloodRequestSchema = new mongoose.Schema(
  {
    patientName: {
      type: String,
      required: true,
      trim: true,
    },
    bloodGroup: {
      type: String,
      required: true,
      trim: true,
    },
    hospital: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    contactNumber: {
      type: String,
      required: true,
      trim: true,
    },
    urgencyLevel: {
      type: String,
      enum: ['Normal', 'Urgent', 'Critical'],
      default: 'Normal',
      trim: true,
    },
    // Backward-compatible fields used by existing flows
    unitsRequired: {
      type: Number,
      min: 1,
    },
    urgency: {
      type: String,
      trim: true,
    },
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
    },
    status: {
      type: String,
      enum: ['Open', 'Fulfilled', 'Closed', 'active'],
      default: 'Open',
      trim: true,
    },
  },
  {
    timestamps: true,
    collection: 'requests',
  }
);

bloodRequestSchema.index({ city: 1, status: 1, createdAt: -1 });

module.exports = mongoose.model('BloodRequest', bloodRequestSchema);