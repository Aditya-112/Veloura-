import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loader2 } from "lucide-react";
import logo from "../assets/Logo.png";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div 
        className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900 flex flex-col items-center justify-center font-sans antialiased animate-in fade-in duration-300 select-none"
        role="status"
        aria-live="polite"
        aria-label="Personalizing your experience"
      >
        {/* HUGE Ultra-Subtle Watermark "V" Monogram Background */}
        <div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden"
          aria-hidden="true"
        >
          <span className="text-[38vw] font-serif font-black text-indigo-900/[0.025] leading-none transform -translate-y-4 filter blur-[1px]">
            V
          </span>
        </div>

        {/* Ambient Soft Glow Behind Content */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none z-0"
          aria-hidden="true"
        />

        {/* Centered Premium Editorial Content Box */}
        <div className="relative z-10 mx-4 flex flex-col items-center text-center max-w-sm w-full space-y-6">
          {/* Logo & Brand Name */}
          <div className="flex flex-col items-center space-y-3">
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-white p-3 shadow-soft border border-slate-100">
              <img src={logo} alt="Veloura Logo" className="h-full w-full object-contain" />
            </div>

            <div className="space-y-1">
              <h1 className="text-xl sm:text-2xl font-serif font-extrabold tracking-[0.25em] text-slate-900 uppercase">
                Veloura
              </h1>
              <p className="text-[10px] sm:text-[11px] font-semibold tracking-[0.22em] text-slate-400 uppercase">
                Your style, intelligently curated
              </p>
            </div>
          </div>

          {/* Minimalist Divider */}
          <div className="h-px w-12 bg-slate-200/80 my-2" />

          {/* Loading Spinner & Status Text */}
          <div className="flex flex-col items-center space-y-2">
            <Loader2 className="h-5 w-5 animate-spin text-indigo-600 shrink-0" />

            <div className="flex flex-col items-center space-y-0.5 pt-1">
              <span className="text-xs font-semibold text-slate-700 tracking-wide">
                Personalizing your experience...
              </span>
              <span className="text-[11px] font-medium text-slate-400">
                Securing your session
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;