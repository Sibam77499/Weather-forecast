import { motion } from 'framer-motion';
import { Droplets } from 'lucide-react';
import type { DailyData, TemperatureUnit } from '@/types/weather';
import { getWeatherInfo, formatTemp, formatDay } from '@/lib/weather-utils';

interface DailyForecastProps {
  data: DailyData;
  unit: TemperatureUnit;
}

export default function DailyForecast({ data, unit }: DailyForecastProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <h3 className="weather-text font-semibold text-lg mb-3">7-Day Forecast</h3>
      <div className="glass-card divide-y divide-white/10">
        {data.time.map((day, i) => {
          const info = getWeatherInfo(data.weatherCode[i]);
          const Icon = info.icon;
          const maxTemp = data.temperatureMax[i];
          const minTemp = data.temperatureMin[i];
          const range = maxTemp - minTemp;
          // For the bar visualization
          const allMax = Math.max(...data.temperatureMax);
          const allMin = Math.min(...data.temperatureMin);
          const totalRange = allMax - allMin || 1;
          const barLeft = ((minTemp - allMin) / totalRange) * 100;
          const barWidth = (range / totalRange) * 100;

          return (
            <div key={day} className="flex items-center gap-3 px-4 py-3">
              <span className="weather-text w-16 text-sm font-medium">{formatDay(day)}</span>
              <div className="flex items-center gap-1 w-12">
                <Droplets className="w-3 h-3 weather-text-muted" />
                <span className="text-xs weather-text-muted">{data.precipitationProbability[i]}%</span>
              </div>
              <Icon className="w-5 h-5 weather-text flex-shrink-0" />
              <span className="text-sm weather-text-muted w-10 text-right">{formatTemp(minTemp, unit)}</span>
              <div className="flex-1 h-1.5 rounded-full bg-white/10 relative mx-2">
                <div
                  className="absolute h-full rounded-full"
                  style={{
                    left: `${barLeft}%`,
                    width: `${Math.max(barWidth, 8)}%`,
                    background: 'linear-gradient(90deg, hsl(217, 91%, 60%), hsl(38, 92%, 50%))',
                  }}
                />
              </div>
              <span className="text-sm font-semibold weather-text w-10">{formatTemp(maxTemp, unit)}</span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
