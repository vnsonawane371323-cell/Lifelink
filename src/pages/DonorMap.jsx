import { useEffect, useMemo, useState } from 'react';
import BaseLayout from '../layouts/BaseLayout';
import BloodFilter from '../components/BloodFilter';
import MapView from '../components/MapView';
import api from '../services/api';

const DEFAULT_CENTER = [19.076, 72.8777]; // Mumbai fallback

export default function DonorMap() {
  const [center, setCenter] = useState(DEFAULT_CENTER);
  const [bloodGroup, setBloodGroup] = useState('');
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!navigator.geolocation) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCenter([position.coords.latitude, position.coords.longitude]);
      },
      () => {
        // Keep fallback center if permission denied or failed.
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  const queryParams = useMemo(
    () => ({
      lat: center[0],
      lng: center[1],
      radius: 30,
      ...(bloodGroup ? { bloodGroup } : {}),
    }),
    [center, bloodGroup]
  );

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await api.get('/api/donors/map', { params: queryParams });
        setDonors((response?.data?.data || []).filter((d) => d.lat && d.lng));
      } catch (err) {
        setError(err?.response?.data?.message || 'Unable to fetch donor map data.');
        setDonors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDonors();
  }, [queryParams]);

  return (
    <BaseLayout>
      <div className="space-y-5">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#FF6B6B]">Live Blood Donor Map</h1>
            <p className="mt-1 text-slate-600">Find nearby donors visually based on your location.</p>
          </div>
          <div className="text-sm text-slate-500">Showing {donors.length} donor(s)</div>
        </div>

        <BloodFilter value={bloodGroup} onChange={setBloodGroup} loading={loading} />

        {error ? <div className="rounded-2xl bg-rose-50 text-rose-700 shadow-md p-4">{error}</div> : null}

        {loading ? (
          <div className="rounded-2xl bg-white shadow-md p-6 text-slate-500">Loading donor map...</div>
        ) : (
          <MapView center={center} donors={donors} />
        )}
      </div>
    </BaseLayout>
  );
}
