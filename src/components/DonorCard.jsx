export default function DonorCard({ donor }) {
  const isAvailable = Boolean(donor?.isAvailable);
  const donorName = donor?.userId?.name || 'Unknown Donor';

  return (
    <article className="rounded-2xl bg-white shadow-md p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">{donorName}</h3>
          <p className="text-sm text-slate-500">{donor?.city || 'Unknown City'}</p>
        </div>
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
            isAvailable ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
          }`}
        >
          {isAvailable ? 'Available' : 'Not Available'}
        </span>
      </div>

      <div className="mt-4 space-y-2 text-sm text-slate-700">
        <p>
          <span className="font-medium">Blood Group:</span> {donor?.bloodGroup || '-'}
        </p>
        <p>
          <span className="font-medium">Phone:</span> {donor?.phone || '-'}
        </p>
      </div>
    </article>
  );
}
