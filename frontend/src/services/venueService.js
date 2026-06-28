import api from "./axios";

export const getAllVenues = async () => {
  const { data } = await api.get("/venues");
  return data;
};

export const getPublicVenueById = async (venueId) => {
  const { data } = await api.get(`/venues/${venueId}`);
  return data;
};

export const getMyVenues = async () => {
  const { data } = await api.get("/venues/my-venues");
  return data;
};

export const activateVenue = async (venueId) => {
  const { data } = await api.patch(`/venues/activate/${venueId}`);
  return data;
};

export const deactivateVenue = async (venueId) => {
  const { data } = await api.patch(`/venues/deactivate/${venueId}`);
  return data;
};

export const createVenue = async (formData) => {
  const { data } = await api.post("/venues/create", formData);
  return data;
};

export const getProviderVenueById = async (venueId) => {
  const { data } = await api.get(`/venues/provider/${venueId}`);
  return data;
};

export const updateVenue = async (venueId, formData) => {
  const { data } = await api.put(`/venues/update/${venueId}`, formData);
  return data;
};
