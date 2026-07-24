import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <div className="mt-6 flex gap-4">
      <Button
        type="button"
        onClick={() => navigate(ROUTES.VENDOR.ADD_VENUE)}
        className="bg-indigo-600 text-white hover:bg-indigo-700"
      >
        Add Venue
      </Button>

      <Button
        type="button"
        onClick={() => navigate(ROUTES.VENDOR.BOOKINGS)}
        className="bg-gray-200 text-gray-800 hover:bg-gray-300"
      >
        View Bookings
      </Button>
    </div>
  );
};

export default QuickActions;