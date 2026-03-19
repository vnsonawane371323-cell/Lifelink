import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import StatCard from '../components/StatCard';
import { fetchSocietyByHeadUserId } from '../services/societyService';
import { getMembersBySociety } from '../services/memberService';

const SocietyPage = () => {
  const { user } = useAuth();
  const [society, setSociety] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const soc = await fetchSocietyByHeadUserId(user.uid);
        setSociety(soc);
        if (soc) {
          const m = await getMembersBySociety(soc.id);
          setMembers(m);
        }
      } catch (err) {
        console.error('Failed to load society:', err);
      } finally {
        setLoading(false);
      }
    };
    if (user) load();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="inline-block h-6 w-6 border-2 border-hospitalBlue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // No society registered yet
  if (!society) {
    return (
      <div className="text-center py-24">
        <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
        </svg>
        <h2 className="mt-4 text-lg font-semibold text-gray-900">No Society Registered</h2>
        <p className="text-sm text-gray-500 mt-1">Register your blood donation society to get started.</p>
        <Link
          to="/register-society"
          className="inline-block mt-6 px-5 py-2.5 bg-hospitalBlue text-white text-sm font-medium rounded-md hover:bg-hospitalBlueDark transition-colors"
        >
          Register Society
        </Link>
      </div>
    );
  }

  const availableCount = members.filter((m) => m.isAvailable).length;
  const rareCount = members.filter((m) => m.isRare).length;

  return (
    <div>
      {/* Verification Banner */}
      {!society.isVerified && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg px-5 py-4 flex items-start gap-3">
          <svg className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.168 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="text-sm font-semibold text-amber-800">Verification Pending</p>
            <p className="text-xs text-amber-700 mt-0.5">
              Your society is awaiting admin verification. You can view your dashboard, but some
              actions (emergency responses, donor matching) will remain disabled until approved.
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">{society.name}</h1>
          {society.isVerified && (
            <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs font-medium px-2 py-1 rounded-full">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Verified
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 mt-1">
          {society.city} &middot; {user?.email}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Members"
          value={members.length}
          accent="hospitalBlue"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
          }
        />
        <StatCard
          label="Available Donors"
          value={availableCount}
          accent="green"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          label="Rare Blood Donors"
          value={rareCount}
          accent="medicalRed"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          }
        />
        <StatCard
          label="Active Emergencies"
          value={0}
          accent="amber"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
          }
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Manage Members</h2>
          <p className="text-sm text-gray-500">View, add, and manage donors registered under your society.</p>
          <Link
            to="/society/members"
            className={`inline-block mt-4 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              society.isVerified
                ? 'bg-hospitalBlue text-white hover:bg-hospitalBlueDark'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none'
            }`}
          >
            View Members
          </Link>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Incoming Requests</h2>
          <p className="text-sm text-gray-500">Emergency blood requests from hospitals and receivers.</p>
          <div className="mt-4 border-t border-gray-100 pt-3">
            <p className="text-sm text-gray-400">No pending requests.</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Society Profile</h2>
          <p className="text-sm text-gray-500">
            Registration ID: <span className="font-mono text-gray-700">{society.registrationId || '—'}</span>
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Contact: {society.contactPhone || society.contactEmail || '—'}
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Analytics</h2>
          <p className="text-sm text-gray-500">Donation trends, response times, and performance data.</p>
          <div className="mt-4 border-t border-gray-100 pt-3">
            <p className="text-sm text-gray-400">Analytics coming soon.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocietyPage;
