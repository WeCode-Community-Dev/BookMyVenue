import { Mail } from "lucide-react";
import OwnerLayout from "../components/VenueOwnerDashboard/OwnerLayout";
import EmptyState from "../components/shared/EmptyState";

function OwnerMessagesPage() {
  return (
    <OwnerLayout>
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Messages</h2>
          <p className="text-sm text-gray-400 mt-0.5">Direct messages with customers</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm">
          <EmptyState
            icon={Mail}
            title="Messaging coming soon"
            description="You'll be able to chat with customers about their bookings here."
          />
        </div>
      </div>
    </OwnerLayout>
  );
}

export default OwnerMessagesPage;
