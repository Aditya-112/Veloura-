import { useWardrobe } from "../context/WardrobeContext";

export const useDashboardStats = () => {
  const { stats } = useWardrobe();
  return {
    data: stats,
    isLoading: false,
    error: null,
  };
};