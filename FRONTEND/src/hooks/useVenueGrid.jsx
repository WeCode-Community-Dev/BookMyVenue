import { useState, useEffect } from "react"
import apiService from "../services/apiService"


export const useVenueGrid = (searchParams) => { 
    const [venues, setVenues] = useState([])
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchVenues = async () => {
            setIsLoading(true);
            setError(null);
            
            try{
                const cleanParams = Object.fromEntries(
                    Object.entries(searchParams).filter(([_, value]) => value !== '' && value !== null)
                );

                let data;
                if (Object.keys(cleanParams).length > 0) {
                    data = await apiService.SearchVenues(cleanParams);
                } else {
                    data = await apiService.getAllVenues();
                }

                setVenues(data)

            } catch(err) { 
                console.error("Something Went Wrong!", err.response?.data)
                const errorMessage = 
                    err.response?.data?.detail || 
                    err.response?.data?.message || 
                    "Failed to load spaces.";

                setError(new Error(errorMessage));

            } finally {
                setIsLoading(false)
            }
        }

        fetchVenues()
    }, [searchParams])

    return {
        venues, error, isLoading
    }
}