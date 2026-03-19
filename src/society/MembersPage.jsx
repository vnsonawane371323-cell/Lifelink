import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchSocietyByHeadUserId } from '../services/societyService';
import { getMembersBySociety, addMember } from '../services/memberService';
import { BLOOD_GROUPS } from '../services/schema';

const MembersPage = () => {
  const { user } = useAuth();
  const [society, setSociety] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [bloodFilter, setBloodFilter] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState('');

  const [newMember, setNewMember] = useState({
    name: '',
    bloodGroup: '',
    phone: '',
    city: '',
    lastDonationDate: '',
  });

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
        console.error('Failed to load members:', err);
      } finally {
        setLoading(false);
      }
    };
    if (user) load();
  }, [user]);

  const filtered = useMemo(() => {
    return members.filter((m) => {
      const matchSearch =
        !search || m.name?.toLowerCase().includes(search.toLowerCase());
      const matchBlood = !bloodFilter || m.bloodGroup === bloodFilter;
      const matchAvail =
        availabilityFilter === 'all' ||
        (availabilityFilter === 'available' && m.isAvailable) ||
        (availabilityFilter === 'unavailable' && !m.isAvailable);
      return matchSearch && matchBlood && matchAvail;
    });
  }, [members, search, bloodFilter, availabilityFilter]);

  const handleAddMember = async (e) => {
    e.preventDefault();
    setAddError('');

    if (!newMember.name.trim() || !newMember.bloodGroup) {
      setAddError('Name and blood group are required.');
      return;
    }

    setAddLoading(true);
    try {
      await addMember({
        societyId: society.id,
        name: newMember.name.trim(),
        bloodGroup: newMember.bloodGroup,
        phone: newMember.phone.trim(),
        city: society.city || newMember.city.trim(),
        lastDonationDate: newMember.lastDonationDate || null,
        isAvailable: true,
        _currentTotal: members.length,
        _currentAvailable: members.filter((m) => m.isAvailable).length,
        _currentRare: members.filter((m) => m.isRare).length,
      });

      // Reload members
      const m = await getMembersBySociety(society.id);
      setMembers(m);
      setShowAddForm(false);
      setNewMember({ name: '', bloodGroup: '', phone: '', city: '', lastDonationDate: '' });
    } catch (err) {
      setAddError(err.message || 'Failed to add member.');
    } finally {
      setAddLoading(false);
    }
  };

  const formatDate = (ts) => {
    if (!ts) return '—';
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="inline-block h-6 w-6 border-2 border-hospitalBlue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!society) {
    return (
      <div className="text-center py-24">
        <p className="text-gray-500 text-sm">No society found. Please register first.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Members</h1>
          <p className="text-sm text-gray-500 mt-1">
            {members.length} total members &middot; {society.name}
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-hospitalBlue text-white text-sm font-medium rounded-md hover:bg-hospitalBlueDark transition-colors"
        >
          {showAddForm ? 'Cancel' : '+ Add Member'}
        </button>
      </div>

      {/* Add Member Form */}
      {showAddForm && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Add New Member</h2>
          <form onSubmit={handleAddMember} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {addError && (
              <div className="sm:col-span-2 lg:col-span-3 bg-red-50 border border-red-200 text-medicalRed text-sm rounded-md px-4 py-3">
                {addError}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name <span className="text-medicalRed">*</span>
              </label>
              <input
                type="text"
                value={newMember.name}
                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-hospitalBlue focus:border-hospitalBlue"
                placeholder="Full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Blood Group <span className="text-medicalRed">*</span>
              </label>
              <select
                value={newMember.bloodGroup}
                onChange={(e) => setNewMember({ ...newMember, bloodGroup: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-hospitalBlue focus:border-hospitalBlue"
              >
                <option value="">Select blood group</option>
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                value={newMember.phone}
                onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-hospitalBlue focus:border-hospitalBlue"
                placeholder="+91 98765 43210"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input
                type="text"
                value={newMember.city}
                onChange={(e) => setNewMember({ ...newMember, city: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-hospitalBlue focus:border-hospitalBlue"
                placeholder={society.city || 'City'}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Donation Date</label>
              <input
                type="date"
                value={newMember.lastDonationDate}
                onChange={(e) => setNewMember({ ...newMember, lastDonationDate: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-hospitalBlue focus:border-hospitalBlue"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={addLoading}
                className="px-5 py-2 bg-hospitalBlue text-white text-sm font-medium rounded-md hover:bg-hospitalBlueDark transition-colors disabled:opacity-60"
              >
                {addLoading ? 'Adding…' : 'Add Member'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name…"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-hospitalBlue focus:border-hospitalBlue"
          />
        </div>
        <select
          value={bloodFilter}
          onChange={(e) => setBloodFilter(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-hospitalBlue focus:border-hospitalBlue"
        >
          <option value="">All Blood Groups</option>
          {BLOOD_GROUPS.map((bg) => (
            <option key={bg} value={bg}>{bg}</option>
          ))}
        </select>
        <select
          value={availabilityFilter}
          onChange={(e) => setAvailabilityFilter(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-hospitalBlue focus:border-hospitalBlue"
        >
          <option value="all">All Status</option>
          <option value="available">Available</option>
          <option value="unavailable">Unavailable</option>
        </select>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <p className="text-gray-400 text-sm">
            {members.length === 0 ? 'No members added yet.' : 'No members match the current filters.'}
          </p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-hospitalBlue text-white text-left">
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Blood Group</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Last Donation</th>
                  <th className="px-4 py-3 font-semibold">Next Eligible</th>
                  <th className="px-4 py-3 font-semibold">Trust Score</th>
                  <th className="px-4 py-3 font-semibold">Rare</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{member.name}</p>
                      {member.phone && (
                        <p className="text-xs text-gray-400">{member.phone}</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-block bg-red-50 text-medicalRed text-xs font-bold px-2 py-1 rounded">
                        {member.bloodGroup}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {member.isAvailable ? (
                        <span className="inline-flex items-center gap-1 text-green-700 text-xs font-medium">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                          Available
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-gray-400 text-xs font-medium">
                          <span className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
                          Unavailable
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{formatDate(member.lastDonationDate)}</td>
                    <td className="px-4 py-3 text-gray-500">{formatDate(member.nextEligibleDate)}</td>
                    <td className="px-4 py-3 text-gray-600 font-medium">{member.trustScore ?? 0}</td>
                    <td className="px-4 py-3">
                      {member.isRare ? (
                        <span className="inline-block bg-amber-50 text-amber-700 text-xs font-bold px-2 py-0.5 rounded">
                          RARE
                        </span>
                      ) : (
                        <span className="text-gray-300 text-xs">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-400">
            Showing {filtered.length} of {members.length} members
          </div>
        </div>
      )}
    </div>
  );
};

export default MembersPage;
