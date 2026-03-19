const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function BloodFilter({ value, onChange, loading }) {
  return (
    <section className="rounded-2xl bg-white shadow-md p-4 md:p-5 flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
      <div className="flex-1">
        <label htmlFor="bloodFilter" className="block text-sm text-slate-600 mb-1">
          Filter by Blood Group
        </label>
        <select
          id="bloodFilter"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={loading}
          className="w-full rounded-xl border border-slate-200 px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/30 disabled:opacity-60"
        >
          <option value="">All Blood Groups</option>
          {bloodGroups.map((group) => (
            <option key={group} value={group}>
              {group}
            </option>
          ))}
        </select>
      </div>
      <div className="text-sm text-slate-500">Map updates automatically when filter changes.</div>
    </section>
  );
}
