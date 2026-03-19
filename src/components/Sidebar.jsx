import { NavLink } from 'react-router-dom';
import {
  FaRegChartBar,
  FaTint,
  FaNotesMedical,
  FaBell,
  FaMapMarkedAlt,
  FaBrain,
  FaUserShield,
  FaCog,
} from 'react-icons/fa';

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: FaRegChartBar },
  { label: 'Donors', path: '/donors', icon: FaTint },
  { label: 'Blood Requests', path: '/requests', icon: FaNotesMedical },
  { label: 'Notifications', path: '/notifications', icon: FaBell },
  { label: 'Live Map', path: '/map', icon: FaMapMarkedAlt },
  { label: 'Predictions', path: '/predictions', icon: FaBrain },
  { label: 'Admin', path: '/admin', icon: FaUserShield },
  { label: 'Settings', path: '/settings', icon: FaCog },
];

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-30 h-screen w-64 bg-white shadow-md p-5">
      <div className="px-3 py-4 text-2xl font-bold text-[#FF6B6B]">LifeLink</div>
      <nav className="mt-4 flex flex-col gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-2xl font-medium transition-colors ${
                isActive
                  ? 'bg-[#FF6B6B] text-white shadow-sm'
                  : 'text-slate-700 hover:bg-[#FF6B6B]/10 hover:text-[#FF6B6B]'
              }`
            }
          >
            <item.icon className="h-4 w-4" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
