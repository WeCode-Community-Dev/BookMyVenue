import { ROLES } from "@/constants/Roles";
import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom";


const HomeRoute = ({children}) => {

    const { loading, user, isAuthenticated} = useSelector((state) => state.auth)

    if (loading) {
        return (
            <div className='flex h-screen items-center justify-content'>
            <div className='h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-amber-600'></div>
            </div>
        );
    }

    if(!isAuthenticated){
        return children
    }

    if(user.role === ROLES.ADMIN){
        return <Navigate to='/admin/dashboard' replace />
    }

    if(user.role === ROLES.VENDOR){
        return <Navigate to='/vendor/dashboard' replace />
    }
  
    return children
}

export default HomeRoute
