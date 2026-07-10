import { useEffect, useState } from "react";
import { useDebounce } from "./useDebounce";
import type { SearchSuggestion } from "../components/ui/Search/types";


interface UseSearchProps {
    query: string;

    fetchSuggestions: (
        query: string
    ) => Promise<SearchSuggestion[]>;
}

export function useSearch({
    query,
    fetchSuggestions
}: UseSearchProps){
    const debouncedQuery = useDebounce(query,300);

    const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);

    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        if(!debouncedQuery.trim()){
            setSuggestions([]);
            return ;
        }

        const search = async () => {
            try {
                setLoading(true);
                const results = await fetchSuggestions(debouncedQuery);

                setSuggestions(results);
            } catch (error) {
                console.error(error);
                setSuggestions([]);
            }finally{
                setLoading(false)
            }
        }
        search();
    }, [debouncedQuery, fetchSuggestions]);

    return {
        suggestions,
        loading
    }
}