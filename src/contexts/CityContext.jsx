import { createContext, useContext, useMemo, useState } from 'react';

export const MAHARASHTRA_CITIES = ['Nagpur', 'Pune', 'Mumbai', 'Nashik', 'Aurangabad'];

const CITY_STORAGE_KEY = 'lifelinkSelectedCity';

const CityContext = createContext(null);

export function CityProvider({ children }) {
  const [selectedCity, setSelectedCityState] = useState(() => localStorage.getItem(CITY_STORAGE_KEY) || '');

  const setSelectedCity = (city) => {
    setSelectedCityState(city);
    if (city) {
      localStorage.setItem(CITY_STORAGE_KEY, city);
    } else {
      localStorage.removeItem(CITY_STORAGE_KEY);
    }
  };

  const value = useMemo(
    () => ({
      selectedCity,
      setSelectedCity,
      supportedCities: MAHARASHTRA_CITIES,
    }),
    [selectedCity]
  );

  return <CityContext.Provider value={value}>{children}</CityContext.Provider>;
}

export function useCity() {
  const context = useContext(CityContext);
  if (!context) {
    throw new Error('useCity must be used inside CityProvider');
  }
  return context;
}
