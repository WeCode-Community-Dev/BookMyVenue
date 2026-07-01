import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

interface categoriesProp {
    id: string,
    name: string,
    icon_name: string,
}
interface amenityProp {
    id: string,
    name: string,
    icon_name: string,
}

// Fetch props
interface fetchCategoryProps {
    requestUrl: string
}
interface fetchAmenityProps {
    requestUrl: string
}

export const getAllCategories = createAsyncThunk<any, fetchCategoryProps>(
    "categories/all",
    async ({ requestUrl }, { rejectWithValue }) => {
        try {
            console.log("entered into the category function")
            const response = await axios.get(
                requestUrl,
            )
            console.log(response)
            return response.data
        }
        catch (error) {
            return rejectWithValue(error);
        }
    }
)
export const getAllAmenities = createAsyncThunk<any, fetchAmenityProps>(
    "amenities/all",
    async ({ requestUrl }, { rejectWithValue }) => {
        try {
            console.log("amenities function")
            const response = await axios.get(
                requestUrl,
            )
            console.log(response)
            return response.data
        }
        catch (error) {
            return rejectWithValue(error);
        }
    }
)


export const venueCreateFeatureslice = createSlice({
    name: "fileFolders",
    initialState: {
        categories: [] as categoriesProp[],
        amenities: [] as amenityProp[],
        initialLoading: false,
        locationStreetAddress: 'kazhakoottam',
        cityName: 'Thiruvananthapuram',
        districtName: 'thiruvananthapuram',
        stateName: 'Kerala',
        country: 'India',
    },
    // Reducers are the methods used to update the states.
    reducers: {
        updateLocationDetails: (state, action) => {
            const { valueToBeSet, typeOfTheValue } = action.payload

            if (typeOfTheValue === "streetAddress") {
                state.locationStreetAddress = valueToBeSet
                console.log("updated the state value", typeOfTheValue)
                console.log(state.locationStreetAddress)
            }
            else if (typeOfTheValue === "city") {
                state.cityName = valueToBeSet
                console.log("updated the state value", typeOfTheValue)
                console.log(state.cityName)

            }
            else if (typeOfTheValue === "district") {
                state.districtName = valueToBeSet
                console.log("updated the state value", typeOfTheValue)
                console.log(state.districtName)

            }
            else if (typeOfTheValue === "state") {
                state.stateName = valueToBeSet
                console.log("updated the state value", typeOfTheValue)
                console.log(state.stateName)

            } else if (typeOfTheValue === "country") {
                state.country = valueToBeSet
                console.log("updated the state value", typeOfTheValue)
                console.log(state.country)

            }
        },
        discardAllLocationDetails : (state) => {
            state.locationStreetAddress = ''
            state.cityName = ''
            state.districtName = ''
            state.stateName = ''
            state.country = ''
        }
    },
    extraReducers(builder) {
        builder
            .addCase(getAllCategories.pending, (state, action) => {
                state.initialLoading = true
                state.categories = []
            })
            .addCase(getAllAmenities.pending, (state, action) => {
                state.initialLoading = true
                state.amenities = []
            })
            .addCase(getAllCategories.fulfilled, (state, action) => {
                const res = action.payload
                const responce_data = res.data
                const uniqueNewItems = responce_data.filter(
                    (newCat: categoriesProp) => !state.categories.some((item) => item.id === newCat.id)
                );
                state.categories = [...state.categories, ...uniqueNewItems];

                state.initialLoading = false
            })
            .addCase(getAllAmenities.fulfilled, (state, action) => {
                const res = action.payload
                const responce_data = res.data
                const uniqueNewItems = responce_data.filter(
                    (newAmenity: amenityProp) => !state.amenities.some((item) => item.id === newAmenity.id)
                );
                state.amenities = [...state.amenities, ...uniqueNewItems];

                state.initialLoading = false
            })
    },


})

export const { updateLocationDetails, discardAllLocationDetails } = venueCreateFeatureslice.actions
export default venueCreateFeatureslice.reducer; 