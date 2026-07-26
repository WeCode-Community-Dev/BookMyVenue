import { useState, useCallback } from 'react';

interface GeolocationCoordinates {
  lat: number;
  lng: number;
}

interface UseGeolocationReturn {
  coordinates: GeolocationCoordinates | null;
  loading: boolean;
  error: string | null;
  getCurrentLocation: () => Promise<void>;
}

export function useGeolocation(): UseGeolocationReturn {
  const [coordinates, setCoordinates] = useState<GeolocationCoordinates | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCurrentLocation = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLoading(false);
      },
      (geoError) => {
        let errorMessage = 'Failed to get your location';
        if (geoError.code === geoError.PERMISSION_DENIED) {
          errorMessage =
            'Location permission denied. Please enable location access in browser settings.';
        } else if (geoError.code === geoError.POSITION_UNAVAILABLE) {
          errorMessage = 'Location information is unavailable.';
        } else if (geoError.code === geoError.TIMEOUT) {
          errorMessage = 'The request to get user location timed out.';
        }
        setError(errorMessage);
        setLoading(false);
      },
      {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  }, []);

  return {
    coordinates,
    loading,
    error,
    getCurrentLocation,
  };
}
