import BrowseVenue from "../features/user/browseVenue";
import MainLayout from "../layouts/MainLayout";
import AuthGuard from "../guards/Authguard";
import OwnerLayout from "../layouts/OwnerLayout";
import OwnerDashboard from "../features/owner/dashboard";
import OwnerVenues from "../features/owner/venues";
import OwnerBookings from "../features/owner/bookings";
import OwnerSettings from "../features/owner/settings";
import OwnerAddVenue from "../features/owner/addVenue";
import OwnerVenueDetails from "../features/owner/venueDetails";
import VenueDetails from "../features/user/VenueDetails";
import PaymentVerify from "../features/user/PaymentVerify";
import MyBookings from "../features/user/MyBookings";
import Favorites from "../features/user/Favorites";
import MessagesPage from "../pages/MessagesPage";
import RoleBasedLayout from "../layouts/RoleBasedLayout";
import { isChatEnabled } from "../config/featureFlags";

const chatRoutes = isChatEnabled
  ? [
      {
        element: <AuthGuard allowedRoles={['user', 'owner']} />,
        children: [
          {
            element: <RoleBasedLayout />,
            children: [{ path: '/messages', element: <MessagesPage /> }],
          },
        ],
      },
    ]
  : [];

export const protectedRoutes = [
  ...chatRoutes,
  {
    element: <AuthGuard allowedRoles={['user']} />,
    children: [
      {
        path: "/", element: <MainLayout />, children: [
          { path: "/browse-venues", element: <BrowseVenue/> },
          { path: "/my-bookings", element: <MyBookings /> },
          { path: '/venue/:venueId', element: <VenueDetails/> },
          { path: '/payments/verify', element: <PaymentVerify /> },
          { path: '/favorites', element: <Favorites /> },
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
          { path: "/owner/venues/:venueId", element: <OwnerVenueDetails /> },
          { path: "/owner/bookings", element: <OwnerBookings /> },
          { path: "/owner/settings", element: <OwnerSettings /> },
          { path: "/owner/add-venue", element: <OwnerAddVenue /> },
        ]
      }
    ]
  }
]
