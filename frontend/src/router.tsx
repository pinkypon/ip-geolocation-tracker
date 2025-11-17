// src/router.tsx
import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/Register";
import HomePage from "./pages/Home";
import AuthGuard from "./guard/AuthGuard";
import GuestGuard from "./guard/GuestGuard";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Route - Landing page */}
      <Route
        path="/home"
        element={
          <AuthGuard>
            <HomePage />
          </AuthGuard>
        }
      />

      {/* Public Route - Login */}
      <Route
        path="/login"
        element={
          <GuestGuard>
            <LoginPage />
          </GuestGuard>
        }
      />

      {/* Public Route - Login */}
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  );
}
