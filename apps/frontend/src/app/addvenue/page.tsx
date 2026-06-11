"use client";
import BasicInformationForm from "@/components/global/basicinfo";
import CapacityPricingForm from "@/components/global/capacityandpricing";
import VenueHeader from "@/components/global/venueheader";
import AmmenitiesForm from "@/components/global/ammenities";
import PhotosUploadForm from "@/components/global/photoupload";
import VenueFormActions from "@/components/global/actionbuttons";
import LocationForm from "@/components/global/locationform";
import VenueApprovalModal from "@/components/global/verifybooking";
import { useState } from "react";

const page = () => {
    const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="ml-6 mt-2">
      <VenueApprovalModal  open={isOpen}
        onClose={() => setIsOpen(false)}/>
      <VenueHeader />

      <form>
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          {/* Left */}
          <div>
            <BasicInformationForm />
            <CapacityPricingForm />
            <AmmenitiesForm />
            <PhotosUploadForm />
           
          </div>

          {/* Right */}
         
          <LocationForm/>
        </div>
         <VenueFormActions />
      </form>
    </div>
  );
};

export default page;
