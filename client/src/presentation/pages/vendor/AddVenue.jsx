import VendorSidebar from "@/presentation/components/vendor/VendorSidebar";
import VendorNavbar from "@/presentation/components/vendor/VendorNavbar";

import AddVenueHeader from "@/presentation/components/vendor/addVenue/AddVenueHeader";
import StepIndicator from "@/presentation/components/vendor/addVenue/StepIndicator";
import VenueDetailsForm from "@/presentation/components/vendor/addVenue/VenueDetailsForm";
import FormActions from "@/presentation/components/vendor/addVenue/FormActions";

const AddVenue = () => {
  return (
    <div className="flex bg-slate-50 min-h-screen">
      <VendorSidebar />

      <div className="flex-1">
        <VendorNavbar />

        <main className="p-6">
          <AddVenueHeader />

          <StepIndicator currentStep={1} />

          <VenueDetailsForm />

          <FormActions />
        </main>
      </div>
    </div>
  );
};

export default AddVenue;