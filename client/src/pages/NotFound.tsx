import React from "react";
import { Link } from "react-router-dom";
import { Sparkle, ArrowLeft } from "lucide-react";

const NotFound: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-indigo-100 text-indigo-600 mb-6 shadow-glow">
        <Sparkle className="h-8 w-8 animate-spin" style={{ animationDuration: "12s" }} />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">404 - Page Not Found</h1>
      <p className="mt-2 text-sm text-slate-500 max-w-sm">
        The page you are looking for doesn't exist or has been moved within your digital wardrobe.
      </p>
      <Link
        to="/dashboard"
        className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-indigo-700 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Return to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;