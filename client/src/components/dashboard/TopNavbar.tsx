import React, { useState } from "react";
import { Bell, Sparkles, Menu, Check, Trash2, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useLiveWeather } from "../../hooks/useLiveWeather";

interface TopNavbarProps {
  onMenuToggle?: () => void;
}

const TopNavbar: React.FC<TopNavbarProps> = ({ onMenuToggle }) => {
  const { user } = useAuth();
  const userName = user?.name || "Alex Vance";
  const { weather: liveWeather, loading: weatherLoading, permissionDenied } = useLiveWeather();

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "AI Wardrobe Audit Ready",
      message: "Your top color palette shifted +15% towards Indigo & Earth Tones.",
      time: "10m ago",
      read: false,
    },
    {
      id: 2,
      title: "Outfit Suggestion",
      message: "Weather in your area calls for Linen & Silk layers today.",
      time: "2h ago",
      read: false,
    },
    {
      id: 3,
      title: "New Item Synced",
      message: "Cashmere Knit Sweater successfully categorized as Outerwear.",
      time: "1d ago",
      read: true,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const removeNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between border-b border-slate-200/80 bg-white/80 px-6 sm:px-8 backdrop-blur-xl transition-all">
      {/* Left Section: Mobile Toggle & Welcome Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-600 transition-colors hover:bg-slate-100 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <h2 className="text-sm font-bold text-slate-900 sm:text-base">
            Welcome back, <span className="gradient-text">{userName}</span>
          </h2>
          <p className="hidden text-xs text-slate-500 font-medium sm:block">
            AI recommendations are updated for today's weather
          </p>
        </div>
      </div>

      {/* Right Actions: Quick AI Badge, Weather Badge, Notification Bell, Avatar */}
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="hidden md:flex items-center gap-2 rounded-2xl bg-indigo-50/80 px-3.5 py-1.5 text-xs font-semibold text-indigo-700 border border-indigo-100 shadow-sm">
          <Sparkles className="h-3.5 w-3.5 text-indigo-600 animate-pulse" />
          <span>Stylist Engine Active</span>
        </div>

        {/* Minimalist Live Weather Navbar Badge */}
        {weatherLoading && (
          <div className="hidden sm:flex items-center gap-2 rounded-2xl bg-slate-100/80 px-3 py-1.5 text-xs font-semibold text-slate-400 animate-pulse border border-slate-200/60">
            <span className="h-3.5 w-3.5 rounded-full bg-slate-300 shrink-0" />
            <span className="h-3 w-8 rounded bg-slate-300 shrink-0" />
          </div>
        )}

        {!weatherLoading && liveWeather && !permissionDenied && (
          <div className="relative group">
            <div className="flex items-center gap-1.5 rounded-2xl bg-white/90 px-3 py-1.5 text-xs font-bold text-slate-800 border border-slate-200/80 shadow-xs cursor-pointer transition-all hover:bg-slate-50 hover:border-indigo-200">
              <span className="text-sm leading-none">{liveWeather.icon}</span>
              <span className="text-indigo-600 font-extrabold">{liveWeather.temperature}°C</span>
            </div>

            {/* Weather Hover Tooltip */}
            <div className="absolute right-0 top-full mt-2 hidden group-hover:flex flex-col rounded-2xl border border-slate-200/80 bg-white p-3 shadow-xl z-50 min-w-[140px] text-xs space-y-1 animate-in fade-in duration-150">
              <span className="font-extrabold text-slate-900">{liveWeather.city}</span>
              <span className="font-semibold text-indigo-600">{liveWeather.condition}</span>
              <span className="text-[11px] text-slate-500 font-medium">Feels like {liveWeather.feelsLike}°C</span>
            </div>
          </div>
        )}

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-600 transition-all hover:bg-slate-100 hover:text-indigo-600"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-600" />
              </span>
            )}
          </button>

          {/* Notifications Panel */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-3xl border border-slate-200/80 bg-white p-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150 z-50">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-xs sm:text-sm">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                    >
                      <Check className="h-3 w-3" /> Mark read
                    </button>
                  )}
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-slate-400 hover:text-slate-600 p-1"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {notifications.length === 0 ? (
                  <p className="text-center py-6 text-xs text-slate-400">No notifications</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`flex items-start justify-between rounded-2xl p-3 text-xs transition-colors ${
                        n.read ? "bg-slate-50/60" : "bg-indigo-50/50 border border-indigo-100/80"
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{n.title}</span>
                          <span className="text-[10px] text-slate-400 font-medium">{n.time}</span>
                        </div>
                        <p className="text-slate-600 leading-snug">{n.message}</p>
                      </div>
                      <button
                        onClick={() => removeNotification(n.id)}
                        className="text-slate-400 hover:text-rose-500 p-1 shrink-0 ml-2"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar */}
        <Link to="/profile" className="flex items-center gap-3 group">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-bold shadow-md transition-transform duration-200 group-hover:scale-105 border-2 border-white overflow-hidden">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={userName}
                className="h-full w-full object-cover"
              />
            ) : (
              userName.charAt(0)
            )}
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white z-10" />
          </div>
        </Link>
      </div>
    </header>
  );
};

export default TopNavbar;