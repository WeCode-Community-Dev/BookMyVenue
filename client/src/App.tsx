import { useEffect } from "react";
import AppRoutes from "./routes";
import { useAuthStore } from "@/store/store";
import { useAuthUser } from "@/hooks/use-auth";

const App = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const clearUser = useAuthStore((state) => state.clearUser);
  const setAuthLoading = useAuthStore((state) => state.setAuthLoading);

  const { data, isSuccess, isError, isLoading } = useAuthUser();

  useEffect(() => {
    if (isSuccess && data) setUser(data);
    if (isError) clearUser();
    if (!isLoading) setAuthLoading(false);
  }, [data, isSuccess, isError, isLoading, setUser, clearUser, setAuthLoading]);

  return (
    <div>
      <AppRoutes />
    </div>
  );
};

export default App;
