import { useEffect, useState } from 'react';
import api from '../services/api';
import { useCity } from '../contexts/CityContext';

const urgencyClasses = {
  emergency: 'bg-red-100 text-red-700',
  urgent: 'bg-amber-100 text-amber-700',
  normal: 'bg-sky-100 text-sky-700',
};

const formatUrgency = (value) => {
  if (!value) return 'Normal';
  return value.charAt(0).toUpperCase() + value.slice(1);
};

export default function RecentRequests() {
  const { selectedCity } = useCity();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRequests = async () => {
      if (!selectedCity) return;
      try {
        setLoading(true);
        const response = await api.get(`/api/request/city/${encodeURIComponent(selectedCity)}`);
        setRequests((response?.data?.data || []).slice(0, 6));
      } catch (_error) {
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [selectedCity]);

  return (
    <section className="rounded-2xl bg-white shadow-md p-6">
      <h2 className="text-lg font-semibold text-slate-800">Recent Requests</h2>
      <div className="mt-4 overflow-x-auto">
        {loading ? <p className="text-sm text-slate-500">Loading recent requests...</p> : null}
        <table className="min-w-full text-left">
          <thead>
            <tr className="text-xs uppercase tracking-wide text-slate-500 border-b">
              <th className="py-3 pr-4">Patient Name</th>
              <th className="py-3 pr-4">Blood Group</th>
              <th className="py-3 pr-4">Hospital</th>
              <th className="py-3">Urgency Level</th>
            </tr>
          </thead>
          <tbody>
            {!loading && requests.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-4 text-sm text-slate-500">
                  No active requests in this city.
                </td>
              </tr>
            ) : null}
            {requests.map((request) => (
              <tr key={request._id} className="border-b last:border-b-0 text-slate-700">
                <td className="py-3 pr-4 font-medium">{request.patientName}</td>
                <td className="py-3 pr-4">{request.bloodGroup}</td>
                <td className="py-3 pr-4">{request.hospital}</td>
                <td className="py-3">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      urgencyClasses[request.urgency] || urgencyClasses.normal
                    }`}
                  >
                    {formatUrgency(request.urgency)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
