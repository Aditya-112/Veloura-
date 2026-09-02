import React from "react";
import type { ClothingItem } from "../../types/wardrobe";
import { X, Heart } from "lucide-react";
import { useWardrobe } from "../../context/WardrobeContext";

interface ViewItemModalProps {
  item: ClothingItem | null;
  onClose: () => void;
  onEdit: (item: ClothingItem) => void;
}

const ViewItemModal: React.FC<ViewItemModalProps> = ({ item, onClose, onEdit }) => {
  const { toggleFavorite } = useWardrobe();

  if (!item) return null;

  const seasonsList = Array.isArray(item.season)
    ? item.season
    : (item.season ? [item.season] : ["All Season"]);

  const occasionsList = Array.isArray(item.occasion)
    ? item.occasion
    : (item.occasion ? [item.occasion] : ["Casual"]);

  const patternsList = Array.isArray(item.pattern)
    ? item.pattern.join(", ")
    : (item.pattern || "Solid");

  const materialsList = Array.isArray(item.material)
    ? item.material.join(", ")
    : (item.material || "Fabric");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-md transition-opacity animate-in fade-in">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-slate-900/60 text-white hover:bg-slate-900 transition-colors backdrop-blur-md"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex flex-col md:flex-row">
          {/* Image Left */}
          <div className="relative md:w-1/2 aspect-[4/5] bg-slate-100">
            <img
              src={item.imageUrl}
              alt={item.name}
              className="h-full w-full object-cover object-center"
            />
            <button
              onClick={() => toggleFavorite(item.id)}
              className={`absolute top-4 left-4 flex h-10 w-10 items-center justify-center rounded-full shadow-lg transition-transform ${
                item.isFavorite
                  ? "bg-rose-500 text-white shadow-rose-500/40 scale-105"
                  : "bg-white/80 text-slate-400 hover:bg-white hover:text-rose-500 backdrop-blur-md"
              }`}
            >
              <Heart className={`h-5 w-5 ${item.isFavorite ? "fill-white" : ""}`} />
            </button>
          </div>

          {/* Metadata Right */}
          <div className="p-6 md:w-1/2 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Category Badge */}
              <div>
                <span className="inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-600 border border-indigo-100">
                  {item.category}
                </span>
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  {item.name}
                </h2>
                {item.subcategory && (
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    {item.subcategory}
                  </p>
                )}
              </div>

              {/* Attributes Grid */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between py-2 border-b border-slate-100 text-xs">
                  <span className="text-slate-500 font-medium">Primary Color</span>
                  <div className="flex items-center gap-2 font-semibold text-slate-900">
                    <span
                      className="h-3.5 w-3.5 rounded-full border border-slate-300 shadow-sm"
                      style={{ backgroundColor: item.colorHex || "#4f46e5" }}
                    />
                    {item.color}
                  </div>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-slate-100 text-xs">
                  <span className="text-slate-500 font-medium">Pattern</span>
                  <span className="font-semibold text-slate-900">{patternsList}</span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-slate-100 text-xs">
                  <span className="text-slate-500 font-medium">Material</span>
                  <span className="font-semibold text-slate-900">{materialsList}</span>
                </div>

                {/* Season Chips */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-slate-100 text-xs gap-1.5">
                  <span className="text-slate-500 font-medium shrink-0">Season(s)</span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {seasonsList.map((s, idx) => (
                      <span
                        key={idx}
                        className="rounded-xl bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 border border-slate-200/60"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Occasion Chips */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-slate-100 text-xs gap-1.5">
                  <span className="text-slate-500 font-medium shrink-0">Occasion Vibe(s)</span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {occasionsList.map((o, idx) => (
                      <span
                        key={idx}
                        className="rounded-xl bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700 border border-indigo-100"
                      >
                        {o}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={() => {
                  onClose();
                  onEdit(item);
                }}
                className="w-full rounded-2xl bg-indigo-600 py-3 text-xs font-bold text-white shadow-lg hover:bg-indigo-700 transition-colors text-center"
              >
                Edit Specifications
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewItemModal;
