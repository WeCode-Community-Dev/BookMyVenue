import { createContext, useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import OwnerSidebar from "./OwnerSidebar";
import OwnerTopbar from "./OwnerTopbar";
import {
  fetchDashboardSummaryAsync,
  fetchNotificationsAsync,
} from "../../modules/venueOwner/venueOwnerSlice";

const OwnerLayoutContext = createContext(null);

export function useOwnerLayout() {
  return useContext(OwnerLayoutContext);
}

function OwnerLayout({ children }) {
  const dispatch = useDispatch();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchDashboardSummaryAsync());
    dispatch(fetchNotificationsAsync());
  }, [dispatch]);

  return (
    <OwnerLayoutContext.Provider value={{ mobileNavOpen, setMobileNavOpen }}>
      <div className="flex min-h-screen bg-gray-50">
        <OwnerSidebar />
        <div className="flex-1 min-w-0">
          <OwnerTopbar />
          <main className="px-4 sm:px-6 py-6 max-w-[1400px] mx-auto">{children}</main>
        </div>
      </div>
    </OwnerLayoutContext.Provider>
  );
}

export default OwnerLayout;
