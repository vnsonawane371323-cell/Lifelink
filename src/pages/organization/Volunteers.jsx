import { useEffect, useState } from 'react';
import { FiTrash2, FiUser } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../services/api';

export default function Volunteers() {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchVolunteers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/volunteers');
      setVolunteers(res.data?.data || res.data || []);
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to load volunteers';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const removeVolunteer = async (id) => {
    try {
      await api.delete(`/api/volunteers/${id}`);
      toast.success('Volunteer removed');
      setVolunteers((prev) => prev.filter((v) => v._id !== id));
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to remove volunteer';
      toast.error(message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase text-slate-400">Team</p>
          <h1 className="text-xl font-semibold text-slate-900">Volunteers</h1>
        </div>
        <button
          onClick={fetchVolunteers}
          className="text-sm font-semibold text-[#f43f5e] hover:underline"
        >
          Refresh
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {volunteers.map((vol) => (
          <div key={vol._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#f43f5e] to-[#fb7185] text-white flex items-center justify-center">
                <FiUser className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">{vol.name || 'Volunteer'}</p>
                <p className="text-sm text-slate-500">{vol.email}</p>
              </div>
            </div>
            <p className="text-sm text-slate-600">{vol.phone || 'No phone'}</p>
            <p className="text-xs text-slate-500">Joined: {new Date(vol.createdAt || Date.now()).toLocaleDateString()}</p>
            <div className="flex gap-2">
              <button className="flex-1 rounded-lg border border-slate-200 text-slate-700 font-semibold py-2">View Profile</button>
              <button
                className="rounded-lg bg-slate-900 text-white px-3 py-2 hover:bg-slate-800"
                onClick={() => removeVolunteer(vol._id)}
              >
                <FiTrash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
        {!volunteers.length && !loading && <p className="text-slate-500">No volunteers yet.</p>}
        {loading && <p className="text-slate-500">Loading...</p>}
      </div>
    </div>
  );
}
