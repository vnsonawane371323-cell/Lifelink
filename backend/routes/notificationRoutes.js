// ============================================================
//  Notification Routes — LifeLink
//  Handles notification management endpoints
// ============================================================

const express = require('express');
const router = express.Router();
const {
  getMyNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  getNotificationStats,
} = require('../controllers/notificationController');
const { protect, authorize } = require('../middleware/authMiddleware');

// ----------------------------------------------------------------
//  User Notification Routes
//  Accessible to all authenticated users
// ----------------------------------------------------------------

/**
 * @route   GET /api/notifications
 * @desc    Get all notifications for the logged-in user
 * @access  Private (authenticated users)
 * @query   page, limit, unreadOnly
 */
router.get('/', protect, getMyNotifications);

/**
 * @route   PUT /api/notifications/read/:id
 * @desc    Mark a specific notification as read
 * @access  Private (notification owner only)
 */
router.put('/read/:id', protect, markNotificationRead);

/**
 * @route   PUT /api/notifications/read-all
 * @desc    Mark all notifications as read for the logged-in user
 * @access  Private (authenticated users)
 */
router.put('/read-all', protect, markAllNotificationsRead);

/**
 * @route   DELETE /api/notifications/:id
 * @desc    Delete a specific notification
 * @access  Private (notification owner only)
 */
router.delete('/:id', protect, deleteNotification);

// ----------------------------------------------------------------
//  Admin Notification Routes
//  Restricted to admin users only
// ----------------------------------------------------------------

/**
 * @route   GET /api/notifications/stats
 * @desc    Get notification statistics and analytics
 * @access  Private (admin only)
 * @query   days (default: 30)
 */
router.get('/stats', protect, authorize('admin'), getNotificationStats);

module.exports = router;