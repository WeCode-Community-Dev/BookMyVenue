import api from "./axios";

export const getVenueAvailability = async (venueId) => {
  const { data } = await api.get(`/availability/${venueId}`);
  return data;
};

export const createAvailability = async (payload) => {
  const { data } = await api.post("/availability/create", payload);
  return data;
};

export const deactivateAvailability = async (slotId) => {
  const { data } = await api.patch(`/availability/deactivate/${slotId}`);
  return data;
};

export const activateAvailability = async (slotId) => {
  const { data } = await api.patch(`/availability/activate/${slotId}`);
  return data;
};
