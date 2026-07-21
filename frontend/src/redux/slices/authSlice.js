import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
  isAuthenticated: false,
   isInitialized: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload
      state.isAuthenticated = true
       state.isInitialized = true
    },
     setInitialized: (state) => {
    state.isInitialized = true  // auth resolved but not authenticated
  },
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false,
       state.isInitialized = true 
    },
  },
})

export const { setCredentials, logout,setInitialized } = authSlice.actions
export default authSlice.reducer

// selectors
export const selectCurrentUser = (state) => state.auth.user
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated
export const selectUserRole = (state) => state.auth.user?.role