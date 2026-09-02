import React from "react";
import type { ClothingItem } from "../../types/wardrobe";
import { Sparkles, Heart, ArrowRight, Plus } from "lucide-react";
import { useWardrobe } from "../../context/WardrobeContext";

interface RecentUploadsGridProps {
  items: ClothingItem[];
}

const RecentUploadsGrid: React.FC<RecentUploadsGridProps> = ({ items }) => {
  const { toggleFavorite } = useWardrobe();

  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-soft shadow-card-hover">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-indigo-600" />
            Recent Uploads
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Latest additions processed by AI Vision
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/upload"
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Item</span>
          </a>
          <a
            href="/wardrobe"
            className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors ml-2"
          >
            <span>View All</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {/* Grid of Items */}
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50">
          <p className="text-sm font-semibold text-slate-600">No items uploaded yet</p>
          <p className="text-xs text-slate-400 mt-1">Start by adding clothes to your digital wardrobe</p>
          <a
            href="/upload"
            className="mt-4 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors"
          >
            Upload Clothing
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-indigo-200"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-slate-100">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Category Badge */}
                <span className="absolute top-2.5 left-2.5 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-slate-700 shadow-sm backdrop-blur-md">
                  {item.category}
                </span>

                {/* Favorite Toggle Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(item.id);
                  }}
                  className={`absolute top-2.5 right-2.5 flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 shadow-sm ${
                    item.isFavorite
                      ? "bg-rose-500 text-white shadow-rose-500/30"
                      : "bg-white/80 text-slate-400 hover:bg-white hover:text-rose-500 backdrop-blur-md"
                  }`}
                  aria-label="Toggle favorite"
                >
                  <Heart className={`h-4 w-4 ${item.isFavorite ? "fill-white" : ""}`} />
                </button>
              </div>

              {/* Item Details */}
              <div className="p-3.5">
                <h4 className="font-semibold text-slate-900 text-xs truncate group-hover:text-indigo-600 transition-colors">
                  {item.name}
                </h4>
                <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="truncate">{item.subcategory}</span>
                  <div className="flex items-center gap-1 shrink-0">
                    <span
                      className="h-2.5 w-2.5 rounded-full border border-slate-300"
                      style={{ backgroundColor: item.colorHex || "#4f46e5" }}
                    />
                    <span className="font-medium text-slate-600">{item.color}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentUploadsGrid;
