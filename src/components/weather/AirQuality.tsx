import { motion } from 'framer-motion';
import { Wind } from 'lucide-react';

interface AQIData {
  aqi: number;
  pm25: number;
  pm10: number;
}

interface AirQualityProps {
  data: AQIData;
}

function getAQILevel(aqi: number): { label: string; color: string; bg: string } {
  if (aqi <= 50) return { label: 'Good', color: 'text-green-400', bg: 'bg-green-400' };
  if (aqi <= 100) return { label: 'Moderate', color: 'text-yellow-400', bg: 'bg-yellow-400' };
  if (aqi <= 150) return { label: 'Unhealthy for Sensitive', color: 'text-orange-400', bg: 'bg-orange-400' };
  if (aqi <= 200) return { label: 'Unhealthy', color: 'text-red-400', bg: 'bg-red-400' };
  return { label: 'Hazardous', color: 'text-red-600', bg: 'bg-red-600' };
}

export default function AirQuality({ data }: AirQualityProps) {
  const level = getAQILevel(data.aqi);
  const pct = Math.min((data.aqi / 300) * 100, 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      <h3 className="weather-text font-semibold text-lg mb-3">Air Quality</h3>
      <div className="glass-card p-4">
        <div className="flex items-center gap-3 mb-3">
          <Wind className="w-5 h-5 weather-text" />
          <span className={`text-2xl font-bold ${level.color}`}>{data.aqi}</span>
          <span className={`text-sm font-medium ${level.color}`}>{level.label}</span>
        </div>
        <div className="h-2 rounded-full bg-white/10 mb-4">
          <div
            className={`h-full rounded-full ${level.bg} transition-all duration-500`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center">
            <span className="text-xs weather-text-muted block">PM2.5</span>
            <span className="text-sm font-semibold weather-text">{data.pm25} µg/m³</span>
          </div>
          <div className="text-center">
            <span className="text-xs weather-text-muted block">PM10</span>
            <span className="text-sm font-semibold weather-text">{data.pm10} µg/m³</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
