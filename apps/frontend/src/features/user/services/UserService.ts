const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getUserBookings(): Promise<any[]> {
    const url = `${BASE_URL}/user/my-bookings`;
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch bookings: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error in getUserBookings:", error);
        throw error;
    }
}

export async function upgradeToVenueOwner(): Promise<void> {
    const url = `${BASE_URL}/user/upgrade-to-owner`;
    try {
        const response = await fetch(url, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error(`Failed to upgrade to venue owner: ${response.statusText}`);
        }
    } catch (error) {
        console.error("Error in upgradeToVenueOwner:", error);
        throw error;
    }
}

export async function getUserVenues(): Promise<any[]> {
    const url = `${BASE_URL}/user/my-venues`;
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch user venues: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error in getUserVenues:", error);
        throw error;
    }
}
