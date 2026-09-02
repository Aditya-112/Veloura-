import { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Wardrobe from "./pages/Wardrobe";
import Upload from "./pages/Upload";
import Outfits from "./pages/Outfits";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import { WardrobeProvider } from "./context/WardrobeContext";

const ROUTE_TITLE_MAP: Record<string, string> = {
  "/dashboard": "Veloura — Dashboard",
  "/wardrobe": "Veloura — Wardrobe",
  "/upload": "Veloura — Upload",
  "/outfits": "Veloura — AI Outfits",
  "/profile": "Veloura — Profile",
  "/login": "Veloura — Sign In",
  "/signup": "Veloura — Create Account",
};

function DynamicDocumentTitle() {
  const location = useLocation();

  useEffect(() => {
    const title = ROUTE_TITLE_MAP[location.pathname] || "Veloura — AI Digital Wardrobe";
    document.title = title;
  }, [location.pathname]);

  return null;
}

function App() {
  return (
    <WardrobeProvider>
      <DynamicDocumentTitle />
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Main Application Pages */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/wardrobe"
          element={
            <ProtectedRoute>
              <Wardrobe />
            </ProtectedRoute>
          }
        />
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <Upload />
            </ProtectedRoute>
          }
        />
        <Route
          path="/outfits"
          element={
            <ProtectedRoute>
              <Outfits />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* 404 Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </WardrobeProvider>
  );
}

export default App;