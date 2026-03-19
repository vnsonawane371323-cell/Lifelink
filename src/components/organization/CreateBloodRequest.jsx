import { useState } from 'react';
import toast from 'react-hot-toast';
import { createBloodRequest } from '../../services/api';

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const urgencyOptions = ['Normal', 'Urgent', 'Critical'];

export default function CreateBloodRequest() {
  const [form, setForm] = useState({
    patientName: '',
    bloodGroup: '',
    hospital: '',
    city: '',
    contactNumber: '',
    urgencyLevel: 'Normal',
  });
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createBloodRequest(form);
      toast.success('Blood request created successfully');
      setForm({
        patientName: '',
        bloodGroup: '',
        hospital: '',
        city: '',
        contactNumber: '',
        urgencyLevel: 'Normal',
      });
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to create blood request';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs uppercase text-slate-400">Emergency</p>
          <h2 className="text-xl font-semibold text-slate-900">Create Blood Request</h2>
        </div>
      </div>

      <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Patient Name</label>
          <input
            name="patientName"
            value={form.patientName}
            onChange={onChange}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#f43f5e] focus:ring-2 focus:ring-[#f43f5e]/20"
            placeholder="John Doe"
            required
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Blood Group</label>
          <select
            name="bloodGroup"
            value={form.bloodGroup}
            onChange={onChange}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#f43f5e] focus:ring-2 focus:ring-[#f43f5e]/20"
            required
          >
            <option value="">Select blood group</option>
            {bloodGroups.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Hospital</label>
          <input
            name="hospital"
            value={form.hospital}
            onChange={onChange}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#f43f5e] focus:ring-2 focus:ring-[#f43f5e]/20"
            placeholder="City Hospital"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">City</label>
          <input
            name="city"
            value={form.city}
            onChange={onChange}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#f43f5e] focus:ring-2 focus:ring-[#f43f5e]/20"
            placeholder="Nashik"
            required
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Contact Number</label>
          <input
            name="contactNumber"
            value={form.contactNumber}
            onChange={onChange}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#f43f5e] focus:ring-2 focus:ring-[#f43f5e]/20"
            placeholder="9876543210"
            required
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Urgency Level</label>
          <select
            name="urgencyLevel"
            value={form.urgencyLevel}
            onChange={onChange}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#f43f5e] focus:ring-2 focus:ring-[#f43f5e]/20"
          >
            {urgencyOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-5 py-2.5 rounded-lg bg-[#f43f5e] text-white font-semibold shadow hover:opacity-95 disabled:opacity-60"
          >
            {loading ? 'Creating...' : 'Create Blood Request'}
          </button>
        </div>
      </form>
    </div>
  );
}
