import { useCallback, useEffect, useState } from 'react';
import BaseLayout from '../layouts/BaseLayout';
import DonorFilters from '../components/DonorFilters';
import DonorCard from '../components/DonorCard';
import api from '../services/api';
import { useCity } from '../contexts/CityContext';

export default function Donors() {
  const { selectedCity } = useCity();
  const [bloodGroup, setBloodGroup] = useState('');
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchDonors = useCallback(async () => {
      if (!selectedCity) return;
    try {
      setLoading(true);
      setError('');

      const response = await api.get(`/api/donors/city/${encodeURIComponent(selectedCity)}`);
      const dataset = response?.data?.data || [];
      setDonors(bloodGroup ? dataset.filter((item) => item.bloodGroup === bloodGroup) : dataset);
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to fetch donors right now.');
      setDonors([]);
    } finally {
      setLoading(false);
    }
  }, [bloodGroup, selectedCity]);

  useEffect(() => {
    fetchDonors();
  }, [fetchDonors]);

  return (
    <BaseLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#FF6B6B]">Donor Management</h1>
          <p className="mt-1 text-slate-600">Find and filter blood donors in {selectedCity}.</p>
        </div>

        <DonorFilters
          bloodGroup={bloodGroup}
          city={selectedCity || ''}
          onBloodGroupChange={setBloodGroup}
          onCityChange={() => {}}
          onSearch={fetchDonors}
          loading={loading}
          cityLocked
        />

        {error ? (
          <div className="rounded-2xl bg-rose-50 text-rose-700 shadow-md p-4">{error}</div>
        ) : null}

        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">Donors List</h2>
          <span className="text-sm text-slate-500">{donors.length} result(s)</span>
        </div>

        {loading ? (
          <div className="rounded-2xl bg-white shadow-md p-6 text-slate-500">Loading donors...</div>
        ) : donors.length === 0 ? (
          <div className="rounded-2xl bg-white shadow-md p-6 text-slate-500">No donors found for selected filters.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {donors.map((donor) => (
              <DonorCard key={donor._id} donor={donor} />
            ))}
          </div>
        )}
      </div>
    </BaseLayout>
  );
}
