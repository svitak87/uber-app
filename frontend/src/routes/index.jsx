import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "../components/ProtectedRoute.jsx";
import { PublicOnlyRoute } from "../components/PublicOnlyRoute.jsx";
import { LoginPage } from "../pages/LoginPage.jsx";
import { ProfilePage } from "../pages/ProfilePage.jsx";

export const AppRoutes = () => (
  <Routes>
    <Route
      path="/login"
      element={
        <PublicOnlyRoute>
          <LoginPage />
        </PublicOnlyRoute>
      }
    />
    <Route
      path="/profile"
      element={
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      }
    />
    <Route
      path="*"
      element={
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      }
    />
  </Routes>
);