import { useState, useCallback, useRef } from 'react';
import { Search, MapPin, X, Star, Clock } from 'lucide-react';
import { searchCities } from '@/lib/weather-api';
import type { GeoLocation, FavoriteCity } from '@/types/weather';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchBarProps {
  onSelectCity: (city: GeoLocation) => void;
  recentSearches: GeoLocation[];
  favorites: FavoriteCity[];
  onToggleFavorite: (city: FavoriteCity) => void;
  onGetLocation: () => void;
}

export default function SearchBar({ onSelectCity, recentSearches, favorites, onToggleFavorite, onGetLocation }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeoLocation[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const handleSearch = useCallback((value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (value.length < 2) { setResults([]); return; }
    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const cities = await searchCities(value);
        setResults(cities);
      } catch { setResults([]); }
      setLoading(false);
    }, 300);
  }, []);

  const handleSelect = (city: GeoLocation) => {
    onSelectCity(city);
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  const isFavorite = (city: { name: string; latitude: number; longitude: number }) =>
    favorites.some(f => f.latitude === city.latitude && f.longitude === city.longitude);

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <div className="glass-card-strong flex items-center gap-2 px-4 py-3">
        <Search className="w-5 h-5 weather-text-muted flex-shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder="Search city..."
          className="bg-transparent weather-text placeholder:weather-text-muted flex-1 outline-none text-base"
        />
        {query && (
          <button onClick={() => { setQuery(''); setResults([]); }}>
            <X className="w-4 h-4 weather-text-muted" />
          </button>
        )}
        <button
          onClick={onGetLocation}
          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          title="Use my location"
        >
          <MapPin className="w-5 h-5 weather-text" />
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (results.length > 0 || recentSearches.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute top-full left-0 right-0 mt-2 glass-card-strong overflow-hidden z-50"
          >
            {loading && (
              <div className="px-4 py-3 weather-text-muted text-sm">Searching...</div>
            )}

            {results.length > 0 && results.map((city, i) => (
              <div
                key={`${city.latitude}-${city.longitude}`}
                className="flex items-center justify-between px-4 py-3 hover:bg-white/10 cursor-pointer transition-colors"
                onClick={() => handleSelect(city)}
              >
                <div>
                  <span className="weather-text font-medium">{city.name}</span>
                  <span className="weather-text-muted text-sm ml-2">{city.admin1 ? `${city.admin1}, ` : ''}{city.country}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite({ name: city.name, latitude: city.latitude, longitude: city.longitude, country: city.country });
                  }}
                  className="p-1"
                >
                  <Star className={`w-4 h-4 ${isFavorite(city) ? 'fill-yellow-400 text-yellow-400' : 'weather-text-muted'}`} />
                </button>
              </div>
            ))}

            {results.length === 0 && !loading && recentSearches.length > 0 && (
              <>
                <div className="px-4 py-2 weather-text-muted text-xs font-semibold uppercase tracking-wider">Recent</div>
                {recentSearches.slice(0, 5).map((city) => (
                  <div
                    key={`recent-${city.latitude}-${city.longitude}`}
                    className="flex items-center gap-2 px-4 py-3 hover:bg-white/10 cursor-pointer transition-colors"
                    onClick={() => handleSelect(city)}
                  >
                    <Clock className="w-4 h-4 weather-text-muted" />
                    <span className="weather-text">{city.name}, {city.country}</span>
                  </div>
                ))}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {isOpen && <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />}
    </div>
  );
}
