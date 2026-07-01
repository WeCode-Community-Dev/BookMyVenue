import { useSelector, useDispatch } from "react-redux";
import { logoutUserAsync } from "../modules/auth/authSlice";

function DashboardPage() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const { isAuthenticated } = useSelector((state) => state.auth);
  console.log("Current auth state:", { user, isAuthenticated });

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4 text-gray-700">
      <h1 className="text-xl font-bold">Dashboard</h1>
      <p className="text-sm text-gray-500">
        {user?.name ? `Welcome, ${user.name}.` : "You're logged in."}
      </p>
      <button
        onClick={() => dispatch(logoutUserAsync())}
        className="text-sm text-rose-700 hover:underline"
      >
        Logout
      </button>
    </div>
  );
}

export default DashboardPage;