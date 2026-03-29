import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icon
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function MapUpdater({ lat, lon }: { lat: number; lon: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lon], 10, { animate: true });
  }, [lat, lon, map]);
  return null;
}

interface WeatherMapProps {
  latitude: number;
  longitude: number;
  cityName: string;
}

export default function WeatherMap({ latitude, longitude, cityName }: WeatherMapProps) {
  return (
    <div>
      <h3 className="weather-text font-semibold text-lg mb-3">Location</h3>
      <div className="glass-card overflow-hidden rounded-2xl" style={{ height: 220 }}>
        <MapContainer
          center={[latitude, longitude]}
          zoom={10}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
          attributionControl={false}
        >
          <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
          <Marker position={[latitude, longitude]} icon={icon} />
          <MapUpdater lat={latitude} lon={longitude} />
        </MapContainer>
      </div>
    </div>
  );
}
