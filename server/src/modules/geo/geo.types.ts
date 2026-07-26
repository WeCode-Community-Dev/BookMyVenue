export interface GeoSearchResult {
  displayName: string;
  lat: number;
  lng: number;
  city?: string;
  district?: string;
  postcode?: string;
  boundingbox?: [number, number, number, number]; // [south, north, west, east]
}

export interface NominatimAddress {
  city?: string;
  town?: string;
  village?: string;
  state_district?: string;
  county?: string;
  state?: string;
  postcode?: string;
}

export interface NominatimResponse {
  display_name: string;
  lat: string;
  lon: string;
  address: NominatimAddress;
  boundingbox: [string, string, string, string];
}
