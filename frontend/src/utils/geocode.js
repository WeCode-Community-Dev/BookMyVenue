import { buildGeocodeQuery } from "./venueLocation";

const NOMINATIM_ENDPOINT = "https://nominatim.openstreetmap.org/search";

export const GEOCODE_ERROR = {
  MISSING_REQUIRED: "MISSING_REQUIRED",
  NOT_FOUND: "NOT_FOUND",
  SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE",
  NETWORK: "NETWORK",
};

export class GeocodeError extends Error {
  constructor(code) {
    super(code);
    this.name = "GeocodeError";
    this.code = code;
  }
};

export const hasRequiredGeocodeFields = (form) =>
  Boolean(
    form?.address?.trim() && form?.city?.trim() && form?.state?.trim()
  );

export const getGeocodeUserMessage = (code) => {
  switch (code) {
    case GEOCODE_ERROR.MISSING_REQUIRED:
      return "Please enter Address, City, and State before detecting the location.";
    case GEOCODE_ERROR.NOT_FOUND:
      return "Couldn't find this location. Please check the address and try again.";
    case GEOCODE_ERROR.SERVICE_UNAVAILABLE:
    case GEOCODE_ERROR.NETWORK:
      return "Unable to connect to the location service. Please try again later.";
    default:
      return "Couldn't find this location. Please check the address and try again.";
  }
};

/**
 * Geocode a venue address using OpenStreetMap Nominatim.
 * Returns { latitude, longitude } or null when no match is found.
 */
export const geocodeVenueAddress = async (form) => {
  if (!hasRequiredGeocodeFields(form)) {
    throw new GeocodeError(GEOCODE_ERROR.MISSING_REQUIRED);
  }

  const query = buildGeocodeQuery(form);

  let response;

  try {
    const url = new URL(NOMINATIM_ENDPOINT);
    url.searchParams.set("q", query);
    url.searchParams.set("format", "json");
    url.searchParams.set("limit", "1");
    url.searchParams.set("countrycodes", "in");

    response = await fetch(url.toString(), {
      headers: {
        Accept: "application/json",
      },
    });
  } catch {
    throw new GeocodeError(GEOCODE_ERROR.NETWORK);
  }

  if (!response.ok) {
    throw new GeocodeError(GEOCODE_ERROR.SERVICE_UNAVAILABLE);
  }

  let results;

  try {
    results = await response.json();
  } catch {
    throw new GeocodeError(GEOCODE_ERROR.SERVICE_UNAVAILABLE);
  }

  if (!Array.isArray(results) || results.length === 0) {
    return null;
  }

  const latitude = Number.parseFloat(results[0].lat);
  const longitude = Number.parseFloat(results[0].lon);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null;
  }

  return { latitude, longitude };
};
