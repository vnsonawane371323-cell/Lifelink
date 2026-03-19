const bloodGroupOptions = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function DonorFilters({ bloodGroup, city, onBloodGroupChange, onCityChange, onSearch, loading, cityLocked = false }) {
  return (
    <section className="rounded-2xl bg-white shadow-md p-5">
      <h2 className="text-lg font-semibold text-slate-800">Donor Filters</h2>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label htmlFor="bloodGroup" className="block text-sm text-slate-600 mb-1">
            Blood Group
          </label>
          <select
            id="bloodGroup"
            value={bloodGroup}
            onChange={(e) => onBloodGroupChange(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/30"
          >
            <option value="">All</option>
            {bloodGroupOptions.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="city" className="block text-sm text-slate-600 mb-1">
            City
          </label>
          <input
            id="city"
            type="text"
            value={city}
            onChange={(e) => onCityChange(e.target.value)}
            placeholder="Search by city"
            readOnly={cityLocked}
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/30"
          />
        </div>

        <div className="flex items-end">
          <button
            type="button"
            onClick={onSearch}
            disabled={loading}
            className="w-full rounded-xl bg-[#FF6B6B] text-white font-semibold py-2.5 hover:opacity-95 disabled:opacity-60"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>
    </section>
  );
}
