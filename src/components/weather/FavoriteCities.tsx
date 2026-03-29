import { Star, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { FavoriteCity } from '@/types/weather';

interface FavoriteCitiesProps {
  favorites: FavoriteCity[];
  onSelect: (city: FavoriteCity) => void;
  onRemove: (city: FavoriteCity) => void;
}

export default function FavoriteCities({ favorites, onSelect, onRemove }: FavoriteCitiesProps) {
  if (favorites.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-wrap gap-2 justify-center"
    >
      <AnimatePresence>
        {favorites.map((city) => (
          <motion.button
            key={`${city.latitude}-${city.longitude}`}
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => onSelect(city)}
            className="glass-card px-3 py-1.5 flex items-center gap-1.5 hover:bg-white/20 transition-colors group"
          >
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="weather-text text-sm">{city.name}</span>
            <button
              onClick={(e) => { e.stopPropagation(); onRemove(city); }}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3 weather-text-muted" />
            </button>
          </motion.button>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
