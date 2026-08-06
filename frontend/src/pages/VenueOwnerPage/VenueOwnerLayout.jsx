import { Outlet } from "react-router-dom";
import VenueOwnerSidebar from "../../components/venueOwner/VenueOwnerSidebar.jsx";

// Shared chrome for venue-owner routes that show the navbar (e.g. /venue-owner/dashboard).
// The login route is rendered outside this layout.
export function VenueOwnerLayout() {
  return (
    <div className="min-h-screen flex bg-white">
      <VenueOwnerSidebar />

      <main className="ml-64 flex-1 p-8">
        <div className="max-w-7xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}