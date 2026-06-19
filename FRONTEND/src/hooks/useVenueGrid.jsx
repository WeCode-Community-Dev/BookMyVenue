import { useState, useEffect } from "react"
import apiService from "../services/apiService"

export const useVenueGrid = () => { 
    const [venues, setVenues] = useState([])
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchVenues = async () => {
            try{
                const data = await apiService.getAllVenues()
                setVenues(data)

            } catch(err) { 
                console.error("Something Went Wrong!", err)
                setError(err)

            } finally {
                setIsLoading(false)
            }
        }

        fetchVenues()
    }, [])

    return {
        venues, error, isLoading
    }
}