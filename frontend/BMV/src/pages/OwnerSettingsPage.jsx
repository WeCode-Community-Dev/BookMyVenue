import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Settings, User } from "lucide-react";
import OwnerLayout from "../components/VenueOwnerDashboard/OwnerLayout";

function OwnerSettingsPage() {
  const { user } = useSelector((state) => state.auth);

  return (
    <OwnerLayout>
      <div className="space-y-4 max-w-2xl">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Settings</h2>
          <p className="text-sm text-gray-400 mt-0.5">Manage your owner account</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-900 flex items-center justify-center">
              <User size={22} />
            </div>
            <div>
              <p className="font-semibold text-gray-900">{user?.name || "Owner"}</p>
              <p className="text-sm text-gray-400">{user?.email}</p>
            </div>
          </div>

          <Link
            to="/profile"
            className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-rose-200 hover:bg-rose-50/50 transition-colors"
          >
            <Settings size={18} className="text-rose-700" />
            <div>
              <p className="text-sm font-medium text-gray-800">Edit profile</p>
              <p className="text-xs text-gray-400">Update name, phone, and password</p>
            </div>
          </Link>

          <div className="p-4 rounded-xl bg-gray-50 text-sm text-gray-500">
            Payout settings and notification preferences will be available in a future update.
          </div>
        </div>
      </div>
    </OwnerLayout>
  );
}

export default OwnerSettingsPage;
