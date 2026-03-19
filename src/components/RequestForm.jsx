import { useEffect, useState } from 'react';

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function RequestForm({ defaultCity = '', onSuccess }) {
  const [formData, setFormData] = useState({
    patientName: '',
    bloodGroup: '',
    city: defaultCity,
    contactNumber: '',
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const backendUrl = 'https://lifelink-backend.onrender.com/api/blood-requests';

  useEffect(() => {
    setFormData((prev) => ({ ...prev, city: defaultCity }));
  }, [defaultCity]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setStatus({ type: '', message: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { patientName, bloodGroup, city, contactNumber } = formData;

    if (!patientName || !bloodGroup || !city || !contactNumber) {
      setStatus({ type: 'error', message: 'Please fill all fields.' });
      return;
    }

    try {
      const res = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ patientName, bloodGroup, city, contactNumber }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || 'Request failed');
      }

      setStatus({ type: 'success', message: 'Blood request created successfully!' });
      setFormData({ patientName: '', bloodGroup: '', city: defaultCity, contactNumber: '' });
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Something went wrong.' });
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
            value={formData.patientName}
            onChange={handleChange}
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
            value={formData.bloodGroup}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/30"
          >
            <option value="">Select blood group</option>
            {bloodGroups.map((group) => (
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
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/30"
            placeholder="Enter city"
          />
        </div>

        <div>
          <label htmlFor="contactNumber" className="block text-sm text-slate-600 mb-1">
            Contact Number
          </label>
          <input
            id="contactNumber"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/30"
            placeholder="Enter contact number"
          />
        </div>

        {status.message ? (
          <p className="md:col-span-2 text-sm" style={{ color: status.type === 'error' ? '#e11d48' : '#16a34a' }}>
            {status.message}
          </p>
        ) : null}

        <div className="md:col-span-2">
          <button
            type="submit"
            className="rounded-xl bg-[#FF6B6B] px-6 py-2.5 text-white font-semibold hover:opacity-95"
          >
            Create Request
          </button>
        </div>
      </form>
    </section>
  );
}
