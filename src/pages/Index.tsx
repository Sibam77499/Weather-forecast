import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ToggleLeft, ToggleRight, AlertCircle, Sun, Moon } from 'lucide-react';
import type { WeatherData, GeoLocation, FavoriteCity, TemperatureUnit, WeatherTheme } from '@/types/weather';
import { fetchWeather, fetchAirQuality, reverseGeocode, type AQIResponse } from '@/lib/weather-api';
import { getWeatherInfo } from '@/lib/weather-utils';
import SearchBar from '@/components/weather/SearchBar';
import CurrentWeather from '@/components/weather/CurrentWeather';
import HourlyForecast from '@/components/weather/HourlyForecast';
import DailyForecast from '@/components/weather/DailyForecast';
import FavoriteCities from '@/components/weather/FavoriteCities';
import WeatherBackground from '@/components/weather/WeatherBackground';
import WeatherMap from '@/components/weather/WeatherMap';
import AirQuality from '@/components/weather/AirQuality';
import TemperatureChart from '@/components/weather/TemperatureChart';
import WeatherAlerts from '@/components/weather/WeatherAlerts';

function useLocalStorage<T>(key: string, initial: T): [T, (v: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initial;
    } catch { return initial; }
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
}

export default function Index() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [aqi, setAqi] = useState<AQIResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unit, setUnit] = useLocalStorage<TemperatureUnit>('weather-unit', 'celsius');
  const [recentSearches, setRecentSearches] = useLocalStorage<GeoLocation[]>('weather-recent', []);
  const [favorites, setFavorites] = useLocalStorage<FavoriteCity[]>('weather-favorites', []);
  const [theme, setTheme] = useState<WeatherTheme>('default');
  const [darkMode, setDarkMode] = useLocalStorage<boolean>('weather-dark', false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const loadWeather = useCallback(async (lat: number, lon: number, name?: string, country?: string) => {
    setLoading(true);
    setError(null);
    try {
      const [data, aqiData] = await Promise.all([
        fetchWeather(lat, lon, name, country),
        fetchAirQuality(lat, lon).catch(() => null),
      ]);
      setWeather(data);
      setAqi(aqiData);
      const info = getWeatherInfo(data.current.weatherCode, data.current.isDay);
      setTheme(info.theme);
    } catch {
      setError('Failed to fetch weather data. Please try again.');
    }
    setLoading(false);
  }, []);

  const handleSelectCity = useCallback((city: GeoLocation) => {
    loadWeather(city.latitude, city.longitude, city.name, city.country);
    setRecentSearches((prev: GeoLocation[]) => {
      const filtered = prev.filter(c => !(c.latitude === city.latitude && c.longitude === city.longitude));
      return [city, ...filtered].slice(0, 10);
    });
  }, [loadWeather, setRecentSearches]);

  const handleGetLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const geo = await reverseGeocode(latitude, longitude);
          await loadWeather(latitude, longitude, geo.name, geo.country);
        } catch {
          await loadWeather(latitude, longitude);
        }
      },
      () => {
        setError('Location access denied. Please search for a city instead.');
        setLoading(false);
      },
      { timeout: 10000 }
    );
  }, [loadWeather]);

  const handleToggleFavorite = useCallback((city: FavoriteCity) => {
    setFavorites((prev: FavoriteCity[]) => {
      const exists = prev.some(f => f.latitude === city.latitude && f.longitude === city.longitude);
      if (exists) return prev.filter(f => !(f.latitude === city.latitude && f.longitude === city.longitude));
      return [...prev, city];
    });
  }, [setFavorites]);

  useEffect(() => {
    if (!weather) handleGetLocation();
  }, []);

  const toggleUnit = () => setUnit((prev: TemperatureUnit) => prev === 'celsius' ? 'fahrenheit' : 'celsius');

  return (
    <WeatherBackground theme={theme}>
      <div className="min-h-screen px-4 py-6 md:py-10">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold weather-text">Weather</h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDarkMode((prev: boolean) => !prev)}
                className="glass-card p-2 hover:bg-white/20 transition-colors"
                title="Toggle dark mode"
              >
                {darkMode ? <Sun className="w-4 h-4 weather-text" /> : <Moon className="w-4 h-4 weather-text" />}
              </button>
              <button
                onClick={toggleUnit}
                className="glass-card px-3 py-1.5 flex items-center gap-2 hover:bg-white/20 transition-colors"
              >
                <span className={`text-sm font-semibold ${unit === 'celsius' ? 'weather-text' : 'weather-text-muted'}`}>°C</span>
                {unit === 'celsius' ? (
                  <ToggleLeft className="w-5 h-5 weather-text" />
                ) : (
                  <ToggleRight className="w-5 h-5 weather-text" />
                )}
                <span className={`text-sm font-semibold ${unit === 'fahrenheit' ? 'weather-text' : 'weather-text-muted'}`}>°F</span>
              </button>
            </div>
          </div>

          {/* Search */}
          <SearchBar
            onSelectCity={handleSelectCity}
            recentSearches={recentSearches}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onGetLocation={handleGetLocation}
          />

          {/* Favorite Cities */}
          <FavoriteCities
            favorites={favorites}
            onSelect={(city) => loadWeather(city.latitude, city.longitude, city.name, city.country)}
            onRemove={(city) => handleToggleFavorite(city)}
          />

          {/* Loading */}
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20"
              >
                <Loader2 className="w-10 h-10 weather-text animate-spin" />
                <p className="weather-text-muted mt-3 text-sm">Fetching weather data...</p>
              </motion.div>
            )}

            {/* Error */}
            {!loading && error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="glass-card-strong p-6 text-center"
              >
                <AlertCircle className="w-10 h-10 weather-text-muted mx-auto mb-3" />
                <p className="weather-text">{error}</p>
              </motion.div>
            )}

            {/* Weather Data */}
            {!loading && !error && weather && (
              <motion.div
                key="weather"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <WeatherAlerts data={weather} unit={unit} />
                <CurrentWeather data={weather} unit={unit} />
                <HourlyForecast data={weather.hourly} unit={unit} />
                <TemperatureChart data={weather.hourly} unit={unit} />
                <DailyForecast data={weather.daily} unit={unit} />
                {aqi && <AirQuality data={aqi} />}
                <WeatherMap
                  latitude={weather.location.latitude}
                  longitude={weather.location.longitude}
                  cityName={weather.location.name}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </WeatherBackground>
  );
}
