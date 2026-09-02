import React, { useState, useMemo } from "react";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import ClothingCard from "../components/wardrobe/ClothingCard";
import WardrobeFilters from "../components/wardrobe/WardrobeFilters";
import ViewItemModal from "../components/wardrobe/ViewItemModal";
import EditItemModal from "../components/wardrobe/EditItemModal";
import { useWardrobe } from "../context/WardrobeContext";
import type { ClothingItem } from "../types/wardrobe";
import { Shirt, Plus, AlertCircle } from "lucide-react";

const Wardrobe: React.FC = () => {
  const { items, deleteClothing } = useWardrobe();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSeason, setSelectedSeason] = useState("All");
  const [selectedOccasion, setSelectedOccasion] = useState("All");
  const [favoriteOnly, setFavoriteOnly] = useState(false);

  // Modals state
  const [viewingItem, setViewingItem] = useState<ClothingItem | null>(null);
  const [editingItem, setEditingItem] = useState<ClothingItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Comprehensive Multi-Attribute Search & Filter Logic
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const query = searchQuery.toLowerCase().trim();

      const toString = (val: any) => {
        if (!val) return "";
        if (Array.isArray(val)) return val.join(" ").toLowerCase();
        return String(val).toLowerCase();
      };

      const matchesSearch =
        !query ||
        toString(item.name).includes(query) ||
        toString(item.category).includes(query) ||
        toString(item.subcategory).includes(query) ||
        toString(item.color).includes(query) ||
        toString(item.material).includes(query) ||
        toString(item.pattern).includes(query) ||
        toString(item.season).includes(query) ||
        toString(item.occasion).includes(query) ||
        toString(item.fit).includes(query) ||
        toString(item.neckType).includes(query) ||
        toString(item.sleeveType).includes(query);

      // Category
      const matchesCategory =
        selectedCategory === "All" ||
        item.category === selectedCategory ||
        (selectedCategory === "Tops" && item.category === "Top") ||
        (selectedCategory === "Bottoms" && item.category === "Bottom") ||
        (selectedCategory === "Footwear" && item.category === "Shoes");

      // Season
      const matchesSeason =
        selectedSeason === "All" ||
        toString(item.season).includes(selectedSeason.toLowerCase());

      // Occasion
      const matchesOccasion =
        selectedOccasion === "All" ||
        toString(item.occasion).includes(selectedOccasion.toLowerCase());

      // Favorite
      const matchesFavorite = !favoriteOnly || item.isFavorite;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesSeason &&
        matchesOccasion &&
        matchesFavorite
      );
    });
  }, [
    items,
    searchQuery,
    selectedCategory,
    selectedSeason,
    selectedOccasion,
    favoriteOnly,
  ]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedSeason("All");
    setSelectedOccasion("All");
    setFavoriteOnly(false);
  };

  const handleDeleteConfirm = () => {
    if (deletingId) {
      deleteClothing(deletingId);
      setDeletingId(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in fade-in duration-500 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3">
              <Shirt className="h-7 w-7 text-indigo-600" />
              Digital Wardrobe
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">
              Browse, search, and manage your complete fashion inventory
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/upload"
              className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-xs font-bold text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-700 transition-all hover:scale-105"
            >
              <Plus className="h-4 w-4" />
              Add Garment
            </a>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <WardrobeFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedSeason={selectedSeason}
          onSeasonChange={setSelectedSeason}
          selectedOccasion={selectedOccasion}
          onOccasionChange={setSelectedOccasion}
          favoriteOnly={favoriteOnly}
          onFavoriteOnlyToggle={() => setFavoriteOnly(!favoriteOnly)}
          onReset={handleResetFilters}
          totalResults={filteredItems.length}
        />

        {/* Clothing Grid */}
        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 rounded-3xl border-2 border-dashed border-slate-200 bg-white text-center shadow-soft">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 mb-4">
              <AlertCircle className="h-7 w-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No garments found</h3>
            <p className="mt-1 text-xs text-slate-500 max-w-sm">
              We couldn't find any items matching your active search or filter criteria.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-5 rounded-2xl bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-slate-800 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
            {filteredItems.map((item) => (
              <ClothingCard
                key={item.id}
                item={item}
                onView={setViewingItem}
                onEdit={setEditingItem}
                onDelete={(id) => setDeletingId(id)}
              />
            ))}
          </div>
        )}

        {/* View Modal */}
        <ViewItemModal
          item={viewingItem}
          onClose={() => setViewingItem(null)}
          onEdit={(item) => {
            setViewingItem(null);
            setEditingItem(item);
          }}
        />

        {/* Edit Modal */}
        <EditItemModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
        />

        {/* Delete Confirmation Dialog */}
        {deletingId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
            <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl animate-in zoom-in-95 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600 mb-4">
                <AlertCircle className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Delete Garment?</h3>
              <p className="mt-2 text-xs text-slate-500">
                Are you sure you want to remove this clothing item from your digital wardrobe? This action cannot be undone.
              </p>
              <div className="mt-6 flex items-center gap-3">
                <button
                  onClick={() => setDeletingId(null)}
                  className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="flex-1 rounded-2xl bg-rose-600 py-2.5 text-xs font-bold text-white shadow-md hover:bg-rose-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Wardrobe;