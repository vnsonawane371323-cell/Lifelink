const mongoose = require('mongoose');

const OrganizationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    contactNumber: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    headName: {
      type: String,
      trim: true,
    },
    inviteCode: {
      type: String,
      unique: true,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: {
      createdAt: false,
      updatedAt: true,
    },
  }
);

OrganizationSchema.pre('save', async function generateInviteCode(next) {
  if (this.inviteCode) {
    return next();
  }

  try {
    let isUnique = false;

    while (!isUnique) {
      const randomFiveDigitNumber = Math.floor(10000 + Math.random() * 90000);
      const code = `ORG${randomFiveDigitNumber}`;

      const existingOrganization = await this.constructor.exists({ inviteCode: code });

      if (!existingOrganization) {
        this.inviteCode = code;
        isUnique = true;
      }
    }

    return next();
  } catch (error) {
    return next(error);
  }
});

module.exports = mongoose.model("Organization", OrganizationSchema);
