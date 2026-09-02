import React, { useState, useEffect } from "react";
import type { ClothingItem, ClothingCategory } from "../../types/wardrobe";
import { X, Save } from "lucide-react";
import { useWardrobe } from "../../context/WardrobeContext";
import SearchableMultiSelect from "../common/SearchableMultiSelect";

const SEASON_OPTIONS = ["Spring", "Summer", "Fall", "Winter", "All Season"];
const OCCASION_OPTIONS = [
  "Casual",
  "Business Casual",
  "Formal",
  "Office",
  "College",
  "Party",
  "Wedding",
  "Gym",
  "Travel",
  "Date Night",
];

interface EditItemModalProps {
  item: ClothingItem | null;
  onClose: () => void;
}

const EditItemModal: React.FC<EditItemModalProps> = ({ item, onClose }) => {
  const { updateClothing } = useWardrobe();

  const [name, setName] = useState("");
  const [category, setCategory] = useState<ClothingCategory>("Tops");
  const [subcategory, setSubcategory] = useState("");
  const [color, setColor] = useState("");
  const [secondaryColor, setSecondaryColor] = useState("");
  const [colorHex, setColorHex] = useState("#4f46e5");
  const [pattern, setPattern] = useState("");
  const [material, setMaterial] = useState("");
  const [fit, setFit] = useState("");
  const [sleeveType, setSleeveType] = useState("");
  const [neckType, setNeckType] = useState("");
  const [season, setSeason] = useState<string[]>(["All Season"]);
  const [occasion, setOccasion] = useState<string[]>(["Casual"]);

  useEffect(() => {
    if (item) {
      setName(item.name || "");
      setCategory(item.category);
      setSubcategory(item.subcategory ?? "");
      setColor(item.color || "");
      setSecondaryColor(item.secondaryColor ?? "");
      setColorHex(item.colorHex || "#4f46e5");
      setPattern(Array.isArray(item.pattern) ? item.pattern.join(", ") : (item.pattern ?? ""));
      setMaterial(Array.isArray(item.material) ? item.material.join(", ") : (item.material ?? ""));
      setFit(item.fit ?? "");
      setSleeveType(item.sleeveType ?? "");
      setNeckType(item.neckType ?? "");
      
      const sArr = Array.isArray(item.season) ? item.season : (item.season ? [item.season] : ["All Season"]);
      setSeason(sArr as string[]);

      const oArr = Array.isArray(item.occasion) ? item.occasion : (item.occasion ? [item.occasion] : ["Casual"]);
      setOccasion(oArr as string[]);
    }
  }, [item]);

  if (!item) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateClothing(item.id, {
      name,
      category,
      subcategory,
      color,
      secondaryColor,
      colorHex,
      pattern: pattern ? pattern.split(",").map(s => s.trim()).filter(Boolean) : [],
      material: material ? material.split(",").map(s => s.trim()).filter(Boolean) : [],
      fit,
      sleeveType,
      neckType,
      season,
      occasion,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-md transition-opacity animate-in fade-in">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl animate-in zoom-in-95 duration-200 p-6 sm:p-8">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
          <h2 className="text-lg font-bold text-slate-900">Edit Garment Details</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Item Title</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-2.5 text-xs font-medium text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ClothingCategory)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-3 py-2.5 text-xs font-medium text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none"
              >
                <option value="Tops">Tops</option>
                <option value="Bottoms">Bottoms</option>
                <option value="Outerwear">Outerwear</option>
                <option value="Dresses">Dresses</option>
                <option value="Footwear">Footwear</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Subcategory</label>
              <input
                type="text"
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-2.5 text-xs font-medium text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Pattern(s)</label>
              <input
                type="text"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                placeholder="e.g. Solid, Striped"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-2.5 text-xs font-medium text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Material(s)</label>
              <input
                type="text"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                placeholder="e.g. Cotton, Denim"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-2.5 text-xs font-medium text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Fit</label>
            <input
              type="text"
              value={fit}
              onChange={(e) => setFit(e.target.value)}
              placeholder="e.g. Slim Fit, Oversized"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-2.5 text-xs font-medium text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SearchableMultiSelect
              label="Season(s)"
              options={SEASON_OPTIONS}
              selectedValues={season}
              onChange={setSeason}
              placeholder="Select seasons..."
              usePortal={true}
            />

            <SearchableMultiSelect
              label="Occasion(s)"
              options={OCCASION_OPTIONS}
              selectedValues={occasion}
              onChange={setOccasion}
              placeholder="Select occasions..."
              usePortal={true}
            />
          </div>

          <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-2xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-700 transition-colors"
            >
              <Save className="h-3.5 w-3.5" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditItemModal;
