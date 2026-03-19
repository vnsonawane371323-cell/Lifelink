import { useEffect, useState } from 'react';
import { FaBuilding, FaTint, FaUsers, FaVial } from 'react-icons/fa';
import BaseLayout from '../layouts/BaseLayout';
import StatCard from '../components/StatCard';
import BloodGroupChart from '../components/BloodGroupChart';
import CityDonorChart from '../components/CityDonorChart';
import api from '../services/api';

const initialStats = {
  totalDonors: 0,
  totalBloodRequests: 0,
  emergencyRequests: 0,
  registeredSocieties: 0,
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(initialStats);
  const [bloodGroups, setBloodGroups] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError('');

        const [statsRes, bloodRes, cityRes] = await Promise.all([
          api.get('/api/admin/stats'),
          api.get('/api/admin/bloodgroups'),
          api.get('/api/admin/cities'),
        ]);

        setStats(statsRes?.data?.data || initialStats);
        setBloodGroups(bloodRes?.data?.data || []);
        setCities(cityRes?.data?.data || []);
      } catch (err) {
        setError(err?.response?.data?.message || 'Unable to load admin analytics.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const cards = [
    { title: 'Total Donors', value: stats.totalDonors, icon: <FaUsers /> },
    { title: 'Total Blood Requests', value: stats.totalBloodRequests, icon: <FaVial /> },
    { title: 'Emergency Requests', value: stats.emergencyRequests, icon: <FaTint /> },
    { title: 'Registered Societies', value: stats.registeredSocieties, icon: <FaBuilding /> },
  ];

  return (
    <BaseLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#FF6B6B]">Admin Dashboard</h1>
          <p className="mt-1 text-slate-600">Platform statistics and analytics overview.</p>
        </div>

        {error ? <div className="rounded-2xl bg-rose-50 text-rose-700 shadow-md p-4">{error}</div> : null}

        {loading ? (
          <div className="rounded-2xl bg-white shadow-md p-6 text-slate-500">Loading admin analytics...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {cards.map((card) => (
                <StatCard key={card.title} {...card} />
              ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <BloodGroupChart data={bloodGroups} />
              <CityDonorChart data={cities} />
            </div>
          </>
        )}
      </div>
    </BaseLayout>
  );
}
