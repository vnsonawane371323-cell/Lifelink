import { useAuth } from '../contexts/AuthContext';

const AdminPage = () => {
  const { user } = useAuth();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Administration</h1>
        <p className="text-sm text-gray-500 mt-1">
          Signed in as {user?.email || 'Admin'}. System settings, user management, and audit logs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">User Management</h2>
          <p className="text-sm text-gray-500">Manage user accounts, roles, and permissions.</p>
          <button className="mt-4 px-4 py-2 border border-gray-300 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
            Manage Users
          </button>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">System Settings</h2>
          <p className="text-sm text-gray-500">Configure application settings and preferences.</p>
          <button className="mt-4 px-4 py-2 border border-gray-300 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
            Open Settings
          </button>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Audit Logs</h2>
          <p className="text-sm text-gray-500">View system activity and security logs.</p>
          <button className="mt-4 px-4 py-2 border border-gray-300 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
            View Logs
          </button>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Reports</h2>
          <p className="text-sm text-gray-500">Generate and download system reports.</p>
          <button className="mt-4 px-4 py-2 border border-gray-300 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
            Generate Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
