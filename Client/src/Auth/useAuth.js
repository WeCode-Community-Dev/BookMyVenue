import { useContext } from "react";
import { AuthContext } from "./AuthContext";

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      "useAuth must be used inside <AuthProvider>. Wrap your app with it.",
    );
  }
  return context;
};

export default useAuth;
