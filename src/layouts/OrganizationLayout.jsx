import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { FiUsers, FiActivity, FiBell, FiLogOut, FiHome, FiMapPin, FiPlus } from 'react-icons/fi';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { io } from 'socket.io-client';

const navItems = [
  { to: '/org', label: 'Dashboard', icon: FiHome, end: true },
  { to: '/org/volunteers', label: 'Volunteers', icon: FiUsers },
  { to: '/org/requests', label: 'Blood Requests', icon: FiPlus },
  { to: '/org/nearby-donors', label: 'Nearby Donors', icon: FiMapPin },
  { to: '/org/invite', label: 'Invite Volunteers', icon: FiActivity },
  { to: '/org/settings', label: 'Settings', icon: FiBell },
];

const socketUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default function OrganizationLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    const socket = io(socketUrl, { transports: ['websocket', 'polling'] });

    socket.on('connect', () => {
      toast.success('Connected to alerts');
    });

    socket.on('newBloodRequest', (data) => {
      toast(`New blood request: ${data?.bloodGroup || ''} in ${data?.city || ''}`);
    });

    socket.on('volunteerJoined', () => {
      toast.success('A volunteer joined your organization');
    });

    socket.on('donorMatched', (data) => {
      toast(`Nearby donor matched: ${data?.name || 'Donor'}`);
    });

    socket.on('disconnect', () => {
      toast.error('Disconnected from alerts');
    });

    return () => socket.disconnect();
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col">
        <div className="px-6 py-5 border-b border-slate-100">
          <p className="text-xs uppercase tracking-wide text-slate-400">LifeLink</p>
          <h1 className="text-xl font-bold text-[#f43f5e]">Organization</h1>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                  isActive ? 'bg-[#f43f5e]/10 text-[#f43f5e]' : 'text-slate-600 hover:bg-slate-100'
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-slate-100">
          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-slate-100 text-slate-700 py-2 font-semibold hover:bg-slate-200"
          >
            <FiLogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-slate-200 px-4 lg:px-8 py-3 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">Welcome back</p>
            <h2 className="text-lg font-semibold text-slate-900">Organization Head</h2>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200" aria-label="Notifications">
              <FiBell className="h-5 w-5" />
            </button>
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#f43f5e] to-[#fb7185] text-white flex items-center justify-center font-bold">
              O
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 lg:px-8 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
