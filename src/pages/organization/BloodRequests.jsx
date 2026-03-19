import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import api from '../../services/api';
import CreateBloodRequest from '../../components/organization/CreateBloodRequest';

const badgeMap = {
  Normal: 'bg-blue-100 text-blue-700',
  Urgent: 'bg-orange-100 text-orange-700',
  Critical: 'bg-red-100 text-red-700',
};

export default function BloodRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/blood-requests');
      setRequests(res.data?.data || res.data || []);
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to load requests';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs uppercase text-slate-400">Requests</p>
            <h1 className="text-xl font-semibold text-slate-900">Blood Requests</h1>
          </div>
          <button
            onClick={fetchRequests}
            className="text-sm font-semibold text-[#f43f5e] hover:underline"
          >
            Refresh
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500">
                <th className="py-2 pr-4">Patient</th>
                <th className="py-2 pr-4">Blood Group</th>
                <th className="py-2 pr-4">Hospital</th>
                <th className="py-2 pr-4">City</th>
                <th className="py-2 pr-4">Urgency</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Created</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req._id} className="border-t border-slate-100">
                  <td className="py-3 pr-4 font-semibold text-slate-900">{req.patientName}</td>
                  <td className="py-3 pr-4">{req.bloodGroup}</td>
                  <td className="py-3 pr-4">{req.hospital || 'N/A'}</td>
                  <td className="py-3 pr-4">{req.city}</td>
                  <td className="py-3 pr-4">
                    <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${badgeMap[req.urgencyLevel] || badgeMap[req.urgency] || 'bg-slate-100 text-slate-700'}`}>
                      {req.urgencyLevel || req.urgency || 'Normal'}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-slate-700">{req.status}</td>
                  <td className="py-3 pr-4 text-slate-500">{dayjs(req.createdAt).format('DD MMM, YYYY')}</td>
                </tr>
              ))}
              {!requests.length && !loading && (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-slate-500">No blood requests yet.</td>
                </tr>
              )}
              {loading && (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-slate-500">Loading...</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6">
        <CreateBloodRequest />
      </div>
    </div>
  );
}
