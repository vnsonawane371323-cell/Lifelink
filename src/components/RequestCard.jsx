const urgencyStyles = {
  normal: 'bg-slate-100 text-slate-700',
  urgent: 'bg-amber-100 text-amber-700',
  emergency: 'bg-rose-100 text-rose-700',
};

const statusStyles = {
  pending: 'bg-blue-100 text-blue-700',
  accepted: 'bg-indigo-100 text-indigo-700',
  fulfilled: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-slate-200 text-slate-700',
};

const formatLabel = (value) => {
  if (!value) return '-';
  return value.charAt(0).toUpperCase() + value.slice(1);
};

export default function RequestCard({ request }) {
  const urgency = request?.urgency || 'normal';
  const status = request?.status || 'pending';
  const hospital = request?.hospital || request?.hospitalName || '-';
  const units = request?.units ?? request?.unitsRequired ?? '-';

  return (
    <article className="rounded-2xl bg-white shadow-md p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">{request?.patientName || '-'}</h3>
          <p className="text-sm text-slate-500">{hospital}</p>
        </div>
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
            urgencyStyles[urgency] || urgencyStyles.normal
          }`}
        >
          {formatLabel(urgency)}
        </span>
      </div>

      <div className="mt-4 space-y-2 text-sm text-slate-700">
        <p>
          <span className="font-medium">Blood Group:</span> {request?.bloodGroup || '-'}
        </p>
        <p>
          <span className="font-medium">City:</span> {request?.city || '-'}
        </p>
        <p>
          <span className="font-medium">Units Required:</span> {units}
        </p>
        <p>
          <span className="font-medium">Status:</span>{' '}
          <span
            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              statusStyles[status] || statusStyles.pending
            }`}
          >
            {formatLabel(status)}
          </span>
        </p>
      </div>
    </article>
  );
}
