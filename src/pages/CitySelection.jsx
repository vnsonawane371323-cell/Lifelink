import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { useCity } from '../contexts/CityContext';

export default function CitySelection() {
  const navigate = useNavigate();
  const { selectedCity, setSelectedCity, supportedCities } = useCity();
  const [city, setCity] = useState(selectedCity || '');

  const onContinue = () => {
    if (!city) return;
    setSelectedCity(city);
    navigate('/dashboard', { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#F9F9FB] px-4 py-8 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-md p-8">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-[#FF6B6B]/10 text-[#FF6B6B] flex items-center justify-center">
            <FaMapMarkerAlt />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#FF6B6B]">Select City</h1>
            <p className="text-sm text-slate-600 mt-1">Choose your Maharashtra city to load real donor, hospital, and society datasets.</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {supportedCities.map((option) => {
            const isActive = city === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => setCity(option)}
                className={`rounded-xl border px-4 py-3 text-left transition-colors ${
                  isActive
                    ? 'border-[#FF6B6B] bg-[#FF6B6B]/10 text-[#FF6B6B]'
                    : 'border-slate-200 text-slate-700 hover:border-[#FF6B6B]/40'
                }`}
              >
                <p className="font-semibold">{option}</p>
                <p className="text-xs mt-1 opacity-80">Maharashtra</p>
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onContinue}
            disabled={!city}
            className="rounded-xl bg-[#FF6B6B] px-6 py-2.5 text-white font-semibold disabled:opacity-60"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
