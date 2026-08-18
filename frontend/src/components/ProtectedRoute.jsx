import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "../store/auth.store.js";
import { LoadingScreen } from "./LoadingScreen.jsx";

export const ProtectedRoute = ({ children }) => {
  const isLoading = useAuthStore((state) => state.isLoading);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    useAuthStore.getState().checkAuth();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};