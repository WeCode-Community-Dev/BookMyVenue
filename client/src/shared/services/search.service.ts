import type { SearchSuggestion } from "../components/ui/Search/types";

export const searchService = {
    async getVenueSuggestions(
        query: string
    ): Promise<SearchSuggestion[]> {

         const venues: SearchSuggestion[] = [
            {
                id: "1",
                label: "Royal Palace",
                subtitle: "Kayamkulam"
            },
            {
                id: "2",
                label: "Grand Convention Hall",
                subtitle: "Kochi"
            },
            {
                id: "3",
                label: "Green Valley Auditorium",
                subtitle: "Alappuzha"
            }
        ];

        return venues.filter((venue)=>
            venue.label
                .toLowerCase()
                .includes(query.toLowerCase())
        )
    }
}