import { NavLink, Outlet } from "react-router-dom";
import MainLayout from "../../common/MainLayout";

const OwnerLayout = () => {
   return (
      <MainLayout>
         <div className="max-w-7xl mx-auto px-5 py-10 mt-20">

            <div className="mb-8">

               <h1 className="text-3xl font-bold">
                  Owner Portal
               </h1>

            </div>

            <div className="flex gap-3 mb-8">

               <NavLink
                  to="/owner"
                  end
                  className={({ isActive }) =>
                     isActive
                        ? "btn-primary"
                        : "btn-outline"
                  }
               >
                  Dashboard
               </NavLink>

               <NavLink
                  to="/owner/venues"
                  className={({ isActive }) =>
                     isActive
                        ? "btn-primary"
                        : "btn-outline"
                  }
               >
                  My Venues
               </NavLink>

               <NavLink
                  to="/owner/bookings"
                  className={({ isActive }) =>
                     isActive
                        ? "btn-primary"
                        : "btn-outline"
                  }
               >
                  Bookings
               </NavLink>

            </div>

            <Outlet />

         </div>
      </MainLayout>
   );
};

export default OwnerLayout;