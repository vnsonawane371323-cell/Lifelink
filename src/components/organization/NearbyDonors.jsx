import { useState } from 'react';
import { FiPhoneCall } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { getNearbyDonors } from '../../services/api';

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function NearbyDonors() {
  const [bloodGroup, setBloodGroup] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await getNearbyDonors({ bloodGroup, lat, lng });
      setResults(res.data || res || []);
      toast.success('Nearby donors fetched');
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to fetch donors';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase text-slate-400">Matching</p>
          <h2 className="text-xl font-semibold text-slate-900">Nearby Donors</h2>
        </div>
      </div>

      <form onSubmit={onSubmit} className="grid gap-3 md:grid-cols-4">
        <select
          value={bloodGroup}
          onChange={(e) => setBloodGroup(e.target.value)}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#f43f5e] focus:ring-2 focus:ring-[#f43f5e]/20"
          required
        >
          <option value="">Blood group</option>
          {bloodGroups.map((group) => (
            <option key={group} value={group}>
              {group}
            </option>
          ))}
        </select>
        <input
          value={lat}
          onChange={(e) => setLat(e.target.value)}
          placeholder="Latitude"
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#f43f5e] focus:ring-2 focus:ring-[#f43f5e]/20"
          required
        />
        <input
          value={lng}
          onChange={(e) => setLng(e.target.value)}
          placeholder="Longitude"
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#f43f5e] focus:ring-2 focus:ring-[#f43f5e]/20"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-[#f43f5e] text-white font-semibold shadow hover:opacity-95 disabled:opacity-60"
        >
          {loading ? 'Searching...' : 'Find Nearby Donors'}
        </button>
      </form>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {results.map((donor) => (
          <div key={donor._id || donor.email} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">{donor.name || 'Unknown Donor'}</p>
                <p className="text-xs text-slate-500">{donor.city || 'Unknown city'}</p>
              </div>
              <span className="px-2 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold">{donor.bloodGroup}</span>
            </div>
            <p className="text-sm text-slate-600">{donor.phone || donor.contactNumber || 'N/A'}</p>
            <button
              type="button"
              className="inline-flex items-center gap-2 w-full justify-center rounded-lg bg-slate-900 text-white py-2 text-sm font-semibold hover:bg-slate-800"
              onClick={() => (donor.phone || donor.contactNumber) && (window.location.href = `tel:${donor.phone || donor.contactNumber}`)}
            >
              <FiPhoneCall className="h-4 w-4" /> Call
            </button>
          </div>
        ))}
        {!results.length && (
          <p className="text-sm text-slate-500">No donors yet. Try another location.</p>
        )}
      </div>
    </div>
  );
}
