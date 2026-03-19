// ============================================================
// Notifications Collection Service
// Collection: notifications/{autoId}
// ============================================================

import {
  collection,
  doc,
  addDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from './firebase';
import { COLLECTIONS, NOTIFICATION_TYPES } from './schema';

const colRef = () => collection(db, COLLECTIONS.NOTIFICATIONS);

/**
 * Send a notification to a user.
 */
export const sendNotification = async (data) => {
  const docRef = await addDoc(colRef(), {
    targetUserId: data.targetUserId,
    type: data.type,
    message: data.message,
    relatedEmergencyId: data.relatedEmergencyId || null,
    isRead: false,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

/**
 * Broadcast an emergency alert to multiple users.
 */
export const broadcastEmergencyAlert = async (userIds, message, emergencyId) => {
  const batch = writeBatch(db);

  userIds.forEach((uid) => {
    const ref = doc(collection(db, COLLECTIONS.NOTIFICATIONS));
    batch.set(ref, {
      targetUserId: uid,
      type: NOTIFICATION_TYPES.EMERGENCY_ALERT,
      message,
      relatedEmergencyId: emergencyId,
      isRead: false,
      createdAt: serverTimestamp(),
    });
  });

  await batch.commit();
};

/**
 * Get all notifications for a user (newest first).
 */
export const getNotifications = async (userId) => {
  const q = query(
    colRef(),
    where('targetUserId', '==', userId),
    orderBy('createdAt', 'desc'),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

/**
 * Get unread notification count.
 */
export const getUnreadCount = async (userId) => {
  const q = query(
    colRef(),
    where('targetUserId', '==', userId),
    where('isRead', '==', false),
  );
  const snap = await getDocs(q);
  return snap.size;
};

/**
 * Mark a notification as read.
 */
export const markAsRead = async (notificationId) => {
  await updateDoc(doc(db, COLLECTIONS.NOTIFICATIONS, notificationId), {
    isRead: true,
  });
};

/**
 * Mark all notifications as read for a user.
 */
export const markAllAsRead = async (userId) => {
  const q = query(
    colRef(),
    where('targetUserId', '==', userId),
    where('isRead', '==', false),
  );
  const snap = await getDocs(q);

  if (snap.empty) return;

  const batch = writeBatch(db);
  snap.docs.forEach((d) => {
    batch.update(d.ref, { isRead: true });
  });
  await batch.commit();
};
