export interface GeoSearchResult {
  displayName: string;
  lat: number;
  lng: number;
  city?: string;
  district?: string;
  postcode?: string;
  boundingbox?: [number, number, number, number]; // [south, north, west, east]
}

export interface Coordinates {
  lat: number | string;
  lng: number | string;
}

export interface VenuePinsBBox {
  swLng: number;
  swLat: number;
  neLng: number;
  neLat: number;
}
