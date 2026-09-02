import React from "react";
import {
  LayoutDashboard,
  Shirt,
  Upload,
  Sparkles,
  User,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/Logo.png";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen = false, onClose }) => {
  const { logout } = useAuth();

  const menuItems = [
    {
      name: "Home",
      path: "/dashboard",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      name: "Wardrobe",
      path: "/wardrobe",
      icon: Shirt,
      badge: null,
    },
    {
      name: "Upload",
      path: "/upload",
      icon: Upload,
      badge: "AI Vision",
    },
    {
      name: "AI Outfits",
      path: "/outfits",
      icon: Sparkles,
      badge: null,
    },
    {
      name: "Profile",
      path: "/profile",
      icon: User,
      badge: null,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 flex h-screen w-72 flex-col glass-sidebar transition-transform duration-300 ease-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between border-b border-slate-200/80 px-6 py-6">
          <div className="flex items-center gap-3">
           <div className="flex h-[60px] w-[60px] shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                <img
                  src={logo}
                  alt="Veloura"
                  className="block h-full w-full object-cover rounded-2xl"
                />
              </div>
            <div className="flex flex-col justify-center">
              <h1 className="text-[25px] font-extrabold tracking-tight text-slate-900 leading-none">
                Veloura
              </h1>
              <p className="text-[11px] font-medium text-slate-500 tracking-wide mt-1.5 leading-none">
                AI Digital Wardrobe
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Main Navigation
          </div>
          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `group relative flex items-center justify-between rounded-2xl px-4 py-3.5 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/20 font-semibold"
                        : "text-slate-600 hover:bg-indigo-50/60 hover:text-indigo-600"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-3.5">
                        <Icon
                          className={`h-5 w-5 transition-transform duration-200 group-hover:scale-110 ${
                            isActive ? "text-white" : "text-slate-400 group-hover:text-indigo-600"
                          }`}
                        />
                        <span>{item.name}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {item.badge && (
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide ${
                              isActive
                                ? "bg-white/20 text-white"
                                : "bg-purple-100 text-purple-700 group-hover:bg-indigo-100 group-hover:text-indigo-700"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                        <ChevronRight
                          className={`h-4 w-4 opacity-0 transition-all duration-200 group-hover:opacity-100 ${
                            isActive ? "text-white opacity-100" : "text-slate-400"
                          }`}
                        />
                      </div>
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>



        {/* Logout Button */}
        <div className="border-t border-slate-200/80 p-4">
          <button
            onClick={logout}
            className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-rose-50 hover:text-rose-600 group"
          >
            <div className="flex items-center gap-3">
              <LogOut className="h-5 w-5 text-slate-400 transition-transform duration-200 group-hover:-translate-x-0.5 group-hover:text-rose-600" />
              <span>Sign Out</span>
            </div>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;