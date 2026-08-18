import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/auth.store.js";
import { LoadingScreen } from "./LoadingScreen.jsx";

export const PublicOnlyRoute = ({ children }) => {
  const isLoading = useAuthStore((state) => state.isLoading);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isAuthenticated) {
    return <Navigate to="/profile" replace />;
  }

  return children;
};