import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import type {
  ClothingItem,
  WardrobeStats,
  WardrobeInsights,
  CategoryBreakdown,
  ClothingCategory,
  Occasion,
  OutfitRecommendation,
} from '../types/wardrobe';
import { useAuth } from './AuthContext';
import { generateOutfitsAlgorithm } from '../utils/outfitGenerator';

interface WardrobeContextType {
  items: ClothingItem[];
  stats: WardrobeStats;
  insights: WardrobeInsights;
  categoryBreakdown: CategoryBreakdown[];
  recentUploads: ClothingItem[];
  outfitsHistory: OutfitRecommendation[];
  currentSessionOutfits: OutfitRecommendation[];
  addClothing: (item: Omit<ClothingItem, 'id' | 'createdAt'>) => void;
  updateClothing: (id: string, updated: Partial<ClothingItem>) => void;
  deleteClothing: (id: string) => void;
  toggleFavorite: (id: string) => void;
  generateOutfit: (occasion: Occasion, weather: string) => OutfitRecommendation;
  generateOutfits: (occasion: Occasion, weather: string) => OutfitRecommendation[];
  analyzeImage: (file: File) => Promise<ClothingItem>;
  fetchWardrobe: () => Promise<void>;
}

const WardrobeContext = createContext<WardrobeContextType | undefined>(undefined);

