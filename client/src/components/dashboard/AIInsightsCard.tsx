import React from "react";
import { Sparkles, Palette, Layers, Sun, Calendar, Heart, ArrowUpRight } from "lucide-react";
import type { WardrobeInsights } from "../../types/wardrobe";

interface AIInsightsCardProps {
  insights: WardrobeInsights;
}

const AIInsightsCard: React.FC<AIInsightsCardProps> = ({ insights }) => {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-indigo-100 bg-gradient-to-br from-white via-slate-50/80 to-indigo-50/40 p-6 sm:p-8 shadow-soft shadow-card-hover">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-purple-500/10 blur-2xl" />

      {/* Card Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-indigo-100/80 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-glow">
            <Sparkles className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-bold tracking-tight text-slate-900 flex items-center gap-2">
              AI Wardrobe Insights
              <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-700">
                Live Audit
              </span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Real-time stylistic intelligence synthesized from your digital wardrobe
            </p>
          </div>
        </div>

        <a
          href="/outfits"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 group self-start sm:self-auto"
        >
          <span>Generate AI Look</span>
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </div>

      {/* Insights Grid */}
      <div className="relative z-10 mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {/* Dominant Color */}
        <div className="flex flex-col justify-between rounded-2xl border border-slate-200/60 bg-white/80 p-4 shadow-sm backdrop-blur-md transition-all hover:border-indigo-200 hover:bg-white">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider">Dominant Color</span>
            <Palette className="h-4 w-4 text-indigo-500" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <span
                className="h-4 w-4 rounded-full border border-slate-300 shadow-sm"
                style={{ backgroundColor: insights.dominantColorHex || "#4f46e5" }}
              />
              <span className="font-bold text-slate-900 text-base">
                {insights.dominantColor}
              </span>
            </div>
            <span className="mt-1 block text-[11px] text-slate-500 font-medium">
              Primary palette core
            </span>
          </div>
        </div>

        {/* Most Owned Category */}
        <div className="flex flex-col justify-between rounded-2xl border border-slate-200/60 bg-white/80 p-4 shadow-sm backdrop-blur-md transition-all hover:border-purple-200 hover:bg-white">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider">Top Category</span>
            <Layers className="h-4 w-4 text-purple-500" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-base">
              {insights.mostOwnedCategory}
            </h4>
            <span className="mt-1 block text-[11px] text-slate-500 font-medium">
              Highest item density
            </span>
          </div>
        </div>

        {/* Best Season */}
        <div className="flex flex-col justify-between rounded-2xl border border-slate-200/60 bg-white/80 p-4 shadow-sm backdrop-blur-md transition-all hover:border-amber-200 hover:bg-white">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider">Best Season</span>
            <Sun className="h-4 w-4 text-amber-500" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-base">
              {insights.bestSeason}
            </h4>
            <span className="mt-1 block text-[11px] text-slate-500 font-medium">
              Optimum climate fit
            </span>
          </div>
        </div>

        {/* Most Common Occasion */}
        <div className="flex flex-col justify-between rounded-2xl border border-slate-200/60 bg-white/80 p-4 shadow-sm backdrop-blur-md transition-all hover:border-emerald-200 hover:bg-white">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider">Top Occasion</span>
            <Calendar className="h-4 w-4 text-emerald-500" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-base">
              {insights.mostCommonOccasion}
            </h4>
            <span className="mt-1 block text-[11px] text-slate-500 font-medium">
              Frequent lifestyle vibe
            </span>
          </div>
        </div>

        {/* Favorite Percentage */}
        <div className="col-span-2 sm:col-span-1 flex flex-col justify-between rounded-2xl border border-slate-200/60 bg-white/80 p-4 shadow-sm backdrop-blur-md transition-all hover:border-rose-200 hover:bg-white">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Favorite Ratio</span>
            <Heart className="h-4 w-4 text-rose-500 fill-rose-500/20" />
          </div>
          <div>
            <div className="flex items-baseline justify-between">
              <span className="font-bold text-slate-900 text-xl">
                {insights.favoritePercentage}%
              </span>
              <span className="text-[10px] font-semibold text-rose-600">Curated</span>
            </div>
            {/* Progress Bar */}
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-rose-500 to-indigo-600 transition-all duration-700"
                style={{ width: `${insights.favoritePercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInsightsCard;
