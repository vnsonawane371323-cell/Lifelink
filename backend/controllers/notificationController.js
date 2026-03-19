// ============================================================
//  Notification Controller — LifeLink
//  Manages notification operations and email dispatch
// ============================================================

const asyncHandler = require('express-async-handler');
const Notification = require('../models/Notification');
const User = require('../models/User');
const emailService = require('../services/emailService');

// ----------------------------------------------------------------
//  User Notification Management
// ----------------------------------------------------------------

/**
 * @desc    Get all notifications for logged-in user
 * @route   GET /api/notifications
 * @access  Private
 */
const getMyNotifications = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20, unreadOnly = false } = req.query;

    // Calculate pagination
    const skip = (page - 1) * limit;
    const queryLimit = parseInt(limit);

    // Get notifications for user
    const notifications = await Notification.getForUser(userId, {
      limit: queryLimit,
      skip,
      unreadOnly: unreadOnly === 'true',
    });

    // Get total count for pagination
    const totalQuery = { recipient: userId };
    if (unreadOnly === 'true') {
      totalQuery.isRead = false;
    }
    const total = await Notification.countDocuments(totalQuery);

    // Get unread count
    const unreadCount = await Notification.getUnreadCount(userId);

    res.status(200).json({
      success: true,
      message: `Retrieved ${notifications.length} notifications`,
      data: notifications,
      pagination: {
        page: parseInt(page),
        limit: queryLimit,
        total,
        pages: Math.ceil(total / queryLimit),
      },
      unreadCount,
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications',
    });
  }
});

/**
 * @desc    Mark notification as read
 * @route   PUT /api/notifications/read/:id
 * @access  Private
 */
const markNotificationRead = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Find notification belonging to user
    const notification = await Notification.findOne({
      _id: id,
      recipient: userId,
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found',
      });
    }

    // Check if already read
    if (notification.isRead) {
      return res.status(200).json({
        success: true,
        message: 'Notification already marked as read',
        data: notification,
      });
    }

    // Mark as read
    await notification.markAsRead();

    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      data: notification,
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark notification as read',
    });
  }
});

/**
 * @desc    Mark all notifications as read for user
 * @route   PUT /api/notifications/read-all
 * @access  Private
 */
const markAllNotificationsRead = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;

    // Update all unread notifications for user
    const result = await Notification.updateMany(
      {
        recipient: userId,
        isRead: false,
      },
      {
        isRead: true,
      }
    );

    res.status(200).json({
      success: true,
      message: `Marked ${result.modifiedCount} notifications as read`,
      data: {
        modifiedCount: result.modifiedCount,
      },
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark notifications as read',
    });
  }
});

/**
 * @desc    Delete a notification
 * @route   DELETE /api/notifications/:id
 * @access  Private
 */
const deleteNotification = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Find and delete notification belonging to user
    const notification = await Notification.findOneAndDelete({
      _id: id,
      recipient: userId,
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notification deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete notification',
    });
  }
});

// ----------------------------------------------------------------
//  Internal Notification Creation Functions
//  Used by other controllers/services
// ----------------------------------------------------------------

/**
 * @desc    Create a new notification (internal use)
 * @param   {Object} notificationData - Notification details
 * @returns {Promise<Object>} Created notification and email result
 */
const createNotification = async (notificationData) => {
  try {
    const { recipientId, title, message, type, relatedRequest } = notificationData;

    // Validate recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      throw new Error('Recipient user not found');
    }

    // Create notification in database
    const notification = await Notification.create({
      recipient: recipientId,
      title,
      message,
      type,
      relatedRequest: relatedRequest || null,
    });

    // Send email notification if email is available
    let emailResult = { success: false, message: 'Email not sent' };
    
    if (recipient.email) {
      if (type === 'blood_request' && relatedRequest) {
        // For blood request notifications, use specialized email template
        emailResult = await emailService.sendBloodRequestNotification(
          recipient.email,
          recipient.name,
          {
            bloodGroup: notificationData.bloodGroup,
            hospitalName: notificationData.hospitalName,
            city: notificationData.city,
            unitsRequired: notificationData.unitsRequired,
            urgency: notificationData.urgency || 'urgent',
          }
        );
      } else {
        // For general notifications, use system notification template
        emailResult = await emailService.sendSystemNotification(
          recipient.email,
          recipient.name,
          title,
          message
        );
      }
    }

    return {
      success: true,
      notification,
      emailResult,
    };
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

/**
 * @desc    Create blood request notifications for matched donors
 * @param   {Array} donorIds - Array of donor user IDs
 * @param   {Object} requestData - Blood request details
 * @returns {Promise<Array>} Array of notification results
 */
const createBloodRequestNotifications = async (donorIds, requestData) => {
  try {
    const results = [];

    for (const donorId of donorIds) {
      try {
        const notificationData = {
          recipientId: donorId,
          title: `🩸 Urgent Blood Request - ${requestData.bloodGroup}`,
          message: `${requestData.hospitalName} in ${requestData.city} urgently needs ${requestData.unitsRequired} units of ${requestData.bloodGroup} blood. Your blood type matches this request!`,
          type: 'blood_request',
          relatedRequest: requestData.requestId,
          // Additional data for email template
          bloodGroup: requestData.bloodGroup,
          hospitalName: requestData.hospitalName,
          city: requestData.city,
          unitsRequired: requestData.unitsRequired,
          urgency: requestData.urgency,
        };

        const result = await createNotification(notificationData);
        results.push({
          donorId,
          success: true,
          notificationId: result.notification._id,
          emailSent: result.emailResult.success,
        });
      } catch (error) {
        console.error(`Failed to create notification for donor ${donorId}:`, error);
        results.push({
          donorId,
          success: false,
          error: error.message,
        });
      }
    }

    return results;
  } catch (error) {
    console.error('Error creating blood request notifications:', error);
    throw error;
  }
};

/**
 * @desc    Get notification statistics for admin
 * @route   GET /api/notifications/stats
 * @access  Private (admin only)
 */
const getNotificationStats = asyncHandler(async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - days);

    // Aggregate notification statistics
    const stats = await Notification.aggregate([
      {
        $match: {
          createdAt: { $gte: dateLimit },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          read: {
            $sum: {
              $cond: ['$isRead', 1, 0],
            },
          },
          unread: {
            $sum: {
              $cond: ['$isRead', 0, 1],
            },
          },
        },
      },
    ]);

    // Get type distribution
    const typeStats = await Notification.aggregate([
      {
        $match: {
          createdAt: { $gte: dateLimit },
        },
      },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
        },
      },
    ]);

    const result = {
      period: `${days} days`,
      total: stats[0]?.total || 0,
      read: stats[0]?.read || 0,
      unread: stats[0]?.unread || 0,
      typeDistribution: typeStats,
      emailServiceStatus: emailService.getStatus(),
    };

    res.status(200).json({
      success: true,
      message: 'Notification statistics retrieved successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error fetching notification statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notification statistics',
    });
  }
});

// ----------------------------------------------------------------
//  Export Functions
// ----------------------------------------------------------------

module.exports = {
  getMyNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  createNotification,
  createBloodRequestNotifications,
  getNotificationStats,
};