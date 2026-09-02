import React from "react";
import { Shirt, Heart, Sparkles, Calendar, Plus, Sparkle } from "lucide-react";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import StatCard from "../components/dashboard/StatCard";
import WardrobeBreakdownChart from "../components/dashboard/WardrobeBreakdownChart";
import RecentUploadsGrid from "../components/dashboard/RecentUploadsGrid";
import { useWardrobe } from "../context/WardrobeContext";
import { useAuth } from "../context/AuthContext";

const Dashboard: React.FC = () => {
  const { stats, insights, categoryBreakdown, recentUploads } = useWardrobe();
  const { user } = useAuth();
  const userName = user?.name || "Alex Vance";

  if (import.meta.env.DEV) {
    console.log(`[AUTH DEBUG] Dashboard rendered at ${(performance.now()).toFixed(2)} ms`);
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in duration-500 pb-12">
        {/* Welcome Section Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-950 p-6 sm:p-8 text-white shadow-xl">
          <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="absolute -bottom-10 right-20 h-48 w-48 rounded-full bg-purple-500/20 blur-2xl" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-indigo-300 backdrop-blur-md border border-white/10 mb-3">
                <Sparkle className="h-3.5 w-3.5 text-purple-300 animate-spin" style={{ animationDuration: '8s' }} />
                <span>Veloura AI Executive Dashboard</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Good day, <span className="bg-gradient-to-r from-indigo-200 via-purple-200 to-white bg-clip-text text-transparent">{userName}</span>
              </h1>
              <p className="mt-2 text-sm text-slate-300 max-w-xl leading-relaxed">
                Your wardrobe holds <strong className="text-white font-semibold">{stats.totalClothes} items</strong> curated with a <strong className="text-indigo-200 font-semibold">{insights.dominantColor}</strong> dominant palette.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="/upload"
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-xs font-bold text-slate-900 shadow-lg hover:bg-slate-100 transition-all hover:scale-105"
              >
                <Plus className="h-4 w-4 text-indigo-600" />
                Upload New Item
              </a>
              <a
                href="/outfits"
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-3 text-xs font-bold text-white shadow-glow hover:opacity-95 transition-all hover:scale-105"
              >
                <Sparkles className="h-4 w-4" />
                AI Outfit Engine
              </a>
            </div>
          </div>
        </div>

        {/* 4 Statistics Cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Clothes"
            value={stats.totalClothes}
            icon={Shirt}
            subtitle="Cataloged in wardrobe"
            colorScheme="indigo"
          />

          <StatCard
            title="Favorites"
            value={stats.favorites}
            icon={Heart}
            subtitle="Curated core items"
            colorScheme="purple"
          />

          <StatCard
            title="OUTFITS GENERATED THIS WEEK"
            value={stats.outfitsGeneratedThisWeek ?? 0}
            icon={Sparkles}
            subtitle="Stylist recommended looks"
            colorScheme="emerald"
          />

          <StatCard
            title="Added This Month"
            value={stats.addedThisMonth}
            icon={Calendar}
            subtitle="Current month collection"
            colorScheme="amber"
          />
        </div>

        {/* Breakdown Chart & Recent Uploads Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <WardrobeBreakdownChart
              breakdown={categoryBreakdown}
              totalClothes={stats.totalClothes}
            />
          </div>

          <div className="lg:col-span-2">
            <RecentUploadsGrid items={recentUploads} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;