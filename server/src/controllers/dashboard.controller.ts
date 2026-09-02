import { Response } from "express";

import Clothes from "../models/clothes.model";
import User from "../models/user.model";
import { AuthRequest } from "../types/auth.types";

const getStartAndEndOfWeek = () => {
  const now = new Date();
  const day = now.getDay(); // 0 is Sunday, 1 is Monday...
  const diffToMonday = (day + 6) % 7;
  const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - diffToMonday, 0, 0, 0, 0);
  const endOfWeek = new Date(startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000 - 1);
  return { startOfWeek, endOfWeek };
};

export const getDashboardStats = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("outfitsGenerated outfitGenerationDates");

    const totalClothes = await Clothes.countDocuments({
      user: userId,
    });

    const favorites = await Clothes.countDocuments({
      user: userId,
      favorite: true,
    });

    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );

    const addedThisMonth = await Clothes.countDocuments({
      user: userId,
      createdAt: {
        $gte: startOfMonth,
      },
    });

    const { startOfWeek, endOfWeek } = getStartAndEndOfWeek();
    const dates = user?.outfitGenerationDates || [];
    const outfitsGeneratedThisWeek = dates.filter((d) => {
      const dateObj = new Date(d);
      return dateObj >= startOfWeek && dateObj <= endOfWeek;
    }).length;

    res.status(200).json({
      success: true,
      stats: {
        totalClothes,
        favorites,
        addedThisMonth,
        outfitsGenerated: user?.outfitsGenerated || 0,
        outfitsGeneratedThisWeek,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard stats.",
    });
  }
};

export const recordOutfitGeneration = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user.id;
    const now = new Date();

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $inc: { outfitsGenerated: 1 },
        $push: { outfitGenerationDates: now },
      },
      { new: true }
    ).select("outfitsGenerated outfitGenerationDates");

    const { startOfWeek, endOfWeek } = getStartAndEndOfWeek();
    const dates = user?.outfitGenerationDates || [];
    const outfitsGeneratedThisWeek = dates.filter((d) => {
      const dateObj = new Date(d);
      return dateObj >= startOfWeek && dateObj <= endOfWeek;
    }).length;

    res.status(200).json({
      success: true,
      message: "Outfit generation count updated.",
      outfitsGenerated: user?.outfitsGenerated || 0,
      outfitsGeneratedThisWeek,
    });
  } catch (error) {
    console.error("Record Outfit Generation Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to record outfit generation.",
    });
  }
};

const getMostFrequent = (items: string[]) => {
  const frequency: Record<string, number> = {};

  items.forEach((item) => {
    if (!item) return;

    frequency[item] = (frequency[item] || 0) + 1;
  });

  const keys = Object.keys(frequency);

  if (keys.length === 0) {
    return "N/A";
  }

  return keys.reduce((a, b) =>
    frequency[a] > frequency[b] ? a : b
  );
};

export const getWardrobeInsights = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user.id;

    const clothes = await Clothes.find({
      user: userId,
    }).lean();


    if (clothes.length === 0) {
      res.status(200).json({
        success: true,
        insights: {
          dominantColor: "N/A",
          dominantCategory: "N/A",
          dominantSeason: "N/A",
          dominantOccasion: "N/A",
          favoritePercentage: 0,
        },
      });
      return;
    }

    const dominantColor = getMostFrequent(
      clothes.map((item) => item.color.primary)
    );

    const dominantCategory = getMostFrequent(
      clothes.map((item) => item.category)
    );

    const dominantSeason = getMostFrequent(
      clothes.flatMap((item) => item.season)
    );

    const dominantOccasion = getMostFrequent(
      clothes.flatMap((item) => item.occasion)
    );

    const favoritePercentage = Math.round(
      (clothes.filter((item) => item.favorite).length / clothes.length) * 100
    );

    res.status(200).json({
      success: true,
      insights: {
        dominantColor,
        dominantCategory,
        dominantSeason,
        dominantOccasion,
        favoritePercentage,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch wardrobe insights.",
    });
  }
};