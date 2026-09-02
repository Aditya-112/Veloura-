import React from "react";
import { Search, Heart, SlidersHorizontal, RotateCcw } from "lucide-react";
import type { ClothingCategory, Season, Occasion } from "../../types/wardrobe";

interface WardrobeFiltersProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string;
  onCategoryChange: (c: string) => void;
  selectedSeason: string;
  onSeasonChange: (s: string) => void;
  selectedOccasion: string;
  onOccasionChange: (o: string) => void;
  favoriteOnly: boolean;
  onFavoriteOnlyToggle: () => void;
  onReset: () => void;
  totalResults: number;
}

const categories: (ClothingCategory | "All")[] = [
  "All",
  "Tops",
  "Bottoms",
  "Outerwear",
  "Dresses",
  "Footwear",
  "Accessories",
];

const seasons: (Season | "All")[] = [
  "All",
  "Spring",
  "Summer",
  "Fall",
  "Winter",
  "All Season",
];

const occasions: (Occasion | "All")[] = [
  "All",
  "Casual",
  "Formal",
  "Business Casual",
  "Party",
  "Date Night",
  "Gym",
  "Travel",
];

const WardrobeFilters: React.FC<WardrobeFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedSeason,
  onSeasonChange,
  selectedOccasion,
  onOccasionChange,
  favoriteOnly,
  onFavoriteOnlyToggle,
  onReset,
  totalResults,
}) => {
  const hasActiveFilters =
    searchQuery ||
    selectedCategory !== "All" ||
    selectedSeason !== "All" ||
    selectedOccasion !== "All" ||
    favoriteOnly;

  return (
    <div className="space-y-4 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-soft">
      {/* Top Row: Search & Favorites & Reset */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search wardrobe by name, color, pattern, material..."
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 pl-10 pr-4 py-2.5 text-xs font-medium text-slate-900 placeholder-slate-400 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
          />
        </div>

        {/* Favorite Toggle & Reset Filter Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onFavoriteOnlyToggle}
            className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-semibold transition-all shadow-sm ${
              favoriteOnly
                ? "bg-rose-500 text-white shadow-rose-500/30"
                : "border border-slate-200 bg-slate-50/80 text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Heart className={`h-3.5 w-3.5 ${favoriteOnly ? "fill-white" : ""}`} />
            <span>Favorites</span>
          </button>

          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              title="Reset all filters"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Category Pills Row */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`shrink-0 rounded-2xl px-4 py-2 text-xs font-semibold transition-all duration-200 ${
              selectedCategory === cat
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                : "bg-slate-100/80 text-slate-600 hover:bg-slate-200/80"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Dropdown Filters Row: Season, Occasion & Count */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1 text-xs font-bold text-slate-500 mr-1">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Filter By:</span>
          </div>

          {/* Season Select */}
          <select
            value={selectedSeason}
            onChange={(e) => onSeasonChange(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors focus:border-indigo-500 focus:bg-white focus:outline-none"
          >
            <option value="All">All Seasons</option>
            {seasons.filter((s) => s !== "All").map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {/* Occasion Select */}
          <select
            value={selectedOccasion}
            onChange={(e) => onOccasionChange(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors focus:border-indigo-500 focus:bg-white focus:outline-none"
          >
            <option value="All">All Occasions</option>
            {occasions.filter((o) => o !== "All").map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>

        <span className="text-xs font-semibold text-slate-400">
          Showing <strong className="text-slate-900">{totalResults}</strong> items
        </span>
      </div>
    </div>
  );
};

export default WardrobeFilters;
