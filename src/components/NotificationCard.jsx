import { FaBell, FaExclamationTriangle, FaHeartbeat } from 'react-icons/fa';

const typeConfig = {
  blood_request: {
    label: 'Blood Request',
    icon: FaHeartbeat,
    iconClass: 'text-rose-600 bg-rose-100',
  },
  alert: {
    label: 'Emergency Alert',
    icon: FaExclamationTriangle,
    iconClass: 'text-amber-600 bg-amber-100',
  },
  system: {
    label: 'System Message',
    icon: FaBell,
    iconClass: 'text-sky-600 bg-sky-100',
  },
};

function formatTime(value) {
  if (!value) return '-';
  const date = new Date(value);
  return date.toLocaleString();
}

export default function NotificationCard({ notification, onMarkAsRead, markLoading }) {
  const config = typeConfig[notification?.type] || typeConfig.system;
  const TypeIcon = config.icon;

  return (
    <article
      className={`rounded-2xl shadow-md p-5 border border-transparent ${
        notification?.isRead ? 'bg-white' : 'bg-red-50'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${config.iconClass}`}>
            <TypeIcon className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{config.label}</p>
            <h3 className="mt-1 text-lg font-semibold text-slate-800">{notification?.title || 'Notification'}</h3>
          </div>
        </div>

        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
            notification?.isRead ? 'bg-slate-100 text-slate-700' : 'bg-rose-100 text-rose-700'
          }`}
        >
          {notification?.isRead ? 'Read' : 'Unread'}
        </span>
      </div>

      <p className="mt-3 text-sm text-slate-700">{notification?.message}</p>

      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="text-xs text-slate-500">{formatTime(notification?.createdAt)}</p>

        {!notification?.isRead ? (
          <button
            type="button"
            onClick={() => onMarkAsRead(notification._id)}
            disabled={markLoading}
            className="rounded-xl bg-[#FF6B6B] px-4 py-2 text-xs font-semibold text-white hover:opacity-95 disabled:opacity-60"
          >
            {markLoading ? 'Marking...' : 'Mark as Read'}
          </button>
        ) : null}
      </div>
    </article>
  );
}
