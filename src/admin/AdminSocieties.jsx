import { useState, useEffect } from 'react';
import { getAllSocieties, approveSociety, rejectSociety } from '../services/societyService';

const AdminSocieties = () => {
  const [societies, setSocieties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all | pending | verified
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    loadSocieties();
  }, []);

  const loadSocieties = async () => {
    setLoading(true);
    try {
      const data = await getAllSocieties();
      setSocieties(data);
    } catch (err) {
      console.error('Failed to load societies:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    setActionLoading(id);
    try {
      await approveSociety(id);
      setSocieties((prev) =>
        prev.map((s) => (s.id === id ? { ...s, isVerified: true } : s))
      );
    } catch (err) {
      console.error('Approve failed:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    setActionLoading(id);
    try {
      await rejectSociety(id);
      setSocieties((prev) =>
        prev.map((s) => (s.id === id ? { ...s, isVerified: false } : s))
      );
    } catch (err) {
      console.error('Reject failed:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = societies.filter((s) => {
    if (filter === 'pending') return !s.isVerified;
    if (filter === 'verified') return s.isVerified;
    return true;
  });

  const formatDate = (ts) => {
    if (!ts) return '—';
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Society Verification</h1>
          <p className="text-sm text-gray-500 mt-1">
            Review and approve society registrations.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-md p-1">
          {['all', 'pending', 'verified'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-colors ${
                filter === f
                  ? 'bg-white text-hospitalBlue shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {f}
              {f === 'pending' && (
                <span className="ml-1 bg-amber-100 text-amber-700 text-xs px-1.5 py-0.5 rounded-full">
                  {societies.filter((s) => !s.isVerified).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-16">
          <div className="inline-block h-6 w-6 border-2 border-hospitalBlue border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500 mt-2">Loading societies…</p>
        </div>
      )}

      {/* Empty */}
      {!loading && filtered.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <p className="text-gray-400 text-sm">No societies found for the selected filter.</p>
        </div>
      )}

      {/* Table */}
      {!loading && filtered.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-hospitalBlue text-white text-left">
                  <th className="px-4 py-3 font-semibold">Society Name</th>
                  <th className="px-4 py-3 font-semibold">City</th>
                  <th className="px-4 py-3 font-semibold">Reg. ID</th>
                  <th className="px-4 py-3 font-semibold">Members</th>
                  <th className="px-4 py-3 font-semibold">Registered</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((society) => (
                  <tr key={society.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">{society.name}</td>
                    <td className="px-4 py-3 text-gray-600">{society.city}</td>
                    <td className="px-4 py-3 text-gray-500 font-mono text-xs">
                      {society.registrationId || '—'}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{society.totalMembers || 0}</td>
                    <td className="px-4 py-3 text-gray-500">{formatDate(society.createdAt)}</td>
                    <td className="px-4 py-3">
                      {society.isVerified ? (
                        <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs font-medium px-2 py-1 rounded-full">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-xs font-medium px-2 py-1 rounded-full">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {!society.isVerified ? (
                          <button
                            onClick={() => handleApprove(society.id)}
                            disabled={actionLoading === society.id}
                            className="px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                          >
                            Approve
                          </button>
                        ) : (
                          <button
                            onClick={() => handleReject(society.id)}
                            disabled={actionLoading === society.id}
                            className="px-3 py-1.5 bg-medicalRed text-white text-xs font-medium rounded-md hover:bg-medicalRedDark transition-colors disabled:opacity-50"
                          >
                            Revoke
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-400">
            Showing {filtered.length} of {societies.length} societies
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSocieties;
