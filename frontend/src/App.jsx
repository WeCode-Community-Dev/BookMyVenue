import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setCredentials, setInitialized } from './redux/slices/authSlice'
import { selectIsAuthenticated } from './redux/slices/authSlice'
import { useGetMeQuery } from '../src/features/auth/authApi.js'
import { PageLoader } from './components/ui/LoadingSkeleton'

const App = () => {
  const dispatch = useDispatch()
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const { data: user, isLoading,isError } = useGetMeQuery(undefined, {
    skip: isAuthenticated
  })
  console.log("APP - isAuthenticated:", isAuthenticated, "user:", user, "isLoading:", isLoading)
  useEffect(() => {
    if (user?.data) dispatch(setCredentials(user.data))
  }, [user])

   useEffect(() => {
    if (isError) {
      dispatch(setInitialized()) 
    }
  }, [isError])

  if (isLoading) return <PageLoader label="Loading BookMyVenue..." />

  return <Outlet />
}

export default App