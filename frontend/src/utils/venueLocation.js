import { formatVenueLocation } from "./venue";

const isValidCoordinate = (value) => {
  const num = Number(value);
  return Number.isFinite(num);
};

export const getVenueCoordinates = (venue) => {
  const latitude = venue?.location?.latitude;
  const longitude = venue?.location?.longitude;

  if (!isValidCoordinate(latitude) || !isValidCoordinate(longitude)) {
    return null;
  }

  return {
    latitude: Number(latitude),
    longitude: Number(longitude),
  };
};

export const hasVenueLocationData = (venue) => {
  if (getVenueCoordinates(venue)) return true;

  const address = venue?.address?.trim();
  const city = venue?.city?.trim();
  const state = venue?.state?.trim();

  return Boolean(address || city || state);
};

export const getVenueCityStateLabel = (venue) => {
  if (!venue) return "Location not specified";

  const parts = [venue.city, venue.state].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : "Location not specified";
};

/**
 * Multi-line address for display on venue details.
 */
export const getVenueAddressLines = (venue) => {
  const display = getVenueAddressDisplay(venue);
  return display.lines.map((line) => line.value);
};

/**
 * Structured address rows for venue details UI.
 */
export const getVenueAddressDisplay = (venue) => {
  if (!venue) {
    return { title: null, lines: [] };
  }

  const lines = [];

  if (venue.address?.trim()) {
    lines.push({
      key: "address",
      label: null,
      value: venue.address.trim(),
    });
  }

  if (venue.city?.trim()) {
    lines.push({
      key: "city",
      label: "City",
      value: venue.city.trim(),
    });
  }

  if (venue.state?.trim()) {
    lines.push({
      key: "state",
      label: "State",
      value: venue.state.trim(),
    });
  }

  if (venue.pincode?.trim()) {
    lines.push({
      key: "pincode",
      label: "Pincode",
      value: venue.pincode.trim(),
    });
  }

  return {
    title: venue.title?.trim() || null,
    lines,
  };
};

export const getVenueGoogleMapsUrl = (venue) => {
  const coords = getVenueCoordinates(venue);

  if (coords) {
    return `https://www.google.com/maps/search/?api=1&query=${coords.latitude},${coords.longitude}`;
  }

  const query = formatVenueLocation(venue);

  if (!query || query === "Location not specified") {
    return null;
  }

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
};

export const buildGeocodeQuery = ({ address, city, state, pincode }) =>
  [address, city, state, pincode, "India"]
    .filter((part) => part?.trim())
    .join(", ");
