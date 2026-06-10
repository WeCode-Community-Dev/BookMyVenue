import Home from "../features/BrowseVenues";
import MainLayout from "../layouts/MainLayout";
import AuthGuard from "../guards/Authguard";
import OwnerLayout from "../layouts/OwnerLayout";
import OwnerDashboard from "../features/owner/dashboard";
import OwnerVenues from "../features/owner/venues";
import OwnerBookings from "../features/owner/bookings";
import OwnerSettings from "../features/owner/settings";
import OwnerAddVenue from "../features/owner/addVenue";

export const protectedRoutes = [
  {
    element: <AuthGuard allowedRoles={['user']} />,
    children: [
      {
        path: "/", element: <MainLayout />, children: [
          { path: "/browse-venues", element: <p>browse venues</p> },
          { path: "/my-bookings", element: <p>my bookings</p> },
        ]
      }

    ]
  },
  {
    element: <AuthGuard allowedRoles={['owner']} />,
    children: [
      {
        path: "/",
        element: <OwnerLayout />,
        children: [
          { path: "/owner/dashboard", element: <OwnerDashboard /> },
          { path: "/owner/venues", element: <OwnerVenues /> },
          { path: "/owner/bookings", element: <OwnerBookings /> },
          { path: "/owner/settings", element: <OwnerSettings /> },
          { path: "/owner/add-venue", element: <OwnerAddVenue /> }
        ]
      }
    ]
  },
  {
    element: <AuthGuard allowedRoles={['admin']} />,
    children: [
      { path: "/admin/dashboard", element: <p>admin dashboard</p> },
    ]
  }
]