import { useAuth } from '../contexts/AuthContext';

const ReceiverPage = () => {
  const { user } = useAuth();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Receiver Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Welcome back, {user?.email || 'Receiver'}. Submit and track blood requests.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-gray-900">Active Requests</h2>
          </div>
          <p className="text-sm text-gray-500">Track the status of your blood requests in real-time.</p>
          <div className="mt-4 border-t border-gray-100 pt-3">
            <p className="text-sm text-gray-400">No active blood requests at this time.</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">New Request</h2>
          <p className="text-sm text-gray-500">Submit a new emergency blood request to nearby societies.</p>
          <button className="mt-4 px-4 py-2 bg-medicalRed text-white text-sm font-medium rounded-md hover:bg-medicalRedDark transition-colors">
            + Emergency Request
          </button>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Request History</h2>
          <p className="text-sm text-gray-500">View past blood requests and their fulfillment status.</p>
          <div className="mt-4 border-t border-gray-100 pt-3">
            <p className="text-sm text-gray-400">No previous requests on record.</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Hospital Profile</h2>
          <p className="text-sm text-gray-500">Update your hospital or facility information.</p>
          <button className="mt-4 px-4 py-2 border border-gray-300 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiverPage;
