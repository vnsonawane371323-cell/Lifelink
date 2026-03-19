import { useEffect, useState } from 'react';
import BaseLayout from '../layouts/BaseLayout';
import RequestForm from '../components/RequestForm';
import RequestCard from '../components/RequestCard';
import api from '../services/api';
import { useCity } from '../contexts/CityContext';

export default function BloodRequests() {
  const { selectedCity } = useCity();
  const [requests, setRequests] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const fetchRequests = async () => {
    if (!selectedCity) return;
    try {
      setLoadingList(true);
      setError('');
      const response = await api.get(`/api/request/city/${encodeURIComponent(selectedCity)}`);
      setRequests(response?.data?.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to fetch blood requests.');
      setRequests([]);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [selectedCity]);

  const createRequest = async (payload) => {
    try {
      setCreating(true);
      setError('');
      const response = await api.post('/api/request/create', payload);
      // Optimistically prepend the new request so the list updates instantly
      const newRequest = response?.data?.request;
      if (newRequest) {
        setRequests((prev) => [newRequest, ...prev]);
      }
      // Re-fetch for full server-state accuracy
      await fetchRequests();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to create blood request.');
      throw err; // re-throw so RequestForm knows the submission failed
    } finally {
      setCreating(false);
    }
  };

  return (
    <BaseLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#FF6B6B]">Blood Requests</h1>
          <p className="mt-1 text-slate-600">Create and manage blood requests for {selectedCity}.</p>
        </div>

        <RequestForm onSubmit={createRequest} loading={creating} city={selectedCity} />

        {error ? <div className="rounded-2xl bg-rose-50 text-rose-700 shadow-md p-4">{error}</div> : null}

        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">Active Requests</h2>
          <span className="text-sm text-slate-500">{requests.length} request(s)</span>
        </div>

        {loadingList ? (
          <div className="rounded-2xl bg-white shadow-md p-6 text-slate-500">Loading requests...</div>
        ) : requests.length === 0 ? (
          <div className="rounded-2xl bg-white shadow-md p-6 text-slate-500">No active blood requests available.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {requests.map((request) => (
              <RequestCard key={request._id} request={request} />
            ))}
          </div>
        )}
      </div>
    </BaseLayout>
  );
}
