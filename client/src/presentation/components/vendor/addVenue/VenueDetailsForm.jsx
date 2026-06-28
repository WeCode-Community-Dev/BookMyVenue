import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const VenueDetailsForm = () => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">

      <h2 className="text-xl font-semibold mb-6">
        Venue Information
      </h2>

      <div className="grid grid-cols-2 gap-6">

        <div>
          <label>Venue Name</label>
          <Input placeholder="Enter venue name" />
        </div>

        <div>
          <label>Category</label>
          <Input placeholder="Banquet Hall" />
        </div>

        <div>
          <label>Location</label>
          <Input placeholder="City" />
        </div>

        <div>
          <label>Capacity</label>
          <Input placeholder="500" />
        </div>

      </div>

      <div className="mt-6">
        <label>Description</label>

        <Textarea
          rows={5}
          placeholder="Describe your venue..."
        />
      </div>

    </div>
  );
};

export default VenueDetailsForm;