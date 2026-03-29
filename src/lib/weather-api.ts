import type { GeoLocation, WeatherData } from '@/types/weather';

const GEO_API = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_API = 'https://api.open-meteo.com/v1/forecast';

export async function searchCities(query: string): Promise<GeoLocation[]> {
  if (!query || query.length < 2) return [];
  const res = await fetch(`${GEO_API}?name=${encodeURIComponent(query)}&count=5&language=en`);
  if (!res.ok) throw new Error('Failed to search cities');
  const data = await res.json();
  return (data.results || []).map((r: any) => ({
    name: r.name,
    latitude: r.latitude,
    longitude: r.longitude,
    country: r.country,
    admin1: r.admin1,
  }));
}

export async function fetchWeather(lat: number, lon: number, locationName?: string, country?: string): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,surface_pressure,is_day',
    hourly: 'temperature_2m,weather_code,relative_humidity_2m',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max',
    timezone: 'auto',
    forecast_days: '7',
  });

  const res = await fetch(`${WEATHER_API}?${params}`);
  if (!res.ok) throw new Error('Failed to fetch weather data');
  const data = await res.json();

  return {
    current: {
      temperature: data.current.temperature_2m,
      apparentTemperature: data.current.apparent_temperature,
      humidity: data.current.relative_humidity_2m,
      windSpeed: data.current.wind_speed_10m,
      pressure: data.current.surface_pressure,
      weatherCode: data.current.weather_code,
      isDay: data.current.is_day === 1,
    },
    hourly: {
      time: data.hourly.time,
      temperature: data.hourly.temperature_2m,
      weatherCode: data.hourly.weather_code,
      humidity: data.hourly.relative_humidity_2m,
    },
    daily: {
      time: data.daily.time,
      weatherCode: data.daily.weather_code,
      temperatureMax: data.daily.temperature_2m_max,
      temperatureMin: data.daily.temperature_2m_min,
      sunrise: data.daily.sunrise,
      sunset: data.daily.sunset,
      precipitationProbability: data.daily.precipitation_probability_max,
    },
    location: {
      name: locationName || 'Current Location',
      latitude: lat,
      longitude: lon,
      country: country || '',
    },
  };
}

export async function reverseGeocode(lat: number, lon: number): Promise<{ name: string; country: string }> {
  // Open-Meteo doesn't have reverse geocoding, use a simple fallback
  const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&zoom=10`);
  if (!res.ok) return { name: 'Current Location', country: '' };
  const data = await res.json();
  return {
    name: data.address?.city || data.address?.town || data.address?.village || 'Current Location',
    country: data.address?.country || '',
  };
}
