function formatPhotonName(properties: Record<string, string | undefined>): string {
    const parts = [
        properties.name,
        properties.street,
        properties.city,
        properties.state,
        properties.country,
    ].filter(Boolean);

    return [...new Set(parts)].join(", ");
}

export async function getLocationFromQuery(query: string): Promise<{ lng: number, lat: number, name: string }[] | null> {
    try {
        const res = await fetch(
            `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}`
        );

        const data = await res.json();
        const results = [];

        for (const result of data.features ?? []) {
            results.push({
                lng: result.geometry.coordinates[0],
                lat: result.geometry.coordinates[1],
                name: formatPhotonName(result.properties ?? {}),
            });
        }

        return results;
    } catch (error) {
        console.error(error);
        return null;
    }
}
