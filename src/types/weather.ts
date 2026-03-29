export interface GeoLocation {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
}

export interface CurrentWeather {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  windSpeed: number;
  pressure: number;
  weatherCode: number;
  isDay: boolean;
}

export interface HourlyData {
  time: string[];
  temperature: number[];
  weatherCode: number[];
  humidity: number[];
}

export interface DailyData {
  time: string[];
  weatherCode: number[];
  temperatureMax: number[];
  temperatureMin: number[];
  sunrise: string[];
  sunset: string[];
  precipitationProbability: number[];
}

export interface WeatherData {
  current: CurrentWeather;
  hourly: HourlyData;
  daily: DailyData;
  location: GeoLocation;
}

export interface FavoriteCity {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
}

export type TemperatureUnit = 'celsius' | 'fahrenheit';

export type WeatherTheme = 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'night' | 'stormy' | 'default';
