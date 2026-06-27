// src/features/admin/AdminApp.jsx
import { useEffect } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setAdminCredentials, setAdminInitialized } from '../../redux/slices/adminAuthSlice.js'
import { selectAdminIsInitialized, selectAdminIsAuthenticated } from '../../redux/slices/adminAuthSlice.js'
import { useGetAdminMeQuery } from './api/adminApi.js'
import { PageLoader } from '../../components/ui/LoadingSkeleton'

const AdminApp = () => {
  const dispatch = useDispatch()
  const isInitialized = useSelector(selectAdminIsInitialized)
  const isAuthenticated = useSelector(selectAdminIsAuthenticated)

  console.log("hiii")

  const { data, isLoading, isError } = useGetAdminMeQuery(undefined, {
    skip: isAuthenticated
  })

  useEffect(() => {
    if (data?.data) dispatch(setAdminCredentials(data.data))
  }, [data])

  useEffect(() => {
    if (isError) dispatch(setAdminInitialized())
  }, [isError])

  if (!isInitialized || isLoading) return <PageLoader label="Loading admin panel..." />

  // If initialized but not authenticated, kick to admin login
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />

  return <Outlet />
}

export default AdminApp