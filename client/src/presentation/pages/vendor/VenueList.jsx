import React from "react";
import VendorSidebar from "@/presentation/components/vendor/VendorSidebar";
import VendorNavbar from "@/presentation/components/vendor/VendorNavbar";

import VenueHeader from "@/presentation/components/vendor/VenueHeader";
import VenueFilters from "@/presentation/components/vendor/VenueFilters";
import VenueGrid from "@/presentation/components/vendor/VenueGrid";

const VenueList = () => {
  return (
    <div className="flex bg-slate-100 min-h-screen">

      <VendorSidebar />

      <div className="flex-1">

        <VendorNavbar />

        <main className="p-6">

          <VenueHeader />

          <VenueFilters />

          <p className="my-6 font-medium">
            6 venues found
          </p>

          <VenueGrid />

        </main>

      </div>

    </div>
  );
};

export default VenueList;