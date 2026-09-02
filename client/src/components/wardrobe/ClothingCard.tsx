import React, { useState } from "react";
import type { ClothingItem } from "../../types/wardrobe";
import { Heart, Eye, Edit3, Trash2, Tag } from "lucide-react";
import { useWardrobe } from "../../context/WardrobeContext";

interface ClothingCardProps {
  item: ClothingItem;
  onView: (item: ClothingItem) => void;
  onEdit: (item: ClothingItem) => void;
  onDelete: (id: string) => void;
}

const fallbackImage = "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80";

const ClothingCard: React.FC<ClothingCardProps> = ({
  item,
  onView,
  onEdit,
  onDelete,
}) => {
  const { toggleFavorite } = useWardrobe();
  const [imgSrc, setImgSrc] = useState(item.imageUrl || fallbackImage);

  // Normalize array vs string props safely
  const formatList = (val: string | string[] | undefined) => {
    if (!val) return "";
    return Array.isArray(val) ? val.join(", ") : val;
  };

  const formatCompactList = (val: string | string[] | undefined, maxItems = 2) => {
    if (!val) return "";
    const arr = Array.isArray(val) ? val : [val];
    if (arr.length === 0) return "";
    if (arr.length <= maxItems) {
      return arr.join(" • ");
    }
    const main = arr.slice(0, maxItems).join(" • ");
    const extra = arr.length - maxItems;
    return `${main} +${extra}`;
  };

  const materialsText = formatList(item.material);
  const patternsText = formatList(item.pattern);
  const compactSeasons = formatCompactList(item.season, 2);
  const compactOccasions = formatCompactList(item.occasion, 2);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-soft shadow-card-hover transition-all duration-300 hover:border-indigo-200">
      {/* Image Container */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-slate-100">
        <img
          src={imgSrc}
          onError={() => setImgSrc(fallbackImage)}
          alt={item.name}
          className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
          loading="lazy"
        />

        {/* Gradient Overlay for Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Category Badge Top Left */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-slate-800 shadow-md backdrop-blur-md">
          <Tag className="h-3 w-3 text-indigo-600" />
          <span>{item.category}</span>
        </div>

        {/* Favorite Heart Top Right */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(item.id);
          }}
          className={`absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300 shadow-md ${
            item.isFavorite
              ? "bg-rose-500 text-white shadow-rose-500/40 scale-110"
              : "bg-white/80 text-slate-400 hover:bg-white hover:text-rose-500 backdrop-blur-md"
          }`}
          aria-label="Toggle favorite"
        >
          <Heart className={`h-4 w-4 transition-transform ${item.isFavorite ? "fill-white" : ""}`} />
        </button>

        {/* Action Buttons Overlay on Hover */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-center gap-2 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 z-10">
          <button
            onClick={() => onView(item)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-white/95 px-3 py-2 text-xs font-bold text-slate-800 shadow-md hover:bg-indigo-600 hover:text-white transition-colors backdrop-blur-md"
          >
            <Eye className="h-3.5 w-3.5" />
            <span>View</span>
          </button>
          <button
            onClick={() => onEdit(item)}
            className="flex items-center justify-center h-9 w-9 rounded-2xl bg-white/95 text-slate-700 shadow-md hover:bg-purple-600 hover:text-white transition-colors backdrop-blur-md"
            title="Edit item"
          >
            <Edit3 className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="flex items-center justify-center h-9 w-9 rounded-2xl bg-white/95 text-slate-700 shadow-md hover:bg-rose-600 hover:text-white transition-colors backdrop-blur-md"
            title="Delete item"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Garment Details Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
        <div>
          <h3 className="font-bold text-slate-900 text-sm line-clamp-1 group-hover:text-indigo-600 transition-colors">
            {item.name}
          </h3>
          <p className="text-xs text-slate-500 font-semibold mt-0.5">
            {item.subcategory}
          </p>
        </div>

        {/* Tags Row: Pattern & Material */}
        <div className="text-[11px] text-slate-500 font-medium space-y-1">
          {materialsText && (
            <p className="truncate text-slate-600">
              <strong className="text-slate-400 font-semibold">Material:</strong> {materialsText}
            </p>
          )}
          {patternsText && (
            <p className="truncate text-slate-600">
              <strong className="text-slate-400 font-semibold">Pattern:</strong> {patternsText}
            </p>
          )}
        </div>

        {/* Footer Row: Swatch & Season/Occasion */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
          {/* Primary Color Swatch */}
          <div className="flex items-center gap-1.5">
            <span
              className="h-3.5 w-3.5 rounded-full border border-slate-300 shadow-sm shrink-0"
              style={{ backgroundColor: item.colorHex || "#4f46e5" }}
            />
            <span className="font-semibold text-slate-800 text-xs truncate max-w-[90px]">
              {item.color}
            </span>
          </div>

          {/* Season & Occasion Tags */}
          <div className="flex items-center gap-1.5 text-[10px] font-medium shrink-0 max-w-[60%] justify-end">
            {compactSeasons && (
              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-slate-600 truncate">
                {compactSeasons}
              </span>
            )}
            {compactOccasions && (
              <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-indigo-700 font-semibold truncate">
                {compactOccasions}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClothingCard;
