import { useAuth } from '../contexts/AuthContext';

const DonorPage = () => {
  const { user } = useAuth();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Donor Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Welcome back, {user?.email || 'Donor'}. Manage your donation profile and respond to requests.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">My Profile</h2>
          <p className="text-sm text-gray-500">View and update your donor information, blood type, and availability.</p>
          <button className="mt-4 px-4 py-2 border border-gray-300 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
            View Profile
          </button>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Active Requests</h2>
          <p className="text-sm text-gray-500">Emergency requests matching your blood type.</p>
          <div className="mt-4 border-t border-gray-100 pt-3">
            <p className="text-sm text-gray-400">No active requests at this time.</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Donation History</h2>
          <p className="text-sm text-gray-500">Track your past blood donations and contributions.</p>
          <div className="mt-4 border-t border-gray-100 pt-3">
            <p className="text-sm text-gray-400">No donation records found.</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Notifications</h2>
          <p className="text-sm text-gray-500">Important alerts and updates from your societies.</p>
          <div className="mt-4 border-t border-gray-100 pt-3">
            <p className="text-sm text-gray-400">No new notifications.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorPage;
