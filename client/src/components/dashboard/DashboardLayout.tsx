import React, { useState } from "react";
import type { ReactNode } from "react";

import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50/60 font-sans text-slate-900 selection:bg-indigo-500 selection:text-white">
      {/* Sidebar */}
      <Sidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Layout Area */}
      <div className="flex flex-1 flex-col lg:pl-72 min-w-0 transition-all duration-300">
        <TopNavbar onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;