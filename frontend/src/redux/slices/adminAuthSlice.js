import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  admin: null,
  adminIsAuthenticated: false,
  adminIsInitialized: false,
}

const adminAuthSlice = createSlice({
  name: 'adminAuth',
  initialState,
  reducers: {
    setAdminCredentials: (state, action) => {
      state.admin = action.payload
      state.adminIsAuthenticated = true
      state.adminIsInitialized = true
    },
    setAdminInitialized: (state) => {
      state.adminIsInitialized = true   // fixed — was state.isInitialized
    },
    adminLogout: (state) => {
      state.admin = null
      state.adminIsAuthenticated = false  // removed the comma
      state.adminIsInitialized = true
    },
  },
})

export const { setAdminCredentials, adminLogout, setAdminInitialized } = adminAuthSlice.actions  // fixed
export default adminAuthSlice.reducer

export const selectCurrentAdmin = (state) => state.adminAuth.admin
export const selectAdminIsAuthenticated = (state) => state.adminAuth.adminIsAuthenticated  // renamed
export const selectAdminIsInitialized = (state) => state.adminAuth.adminIsInitialized      // added
export const selectAdminRole = (state) => state.adminAuth.admin?.role