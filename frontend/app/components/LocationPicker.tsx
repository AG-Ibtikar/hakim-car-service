'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface LocationPickerProps {
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void;
  onClose: () => void;
}

const LocationPicker = ({ onLocationSelect, onClose }: LocationPickerProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [geocoder, setGeocoder] = useState<google.maps.Geocoder | null>(null);

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
        version: 'weekly',
        libraries: ['places'],
      });

      try {
        const google = await loader.load();
        const geocoder = new google.maps.Geocoder();
        setGeocoder(geocoder);

        if (mapRef.current) {
          const map = new google.maps.Map(mapRef.current, {
            center: { lat: 30.0444, lng: 31.2357 }, // Default to Cairo
            zoom: 13,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
          });

          setMap(map);

          // Add click listener to map
          map.addListener('click', async (e: google.maps.MapMouseEvent) => {
            if (e.latLng && geocoder) {
              const lat = e.latLng.lat();
              const lng = e.latLng.lng();

              // Update marker position
              if (marker) {
                marker.setPosition(e.latLng);
              } else {
                const newMarker = new google.maps.Marker({
                  position: e.latLng,
                  map,
                  animation: google.maps.Animation.DROP,
                });
                setMarker(newMarker);
              }

              // Get address from coordinates
              try {
                const response = await geocoder.geocode({
                  location: { lat, lng },
                });

                if (response.results[0]) {
                  onLocationSelect({
                    lat,
                    lng,
                    address: response.results[0].formatted_address,
                  });
                }
              } catch (error) {
                console.error('Geocoding error:', error);
              }
            }
          });
        }
      } catch (error) {
        console.error('Error loading Google Maps:', error);
      }
    };

    initMap();
  }, [onLocationSelect]);

  return (
    <div className="h-full">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
};

export default LocationPicker; 