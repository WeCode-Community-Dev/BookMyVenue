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
