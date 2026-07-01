'use client'
import React, { useEffect } from 'react'
import axios from 'axios'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks'
import { updateLocationDetails } from '@/features/venueCreateFeatureSlice'

interface InputProps {
    fieldName: string,
    dummyPlaceholder: string,
    type: string
}

function LocationSuggest({ fieldName, dummyPlaceholder, type }: InputProps) {
    const dispatch = useAppDispatch()
    const [query, setQuery] = React.useState("")
    const [suggestionPannel, setSuggestionPannel] = React.useState(false)
    const [suggestions, setSuggestions] = React.useState([])
    const { cityName, country, districtName, locationStreetAddress, stateName } = useAppSelector((state) => state.veneueCreation)
    const [isBrowsing, setIsBrowsing] = React.useState(true)

    const HandleSuggestionSelection = (selectedValue: string) => {

        setSuggestionPannel(!suggestionPannel)
        setIsBrowsing(false)
        try {
            dispatch(
                updateLocationDetails({ valueToBeSet: selectedValue, typeOfTheValue: type })
            )
            setQuery('')
        }
        catch (e) {

        }



    }

    useEffect(() => {
        if (query.trim().length < 3) {
            setSuggestions([])
            return;
        }

        const handleLocationFetching = setTimeout(
            async () => {
                try {
                    if (isBrowsing) {
                         setSuggestionPannel(true) 
                        axios.get(`https://api.geoapify.com/v1/geocode/autocomplete?text=${query}&limit=5&format=json&apiKey=${process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY}`)
                            .then((res) => {
                                console.log(res)
                                setSuggestions(res.data.results) // storing the geopify results
                            })
                            .catch((err) => {
                                console.error(err)
                            })
                    }
                }
                catch {
                    setSuggestionPannel(false)
                    console.log("some error occured, looking into it")
                }
            },
            400
        )

        return () => {
            clearTimeout(handleLocationFetching)
        }
    }, [query])


    return (
        <div className="flex flex-col gap-1.5 relative">
            <Label htmlFor="venueLoc" className="font-semibold text-xs text-foreground uppercase tracking-wide flex flex-col justify-start items-start">
                {fieldName} * <span className='text-primary'>{type == "streetAddress" ? locationStreetAddress : ''} {type == "city" ? cityName : ''} {type == "district" ? districtName : ''} {type == "state" ? stateName : ''} {type == "country" ? country : ''} </span>
            </Label>
            <Input
                id="inpField"
                placeholder={`e.g. ${dummyPlaceholder}`}
                value={query}
                onChange={(e) => {
                    setIsBrowsing(true)
                    setQuery(e.target.value)
                }}
           
            />
            {
                suggestionPannel ? (
                    <div className='border border-muted-foreground rounded-lg px-3 py-2 absolute top-[60] z-50 bg-background left-0 right-0 overflow-y-scroll no-scrollbar'>
                        {
                            suggestions.map((sug, idx) => {
                                return (
                                    <p key={idx} className='font-sans cursor-pointer hover:bg-secondary transition-colors' onClick={() => {
                                        HandleSuggestionSelection(sug.address_line1)
                                    }}>{sug.address_line1}</p>
                                )
                            })
                        }
                    </div>
                ) : (
                    <div></div>
                )
            }

        </div>
    )
}

export default LocationSuggest