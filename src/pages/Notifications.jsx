import { useEffect, useState } from 'react';
import BaseLayout from '../layouts/BaseLayout';
import NotificationCard from '../components/NotificationCard';
import api from '../services/api';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [markingId, setMarkingId] = useState('');

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/api/notifications');
      setNotifications(response?.data?.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to fetch notifications.');
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      setMarkingId(id);
      await api.put(`/api/notifications/read/${id}`);
      setNotifications((prev) =>
        prev.map((item) => (item._id === id ? { ...item, isRead: true } : item))
      );
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to mark notification as read.');
    } finally {
      setMarkingId('');
    }
  };

  const unreadCount = notifications.filter((item) => !item.isRead).length;

  return (
    <BaseLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#FF6B6B]">Notifications</h1>
            <p className="mt-1 text-slate-600">Alerts for blood requests and system messages.</p>
          </div>
          <div className="rounded-xl bg-white shadow-md px-4 py-2 text-sm text-slate-600">
            Unread: <span className="font-semibold text-[#FF6B6B]">{unreadCount}</span>
          </div>
        </div>

        {error ? <div className="rounded-2xl bg-rose-50 text-rose-700 shadow-md p-4">{error}</div> : null}

        {loading ? (
          <div className="rounded-2xl bg-white shadow-md p-6 text-slate-500">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="rounded-2xl bg-white shadow-md p-6 text-slate-500">No notifications found.</div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <NotificationCard
                key={notification._id}
                notification={notification}
                onMarkAsRead={markAsRead}
                markLoading={markingId === notification._id}
              />
            ))}
          </div>
        )}
      </div>
    </BaseLayout>
  );
}