export const WardrobeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user, getToken } = useAuth();
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [outfitsHistory, setOutfitsHistory] = useState<OutfitRecommendation[]>([]);
  const [currentSessionOutfits, setCurrentSessionOutfits] = useState<OutfitRecommendation[]>([]);

  const mapBackendItem = (item: any): ClothingItem => ({
    id: item._id,
    name: item.name,
    category: item.category,
    subcategory: item.subcategory ?? '',
    color: item.color?.primary || 'Indigo',
    secondaryColor: item.color?.secondary ?? '',
    colorHex: item.color?.hex || '#4f46e5',
    pattern: item.pattern ?? [],
    material: item.material ?? [],
    fit: item.fit ?? '',
    sleeveType: item.sleeveType ?? '',
    neckType: item.neckType ?? '',
    formalityGrade: typeof item.formalityGrade === 'number' ? item.formalityGrade : undefined,
    styleProfile: item.styleProfile ?? undefined,
    breathability: item.breathability ?? undefined,
    warmthRating: typeof item.warmthRating === 'number' ? item.warmthRating : undefined,
    season: item.season || [],
    occasion: item.occasion || [],
    confidence: item.confidence || 0.9,
    isFavorite: item.favorite || false,
    timesUsed: typeof item.timesUsed === 'number' ? item.timesUsed : 0,
    imageUrl: item.imageUrl,
    publicId: item.publicId,
    createdAt: item.createdAt || new Date().toISOString(),
  });

  const [persistedOutfitsGenerated, setPersistedOutfitsGenerated] = useState<number>(0);
  const [persistedOutfitsGeneratedThisWeek, setPersistedOutfitsGeneratedThisWeek] = useState<number>(0);

  const fetchWardrobe = async () => {
    if (!isAuthenticated) return;
    try {
      const res = await api.get('/clothes');
      if (res.data?.success) {
        setItems(res.data.data.map(mapBackendItem));
      }
    } catch (error) {
      console.error("Failed to fetch wardrobe:", error);
    }
  };

  const fetchDashboardStats = async () => {
    if (!isAuthenticated) return;
    try {
      const res = await api.get('/dashboard/stats');
      if (res.data?.success && res.data?.stats) {
        setPersistedOutfitsGenerated(res.data.stats.outfitsGenerated || 0);
        setPersistedOutfitsGeneratedThisWeek(res.data.stats.outfitsGeneratedThisWeek || 0);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user?._id) {
      setItems([]);
      setOutfitsHistory([]);
      setCurrentSessionOutfits([]);
      setPersistedOutfitsGenerated(0);
      setPersistedOutfitsGeneratedThisWeek(0);
      fetchWardrobe();
      fetchDashboardStats();
    } else {
      setItems([]);
      setOutfitsHistory([]);
      setCurrentSessionOutfits([]);
      setPersistedOutfitsGenerated(0);
      setPersistedOutfitsGeneratedThisWeek(0);
    }
  }, [isAuthenticated, user?._id]);

  // Statistics calculation
  const totalClothes = items.length;
  const favorites = items.filter((i) => i.isFavorite).length;
  const outfitsGenerated = persistedOutfitsGenerated;
  const outfitsGeneratedThisWeek = persistedOutfitsGeneratedThisWeek;

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const addedThisMonth = items.filter((i) => {
    const d = new Date(i.createdAt);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  }).length;

  const stats: WardrobeStats = {
    totalClothes,
    favorites,
    outfitsGenerated,
    outfitsGeneratedThisWeek,
    addedThisMonth,
  };

  // Insights calculation
  const categoryCounts: Record<ClothingCategory, number> = {
    Tops: 0,
    Bottoms: 0,
    Outerwear: 0,
    Dresses: 0,
    Footwear: 0,
    Accessories: 0,
    Top: 0,
    Bottom: 0,
    Shoes: 0,
  } as Record<string, number>;

  const colorCounts: Record<string, { count: number; hex: string }> = {};

  items.forEach((item) => {
    const cat = (item.category === 'Top' ? 'Tops' : item.category === 'Bottom' ? 'Bottoms' : item.category === 'Shoes' ? 'Footwear' : item.category) as ClothingCategory;
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;

    if (!colorCounts[item.color]) {
      colorCounts[item.color] = { count: 1, hex: item.colorHex || '#4f46e5' };
    } else {
      colorCounts[item.color].count += 1;
    }
  });

  let maxCategory: ClothingCategory = 'Tops';
  let maxCatCount = 0;
  (['Tops', 'Bottoms', 'Outerwear', 'Dresses', 'Footwear', 'Accessories'] as ClothingCategory[]).forEach((cat) => {
    if ((categoryCounts[cat] || 0) > maxCatCount) {
      maxCatCount = categoryCounts[cat];
      maxCategory = cat;
    }
  });

  let domColor = 'Indigo';
  let domColorHex = '#4f46e5';
  let maxColCount = 0;
  Object.entries(colorCounts).forEach(([col, val]) => {
    if (val.count > maxColCount) {
      maxColCount = val.count;
      domColor = col;
      domColorHex = val.hex;
    }
  });

  const favoritePercentage = totalClothes > 0 ? Math.round((favorites / totalClothes) * 100) : 0;

  const insights: WardrobeInsights = {
    dominantColor: domColor,
    dominantColorHex: domColorHex,
    mostOwnedCategory: maxCategory,
    bestSeason: 'Fall / Winter',
    mostCommonOccasion: 'Business Casual',
    favoritePercentage,
  };

  const categoryColors: Record<ClothingCategory, string> = {
    Tops: '#4f46e5',
    Bottoms: '#8b5cf6',
    Outerwear: '#6366f1',
    Dresses: '#ec4899',
    Footwear: '#10b981',
    Accessories: '#f59e0b',
    Top: '#4f46e5',
    Bottom: '#8b5cf6',
    Shoes: '#10b981',
  } as Record<string, string>;

  const mainCategories: ClothingCategory[] = ['Tops', 'Bottoms', 'Outerwear', 'Dresses', 'Footwear', 'Accessories'];

  const categoryBreakdown: CategoryBreakdown[] = mainCategories
    .map((cat) => ({
      category: cat,
      count: categoryCounts[cat] || 0,
      percentage: totalClothes > 0 ? Math.round(((categoryCounts[cat] || 0) / totalClothes) * 100) : 0,
      color: categoryColors[cat],
    }))
    .filter((b) => b.count > 0);

  const recentUploads = [...items]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  const addClothing = (newItemData: Omit<ClothingItem, 'id' | 'createdAt'>) => {
    const newItem: ClothingItem = {
      ...newItemData,
      id: `item-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setItems((prev) => [newItem, ...prev]);
  };

  const updateClothing = async (id: string, updated: Partial<ClothingItem>) => {
    try {
      const token = await getToken();
      const payload: any = { ...updated };
      if (updated.color || updated.secondaryColor || updated.colorHex) {
        payload.color = {
          primary: updated.color,
          secondary: updated.secondaryColor,
          hex: updated.colorHex,
        };
        payload.primaryColor = updated.color;
        payload.colorHex = updated.colorHex;
      }
      const res = await api.put(`/clothes/${id}`, payload, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.data?.success && res.data?.data) {
        const savedDoc = mapBackendItem(res.data.data);
        setItems((prev) =>
          prev.map((item) => (item.id === id ? { ...item, ...savedDoc } : item))
        );
        // Refetch to guarantee 100% synchronization across all components
        await fetchWardrobe();
      }
    } catch (error) {
      console.error("Update failed:", error);
      throw error;
    }
  };

  const deleteClothing = async (id: string) => {
    try {
      const token = await getToken();
      await api.delete(`/clothes/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const toggleFavorite = async (id: string) => {
    try {
      const token = await getToken();
      const item = items.find(i => i.id === id);
      if (!item) return;
      
      const newFav = !item.isFavorite;
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, isFavorite: newFav } : i))
      );
      
      await api.patch(`/clothes/${id}/favorite`, { favorite: newFav }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
    } catch (error) {
      console.error("Toggle favorite failed:", error);
      fetchWardrobe(); // Revert on failure
    }
  };

  const generateOutfits = (occasion: Occasion, weather: string): OutfitRecommendation[] => {
    const recommendations = generateOutfitsAlgorithm(items, occasion, weather);
    setCurrentSessionOutfits(recommendations);
    if (recommendations.length > 0) {
      setOutfitsHistory((prev) => [...recommendations, ...prev]);
      setPersistedOutfitsGenerated((prev) => prev + 1);
      setPersistedOutfitsGeneratedThisWeek((prev) => prev + 1);
      getToken().then((token) => {
        api.post('/dashboard/record-outfit', { count: 1 }, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }).then((res) => {
          if (res.data?.outfitsGeneratedThisWeek !== undefined) {
            setPersistedOutfitsGeneratedThisWeek(res.data.outfitsGeneratedThisWeek);
          }
        }).catch((err) => {
          console.error("Failed to persist outfit generation count:", err);
        });
      });
    }
    return recommendations;
  };

  const generateOutfit = (occasion: Occasion, weather: string): OutfitRecommendation => {
    const list = generateOutfits(occasion, weather);
    if (list.length > 0) return list[0];
    return {
      id: `outfit-${Date.now()}`,
      optionTitle: "Option 1 • Stylist's Pick",
      name: `${occasion} Ensemble`,
      title: `${occasion} Ensemble`,
      occasion,
      weather,
      items: items.slice(0, 3),
      compatibilityScore: 85,
      occasionMatch: 85,
      weatherMatch: 85,
      colorHarmony: 85,
      styleCompatibility: 85,
      materialCompatibility: 85,
      seasonMatch: 85,
      diversityScore: 85,
      explanation: `Curated style ensemble for ${occasion} in ${weather}.`,
      createdAt: new Date().toISOString(),
    };
  };

  const analyzeImage = async (file: File): Promise<ClothingItem> => {
    const token = await getToken();
    const formData = new FormData();
    formData.append('image', file);
    
    const res = await api.post('/clothes/upload', formData, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    
    if (res.data?.success) {
      const newItem = mapBackendItem(res.data.data);
      setItems((prev) => [newItem, ...prev]);
      return newItem;
    } else {
      throw new Error("Analysis failed");
    }
  };

  return (
    <WardrobeContext.Provider
      value={{
        items,
        stats,
        insights,
        categoryBreakdown,
        recentUploads,
        outfitsHistory,
        currentSessionOutfits,
        addClothing,
        updateClothing,
        deleteClothing,
        toggleFavorite,
        generateOutfit,
        generateOutfits,
        analyzeImage,
        fetchWardrobe
      }}
    >
      {children}
    </WardrobeContext.Provider>
  );
};

export const useWardrobe = () => {
  const context = useContext(WardrobeContext);
  if (!context) {
    throw new Error('useWardrobe must be used within a WardrobeProvider');
  }
  return context;
};
