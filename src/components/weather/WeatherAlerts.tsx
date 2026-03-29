import { motion } from 'framer-motion';
import { AlertTriangle, CloudRain, Thermometer, CloudLightning, Wind } from 'lucide-react';
import type { WeatherData, TemperatureUnit } from '@/types/weather';
import { formatTemp } from '@/lib/weather-utils';

interface WeatherAlertsProps {
  data: WeatherData;
  unit: TemperatureUnit;
}

interface Alert {
  icon: typeof AlertTriangle;
  title: string;
  description: string;
  severity: 'warning' | 'danger' | 'info';
}

function generateAlerts(data: WeatherData, unit: TemperatureUnit): Alert[] {
  const alerts: Alert[] = [];
  const { current, daily } = data;

  // Thunderstorm alert
  if ([95, 96, 99].includes(current.weatherCode)) {
    alerts.push({
      icon: CloudLightning,
      title: 'Thunderstorm Warning',
      description: 'Active thunderstorm in the area. Seek shelter and avoid open spaces.',
      severity: 'danger',
    });
  }

  // Heavy rain alert
  if ([65, 67, 82].includes(current.weatherCode)) {
    alerts.push({
      icon: CloudRain,
      title: 'Heavy Rain Alert',
      description: 'Heavy rainfall expected. Watch for flooding in low-lying areas.',
      severity: 'warning',
    });
  }

  // Extreme heat
  if (current.temperature > 38) {
    alerts.push({
      icon: Thermometer,
      title: 'Extreme Heat Warning',
      description: `Temperature is ${formatTemp(current.temperature, unit)}. Stay hydrated and avoid prolonged sun exposure.`,
      severity: 'danger',
    });
  } else if (current.temperature > 33) {
    alerts.push({
      icon: Thermometer,
      title: 'Heat Advisory',
      description: `High temperature of ${formatTemp(current.temperature, unit)}. Take precautions when outdoors.`,
      severity: 'warning',
    });
  }

  // Extreme cold
  if (current.temperature < -15) {
    alerts.push({
      icon: Thermometer,
      title: 'Extreme Cold Warning',
      description: `Temperature is ${formatTemp(current.temperature, unit)}. Limit time outdoors and dress warmly.`,
      severity: 'danger',
    });
  } else if (current.temperature < -5) {
    alerts.push({
      icon: Thermometer,
      title: 'Cold Weather Advisory',
      description: `Low temperature of ${formatTemp(current.temperature, unit)}. Bundle up and watch for ice.`,
      severity: 'warning',
    });
  }

  // High wind
  if (current.windSpeed > 60) {
    alerts.push({
      icon: Wind,
      title: 'High Wind Warning',
      description: `Wind speeds of ${Math.round(current.windSpeed)} km/h. Secure loose objects outdoors.`,
      severity: 'danger',
    });
  } else if (current.windSpeed > 40) {
    alerts.push({
      icon: Wind,
      title: 'Wind Advisory',
      description: `Gusty winds of ${Math.round(current.windSpeed)} km/h expected.`,
      severity: 'warning',
    });
  }

  // Upcoming rain in forecast
  const upcomingRainDays = daily.precipitationProbability
    .slice(1, 3)
    .filter(p => p > 70);
  if (upcomingRainDays.length > 0 && ![61, 63, 65, 80, 81, 82].includes(current.weatherCode)) {
    alerts.push({
      icon: CloudRain,
      title: 'Rain Expected',
      description: 'High chance of rain in the coming days. Keep an umbrella handy.',
      severity: 'info',
    });
  }

  return alerts;
}

const severityStyles: Record<string, string> = {
  danger: 'border-red-500/40 bg-red-500/10',
  warning: 'border-amber-500/40 bg-amber-500/10',
  info: 'border-blue-400/40 bg-blue-400/10',
};

const severityIconColor: Record<string, string> = {
  danger: 'text-red-400',
  warning: 'text-amber-400',
  info: 'text-blue-400',
};

export default function WeatherAlerts({ data, unit }: WeatherAlertsProps) {
  const alerts = generateAlerts(data, unit);
  if (alerts.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className="space-y-2"
    >
      <h3 className="weather-text font-semibold text-lg mb-3">⚠️ Weather Alerts</h3>
      {alerts.map((alert, i) => (
        <motion.div
          key={alert.title}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 + i * 0.1 }}
          className={`rounded-2xl border p-4 flex items-start gap-3 ${severityStyles[alert.severity]}`}
        >
          <alert.icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${severityIconColor[alert.severity]}`} />
          <div>
            <p className="weather-text font-semibold text-sm">{alert.title}</p>
            <p className="weather-text-muted text-sm mt-0.5">{alert.description}</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
