import { useState, useCallback } from 'react';
import { axiosInstance } from '@/config/axios';
import { API_ENDPOINTS } from '@/constants';

export interface VenuePin {
  _id: string;
  name: string;
  location: {
    coordinates: [number, number]; // [lng, lat]
  };
  coverImage: string;
  avgRating: number;
}

interface BBox {
  swLng: number;
  swLat: number;
  neLng: number;
  neLat: number;
}

interface UseVenuePinsReturn {
  pins: VenuePin[];
  loading: boolean;
  error: string | null;
  fetchPins: (bbox: BBox) => Promise<void>;
}

export function useVenuePins(): UseVenuePinsReturn {
  const [pins, setPins] = useState<VenuePin[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPins = useCallback(async (bbox: BBox) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        swLng: bbox.swLng.toString(),
        swLat: bbox.swLat.toString(),
        neLng: bbox.neLng.toString(),
        neLat: bbox.neLat.toString(),
      });

      const response = await axiosInstance.get(`${API_ENDPOINTS.VENUE_PINS}?${params}`);

      setPins(response.data?.data || []);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch venue pins';
      setError(errorMsg);
      console.error('useVenuePins error:', errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    pins,
    loading,
    error,
    fetchPins,
  };
}
