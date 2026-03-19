import { useState } from 'react';

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const urgencyOptions = [
  { label: 'Normal', value: 'normal' },
  { label: 'Urgent', value: 'urgent' },
  { label: 'Emergency', value: 'emergency' },
];

const initialForm = {
  patientName: '',
  bloodGroup: 'A+',
  units: 1,
  hospital: '',
  urgency: 'normal',
  notes: '',
};

export default function RequestForm({ onSubmit, loading, city }) {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.patientName.trim() || !form.hospital.trim() || !city) {
      setError('Patient name, hospital, and selected city are required.');
      return;
    }

    if (!form.units || Number(form.units) < 1) {
      setError('Units required must be at least 1.');
      return;
    }

    try {
      await onSubmit({
        patientName: form.patientName.trim(),
        bloodGroup: form.bloodGroup,
        units: Number(form.units),
        hospital: form.hospital.trim(),
        city,
        urgency: form.urgency,
        notes: form.notes.trim(),
      });
      // Only reset the form when the parent confirms success
      setForm(initialForm);
    } catch {
      // Parent already surfaces the error; keep form values intact so the user can correct them
    }
  };

  return (
    <section className="rounded-2xl bg-white shadow-md p-6">
      <h2 className="text-xl font-semibold text-slate-800">Create Blood Request</h2>

      <form onSubmit={handleSubmit} className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="patientName" className="block text-sm text-slate-600 mb-1">
            Patient Name
          </label>
          <input
            id="patientName"
            name="patientName"
            value={form.patientName}
            onChange={onChange}
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/30"
            placeholder="Enter patient name"
          />
        </div>

        <div>
          <label htmlFor="bloodGroup" className="block text-sm text-slate-600 mb-1">
            Blood Group
          </label>
          <select
            id="bloodGroup"
            name="bloodGroup"
            value={form.bloodGroup}
            onChange={onChange}
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/30"
          >
            {bloodGroups.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="units" className="block text-sm text-slate-600 mb-1">
            Units Required
          </label>
          <input
            id="units"
            name="units"
            type="number"
            min="1"
            max="10"
            value={form.units}
            onChange={onChange}
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/30"
          />
        </div>

        <div>
          <label htmlFor="hospital" className="block text-sm text-slate-600 mb-1">
            Hospital
          </label>
          <input
            id="hospital"
            name="hospital"
            value={form.hospital}
            onChange={onChange}
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/30"
            placeholder="Enter hospital"
          />
        </div>

        <div>
          <label htmlFor="cityLabel" className="block text-sm text-slate-600 mb-1">
            City
          </label>
          <div id="cityLabel" className="w-full rounded-xl border border-slate-200 px-4 py-2.5 bg-slate-50 text-slate-700">
            {city || 'No city selected'}
          </div>
        </div>

        <div>
          <label htmlFor="urgency" className="block text-sm text-slate-600 mb-1">
            Urgency Level
          </label>
          <select
            id="urgency"
            name="urgency"
            value={form.urgency}
            onChange={onChange}
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/30"
          >
            {urgencyOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label htmlFor="notes" className="block text-sm text-slate-600 mb-1">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            rows="3"
            value={form.notes}
            onChange={onChange}
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/30"
            placeholder="Additional details"
          />
        </div>

        {error ? <p className="md:col-span-2 text-sm text-rose-600">{error}</p> : null}

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-[#FF6B6B] px-6 py-2.5 text-white font-semibold hover:opacity-95 disabled:opacity-60"
          >
            {loading ? 'Creating...' : 'Create Request'}
          </button>
        </div>
      </form>
    </section>
  );
}
