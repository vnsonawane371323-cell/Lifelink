import { useEffect, useState } from 'react';
import StatCard from '../components/StatCard';
import { FaUserFriends, FaHospital, FaHandsHelping } from 'react-icons/fa';
import RecentRequests from '../components/RecentRequests';
import api from '../services/api';
import { useCity } from '../contexts/CityContext';

const initialStats = {
  availableDonors: 0,
  hospitalsWithBloodBank: 0,
  donationSocieties: 0,
};

export default function DashboardHome() {
  const { selectedCity } = useCity();
  const [stats, setStats] = useState(initialStats);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCityStats = async () => {
      if (!selectedCity) return;
      try {
        setLoading(true);
        const [donorRes, hospitalRes, societyRes] = await Promise.all([
          api.get(`/api/donors/city/${encodeURIComponent(selectedCity)}`),
          api.get(`/api/hospitals/city/${encodeURIComponent(selectedCity)}`),
          api.get(`/api/societies/city/${encodeURIComponent(selectedCity)}`),
        ]);

        const hospitals = hospitalRes?.data?.data || [];
        setStats({
          availableDonors: donorRes?.data?.count ?? 0,
          hospitalsWithBloodBank: hospitals.filter((item) => item.hasBloodBank).length,
          donationSocieties: societyRes?.data?.count ?? 0,
        });
      } catch (_error) {
        setStats(initialStats);
      } finally {
        setLoading(false);
      }
    };

    fetchCityStats();
  }, [selectedCity]);

  const cards = [
    { icon: <FaUserFriends />, title: 'Available Donors', value: stats.availableDonors },
    { icon: <FaHospital />, title: 'Hospitals with Blood Bank', value: stats.hospitalsWithBloodBank },
    { icon: <FaHandsHelping />, title: 'Blood Donation Societies', value: stats.donationSocieties },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {loading ? <div className="rounded-2xl bg-white shadow-md p-4 text-slate-500">Loading city datasets...</div> : null}

      <RecentRequests />
    </div>
  );
}
