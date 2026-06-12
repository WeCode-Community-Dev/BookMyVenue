import {venueRegistrationApi, fetchVenuesApi} from "../../venues/api/venue.api";

export const registerVenue = async (payload) => {
   return venueRegistrationApi(payload);
};

export const fetchVenues = async () => {
   return fetchVenuesApi();
};
