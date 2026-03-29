import { motion } from 'framer-motion';
import type { HourlyData, TemperatureUnit } from '@/types/weather';
import { getWeatherInfo, formatTemp } from '@/lib/weather-utils';

interface HourlyForecastProps {
  data: HourlyData;
  unit: TemperatureUnit;
}

export default function HourlyForecast({ data, unit }: HourlyForecastProps) {
  const now = new Date();
  const currentHour = now.getHours();
  // Show next 24 hours starting from current hour
  const startIndex = data.time.findIndex(t => new Date(t).getHours() === currentHour && new Date(t).getDate() === now.getDate());
  const start = startIndex >= 0 ? startIndex : 0;
  const hours = data.time.slice(start, start + 24);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <h3 className="weather-text font-semibold text-lg mb-3">Hourly Forecast</h3>
      <div className="glass-card p-4 overflow-x-auto scrollbar-hide">
        <div className="flex gap-4" style={{ minWidth: 'max-content' }}>
          {hours.map((time, i) => {
            const idx = start + i;
            const info = getWeatherInfo(data.weatherCode[idx]);
            const Icon = info.icon;
            const hour = new Date(time);
            const label = i === 0 ? 'Now' : hour.toLocaleTimeString([], { hour: '2-digit', hour12: true });

            return (
              <div key={time} className="flex flex-col items-center gap-2 min-w-[60px]">
                <span className="text-xs weather-text-muted">{label}</span>
                <Icon className="w-6 h-6 weather-text" />
                <span className="text-sm font-semibold weather-text">
                  {formatTemp(data.temperature[idx], unit)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
