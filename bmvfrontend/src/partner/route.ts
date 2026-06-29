import { apiFetch } from "../lib/api"



export const MyVenue = async () => {
    return apiFetch<any>("/venues/my-venue")
}

export const Status = async (venueId: string) => {
    return apiFetch<any>(`/venues/${venueId}/onboarding-status`);
}