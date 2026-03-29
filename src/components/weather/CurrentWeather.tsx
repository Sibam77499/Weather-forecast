import { motion } from 'framer-motion';
import { Droplets, Wind, Gauge, Sunrise, Sunset, Thermometer } from 'lucide-react';
import type { WeatherData, TemperatureUnit } from '@/types/weather';
import { getWeatherInfo, formatTemp, formatTime } from '@/lib/weather-utils';

interface CurrentWeatherProps {
  data: WeatherData;
  unit: TemperatureUnit;
}

export default function CurrentWeather({ data, unit }: CurrentWeatherProps) {
  const { current, location, daily } = data;
  const weatherInfo = getWeatherInfo(current.weatherCode, current.isDay);
  const Icon = weatherInfo.icon;

  const details = [
    { icon: Thermometer, label: 'Feels Like', value: formatTemp(current.apparentTemperature, unit) },
    { icon: Droplets, label: 'Humidity', value: `${current.humidity}%` },
    { icon: Wind, label: 'Wind', value: `${Math.round(current.windSpeed)} km/h` },
    { icon: Gauge, label: 'Pressure', value: `${Math.round(current.pressure)} hPa` },
    { icon: Sunrise, label: 'Sunrise', value: formatTime(daily.sunrise[0]) },
    { icon: Sunset, label: 'Sunset', value: formatTime(daily.sunset[0]) },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring' }}
        className="mb-2"
      >
        <p className="weather-text-muted text-lg font-medium">
          {location.name}{location.country ? `, ${location.country}` : ''}
        </p>
      </motion.div>

      <div className="flex items-center justify-center gap-4 mb-2">
        <Icon className="w-16 h-16 md:w-20 md:h-20 weather-text animate-float" />
        <span className="text-7xl md:text-8xl font-bold weather-text tracking-tight">
          {formatTemp(current.temperature, unit)}
        </span>
      </div>

      <p className="weather-text text-xl font-medium mb-1">{weatherInfo.label}</p>
      <p className="weather-text-muted text-sm mb-8">
        H: {formatTemp(daily.temperatureMax[0], unit)} &nbsp; L: {formatTemp(daily.temperatureMin[0], unit)}
      </p>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {details.map((d, i) => (
          <motion.div
            key={d.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.05 }}
            className="glass-card p-3 flex flex-col items-center gap-1"
          >
            <d.icon className="w-4 h-4 weather-text-muted" />
            <span className="text-xs weather-text-muted">{d.label}</span>
            <span className="text-sm font-semibold weather-text">{d.value}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
