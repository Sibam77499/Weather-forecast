import type { WeatherTheme } from '@/types/weather';
import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, CloudDrizzle, CloudFog, CloudSun, Moon, CloudMoon } from 'lucide-react';

interface WeatherInfo {
  label: string;
  icon: typeof Sun;
  theme: WeatherTheme;
}

const WMO_CODES: Record<number, WeatherInfo> = {
  0: { label: 'Clear Sky', icon: Sun, theme: 'sunny' },
  1: { label: 'Mainly Clear', icon: CloudSun, theme: 'sunny' },
  2: { label: 'Partly Cloudy', icon: CloudSun, theme: 'cloudy' },
  3: { label: 'Overcast', icon: Cloud, theme: 'cloudy' },
  45: { label: 'Foggy', icon: CloudFog, theme: 'cloudy' },
  48: { label: 'Rime Fog', icon: CloudFog, theme: 'cloudy' },
  51: { label: 'Light Drizzle', icon: CloudDrizzle, theme: 'rainy' },
  53: { label: 'Drizzle', icon: CloudDrizzle, theme: 'rainy' },
  55: { label: 'Dense Drizzle', icon: CloudDrizzle, theme: 'rainy' },
  61: { label: 'Light Rain', icon: CloudRain, theme: 'rainy' },
  63: { label: 'Rain', icon: CloudRain, theme: 'rainy' },
  65: { label: 'Heavy Rain', icon: CloudRain, theme: 'rainy' },
  66: { label: 'Freezing Rain', icon: CloudRain, theme: 'rainy' },
  67: { label: 'Heavy Freezing Rain', icon: CloudRain, theme: 'rainy' },
  71: { label: 'Light Snow', icon: CloudSnow, theme: 'snowy' },
  73: { label: 'Snow', icon: CloudSnow, theme: 'snowy' },
  75: { label: 'Heavy Snow', icon: CloudSnow, theme: 'snowy' },
  77: { label: 'Snow Grains', icon: CloudSnow, theme: 'snowy' },
  80: { label: 'Light Showers', icon: CloudRain, theme: 'rainy' },
  81: { label: 'Showers', icon: CloudRain, theme: 'rainy' },
  82: { label: 'Heavy Showers', icon: CloudRain, theme: 'rainy' },
  85: { label: 'Snow Showers', icon: CloudSnow, theme: 'snowy' },
  86: { label: 'Heavy Snow Showers', icon: CloudSnow, theme: 'snowy' },
  95: { label: 'Thunderstorm', icon: CloudLightning, theme: 'stormy' },
  96: { label: 'Thunderstorm + Hail', icon: CloudLightning, theme: 'stormy' },
  99: { label: 'Thunderstorm + Heavy Hail', icon: CloudLightning, theme: 'stormy' },
};

export function getWeatherInfo(code: number, isDay: boolean = true): WeatherInfo {
  const info = WMO_CODES[code] || { label: 'Unknown', icon: Cloud, theme: 'default' as WeatherTheme };
  if (!isDay && (code <= 1)) {
    return { ...info, icon: Moon, theme: 'night' };
  }
  if (!isDay && code === 2) {
    return { ...info, icon: CloudMoon, theme: 'night' };
  }
  if (!isDay) {
    return { ...info, theme: 'night' };
  }
  return info;
}

export function getWeatherGradient(theme: WeatherTheme): string {
  const gradients: Record<WeatherTheme, string> = {
    sunny: 'linear-gradient(135deg, #f59e0b, #ea580c, #dc2626)',
    cloudy: 'linear-gradient(135deg, #6b7280, #9ca3af, #d1d5db)',
    rainy: 'linear-gradient(135deg, #1e3a5f, #2563eb, #3b82f6)',
    snowy: 'linear-gradient(135deg, #bfdbfe, #dbeafe, #e0e7ff)',
    night: 'linear-gradient(135deg, #0f172a, #1e1b4b, #312e81)',
    stormy: 'linear-gradient(135deg, #1f2937, #374151, #1e293b)',
    default: 'linear-gradient(135deg, #3b82f6, #6366f1, #8b5cf6)',
  };
  return gradients[theme];
}

export function celsiusToFahrenheit(c: number): number {
  return Math.round((c * 9) / 5 + 32);
}

export function formatTemp(temp: number, unit: 'celsius' | 'fahrenheit'): string {
  const value = unit === 'fahrenheit' ? celsiusToFahrenheit(temp) : Math.round(temp);
  return `${value}°`;
}

export function formatTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function formatDay(isoString: string): string {
  const date = new Date(isoString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
  return date.toLocaleDateString([], { weekday: 'short' });
}
