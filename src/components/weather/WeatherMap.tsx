import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const markerIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface WeatherMapProps {
  latitude: number;
  longitude: number;
  cityName: string;
}

export default function WeatherMap({ latitude, longitude, cityName }: WeatherMapProps) {
  const mapElementRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!mapElementRef.current || mapInstanceRef.current) return;

    const map = L.map(mapElementRef.current, {
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(map);

    markerRef.current = L.marker([latitude, longitude], { icon: markerIcon })
      .addTo(map)
      .bindPopup(cityName);

    map.setView([latitude, longitude], 10);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    map.setView([latitude, longitude], map.getZoom(), { animate: true });

    if (markerRef.current) {
      markerRef.current.setLatLng([latitude, longitude]);
      markerRef.current.setPopupContent(cityName);
    }
  }, [latitude, longitude, cityName]);

  return (
    <div>
      <h3 className="weather-text font-semibold text-lg mb-3">Location</h3>
      <div className="glass-card overflow-hidden rounded-2xl h-[220px]">
        <div ref={mapElementRef} className="h-full w-full" aria-label={`Map showing ${cityName}`} />
      </div>
    </div>
  );
}
