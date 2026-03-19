// ============================================================
//  Notification Model — LifeLink
//  Manages notification data for blood donation alerts
// ============================================================

const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Notification recipient is required'],
    },
    title: {
      type: String,
      required: [true, 'Notification title is required'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Notification message is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: {
        values: ['blood_request', 'system', 'alert'],
        message: '{VALUE} is not a valid notification type',
      },
      required: [true, 'Notification type is required'],
    },
    relatedRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BloodRequest',
      default: null,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// ----------------------------------------------------------------
//  Indexes for Performance
// ----------------------------------------------------------------

// Compound index for efficient querying by recipient and read status
notificationSchema.index({ recipient: 1, isRead: 1 });

// Index for timestamps to sort by newest first
notificationSchema.index({ createdAt: -1 });

// Index for notification type filtering
notificationSchema.index({ type: 1 });

// ----------------------------------------------------------------
//  Instance Methods
// ----------------------------------------------------------------

/**
 * Mark notification as read
 * @returns {Promise<Notification>} Updated notification
 */
notificationSchema.methods.markAsRead = function () {
  this.isRead = true;
  return this.save();
};

// ----------------------------------------------------------------
//  Static Methods
// ----------------------------------------------------------------

/**
 * Get notifications for a specific user
 * @param {ObjectId} userId - User ID to get notifications for
 * @param {Object} options - Query options (limit, skip, etc.)
 * @returns {Promise<Array>} Array of notifications
 */
notificationSchema.statics.getForUser = function (userId, options = {}) {
  const { limit = 50, skip = 0, unreadOnly = false } = options;
  
  const query = { recipient: userId };
  if (unreadOnly) {
    query.isRead = false;
  }
  
  return this.find(query)
    .populate('relatedRequest', 'bloodGroup unitsRequired hospitalName city urgency')
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .lean();
};

/**
 * Create notification for blood request
 * @param {ObjectId} recipientId - ID of user receiving notification
 * @param {Object} requestData - Blood request data for notification content
 * @returns {Promise<Notification>} Created notification
 */
notificationSchema.statics.createBloodRequestNotification = function (recipientId, requestData) {
  const { bloodGroup, hospitalName, city, unitsRequired, requestId } = requestData;
  
  return this.create({
    recipient: recipientId,
    title: `🩸 Urgent Blood Request - ${bloodGroup}`,
    message: `${hospitalName} in ${city} urgently needs ${unitsRequired} units of ${bloodGroup} blood. Your blood type matches this request. Please consider donating to save lives.`,
    type: 'blood_request',
    relatedRequest: requestId,
  });
};

/**
 * Get unread notification count for user
 * @param {ObjectId} userId - User ID
 * @returns {Promise<Number>} Count of unread notifications
 */
notificationSchema.statics.getUnreadCount = function (userId) {
  return this.countDocuments({
    recipient: userId,
    isRead: false,
  });
};

// ----------------------------------------------------------------
//  Export Model
// ----------------------------------------------------------------

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;