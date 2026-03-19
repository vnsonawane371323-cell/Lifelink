import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCity } from '../contexts/CityContext';
import { FaUserCircle } from 'react-icons/fa';

export default function Navbar() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { selectedCity } = useCity();

  const onLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="bg-white shadow-md rounded-2xl px-6 py-4 flex items-center justify-between">
      <div>
        <p className="text-xl font-semibold text-[#FF6B6B]">LifeLink</p>
        <p className="text-sm text-slate-500">Medical Operations Dashboard {selectedCity ? `- ${selectedCity}` : ''}</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2 text-slate-600">
          <FaUserCircle className="h-6 w-6 text-[#FF6B6B]" />
          <span className="text-sm">{user?.name || 'Healthcare User'}</span>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="rounded-xl bg-[#FF6B6B] px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
