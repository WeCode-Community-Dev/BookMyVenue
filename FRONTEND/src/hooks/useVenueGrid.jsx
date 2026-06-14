import { useState, useEffect } from "react"

export const useVenueGrid = () => { 
    const [venues, setVenues] = useState([])
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchVenues = async () => {
            try{
            const BASE_URL = "https://unsaving-channing-sisterly.ngrok-free.dev"

            const response = await fetch(`${BASE_URL}/venues`)

            if(!response.ok){
                throw new Error("Failed to Fetch Venues from server!")
            }

            const data = await response.json()

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