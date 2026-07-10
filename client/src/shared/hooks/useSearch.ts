import { useEffect, useState } from "react";
import { useDebounce } from "./useDebounce";
import type { SearchSuggestion } from "../components/ui/Search/types";


interface UseSearchProps {
    query: string;
    latitude?: number;
    longitude?: number;
    fetchSuggestions: (
        query: string,
        latitude?: number,
        longitude?: number
    ) => Promise<SearchSuggestion[]>;
}

export function useSearch({
    query,
    latitude,
    longitude,
    fetchSuggestions
}: UseSearchProps){
    const debouncedQuery = useDebounce(query,300);

    const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);

    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        if(!debouncedQuery.trim() && (latitude === undefined || longitude === undefined)){
            setSuggestions([]);
            return ;
        }

        const search = async () => {
            try {
                setLoading(true);
                const results = await fetchSuggestions(debouncedQuery, latitude, longitude);

                setSuggestions(results);
            } catch (error) {
                console.error(error);
                setSuggestions([]);
            }finally{
                setLoading(false)
            }
        }
        search();
    }, [debouncedQuery, fetchSuggestions, latitude, longitude]);

    return {
        suggestions,
        loading
    }
}