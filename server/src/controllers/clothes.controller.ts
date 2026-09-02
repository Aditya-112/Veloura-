import { Response } from "express";
import { AuthRequest } from "../types/auth.types";
import Clothes from "../models/clothes.model";
import { uploadImage, deleteImage } from "../services/cloudinary.service";
import { analyzeClothing } from "../services/gemini.service";

export const uploadClothes = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  let uploadedImage: any;
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: "No image uploaded.",
      });
      return;
    }

    // Step 1: Upload to Cloudinary
    uploadedImage = await uploadImage(req.file);

    // Step 2: Analyze using Gemini
    const metadata = await analyzeClothing(
      req.file.buffer,
      req.file.mimetype
    );

    const clothes = await Clothes.create({
      user: req.user!.id,
      imageUrl: uploadedImage.secure_url,
      publicId: uploadedImage.public_id,
      name: `${metadata.primaryColor} ${metadata.subcategory}`,
      category: metadata.category,
      subcategory: metadata.subcategory,
      color: {
        primary: metadata.primaryColor,
        secondary: metadata.secondaryColor,
        hex: metadata.colorHex,
      },
      pattern: metadata.pattern,
      material: metadata.material,
      fit: metadata.fit,
      sleeveType: metadata.sleeveType,
      neckType: metadata.neckType,
      formalityGrade: metadata.formalityGrade,
      styleProfile: metadata.styleProfile,
      breathability: metadata.breathability,
      warmthRating: metadata.warmthRating,
      season: metadata.season,
      occasion: metadata.occasion,
      confidence: metadata.confidence,
      favorite: false,
      timesUsed: 0,
    });

    res.status(201).json({
      success: true,
      message: "Clothing uploaded successfully.",
      data: clothes,
    });
  } catch (error) {
    if (uploadedImage?.public_id) {
      await deleteImage(uploadedImage.public_id).catch(() => {});
    }
    console.error("Upload Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to analyze clothing.",
    });
  }
};

export const getMyWardrobe = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { category, search } = req.query;

    const filter: any = {
      user: req.user!.id,
    };

    if (typeof category === "string" && category.trim() && category !== "All") {
      filter.category = category.trim();
    }

    if (typeof search === "string" && search.trim()) {
      const regex = new RegExp(search.trim(), "i");
      filter.$or = [
        { name: regex },
        { category: regex },
        { subcategory: regex },
        { "color.primary": regex },
        { material: regex },
        { pattern: regex },
      ];
    }

    const clothes = await Clothes.find(filter).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: clothes.length,
      data: clothes,
    });
  } catch (error) {
    console.error("Fetch Wardrobe Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch wardrobe.",
    });
  }
};

export const deleteClothing = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const clothes = await Clothes.findOne({
      _id: id,
      user: req.user!.id,
    });

    if (!clothes) {
      res.status(404).json({
        success: false,
        message: "Clothing not found.",
      });
      return;
    }

    if (clothes.publicId) {
      await deleteImage(clothes.publicId).catch(() => {});
    }

    await clothes.deleteOne();

    res.status(200).json({
      success: true,
      message: "Clothing deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Clothing Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete clothing.",
    });
  }
};

export const updateClothing = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const clothes = await Clothes.findOne({
      _id: id,
      user: req.user!.id,
    });

    if (!clothes) {
      res.status(404).json({
        success: false,
        message: "Clothing not found.",
      });
      return;
    }

    const {
      name,
      category,
      subcategory,
      color,
      primaryColor,
      secondaryColor,
      colorHex,
      pattern,
      material,
      fit,
      sleeveType,
      neckType,
      formalityGrade,
      styleProfile,
      breathability,
      warmthRating,
      season,
      occasion,
      favorite,
    } = req.body;

    // Partial updates - preserve existing fields and NEVER overwrite imageUrl or publicId
    if (name !== undefined) clothes.name = name;
    
    if (category !== undefined) {
      let normCat = category;
      if (normCat === "Top") normCat = "Tops";
      if (normCat === "Bottom") normCat = "Bottoms";
      if (normCat === "Shoes") normCat = "Footwear";
      clothes.category = normCat;
    }

    if (subcategory !== undefined) clothes.subcategory = subcategory;

    // Handle Color Object or Flat Color Fields
    if (color !== undefined || primaryColor !== undefined || secondaryColor !== undefined || colorHex !== undefined) {
      const pColor = typeof color === "object" ? color?.primary : (primaryColor !== undefined ? primaryColor : (typeof color === "string" ? color : clothes.color.primary));
      const sColor = typeof color === "object" ? color?.secondary : (secondaryColor !== undefined ? secondaryColor : clothes.color.secondary);
      const hColor = typeof color === "object" ? color?.hex : (colorHex !== undefined ? colorHex : clothes.color.hex);

      clothes.color = {
        primary: pColor !== undefined ? pColor : (clothes.color.primary || "Indigo"),
        secondary: sColor !== undefined ? sColor : (clothes.color.secondary || ""),
        hex: hColor || clothes.color.hex || "#4f46e5",
      };
    }

    if (pattern !== undefined) {
      clothes.pattern = Array.isArray(pattern)
        ? pattern.map((s: string) => s.trim()).filter(Boolean)
        : (typeof pattern === "string" && pattern.trim() ? pattern.split(",").map((s: string) => s.trim()).filter(Boolean) : []);
    }
    if (material !== undefined) {
      clothes.material = Array.isArray(material)
        ? material.map((s: string) => s.trim()).filter(Boolean)
        : (typeof material === "string" && material.trim() ? material.split(",").map((s: string) => s.trim()).filter(Boolean) : []);
    }
    if (fit !== undefined) clothes.fit = fit;
    if (sleeveType !== undefined) clothes.sleeveType = sleeveType;
    if (neckType !== undefined) clothes.neckType = neckType;
    if (formalityGrade !== undefined) clothes.formalityGrade = formalityGrade;
    if (styleProfile !== undefined) clothes.styleProfile = styleProfile;
    if (breathability !== undefined) clothes.breathability = breathability;
    if (warmthRating !== undefined) clothes.warmthRating = warmthRating;
    if (season !== undefined) clothes.season = Array.isArray(season) ? season : [season];
    if (occasion !== undefined) clothes.occasion = Array.isArray(occasion) ? occasion : [occasion];
    if (favorite !== undefined) clothes.favorite = favorite;

    await clothes.save();

    res.status(200).json({
      success: true,
      message: "Clothing updated successfully.",
      data: clothes,
    });
  } catch (error) {
    console.error("Update Clothing Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update clothing.",
    });
  }
};

export const toggleFavorite = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const clothes = await Clothes.findOne({
      _id: id,
      user: req.user!.id,
    });

    if (!clothes) {
      res.status(404).json({
        success: false,
        message: "Clothing not found.",
      });
      return;
    }

    clothes.favorite = !clothes.favorite;
    await clothes.save();

    res.status(200).json({
      success: true,
      message: "Favorite updated successfully.",
      data: clothes,
    });
  } catch (error) {
    console.error("Toggle Favorite Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update favorite.",
    });
  }
};

export const getFavoriteClothes = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const clothes = await Clothes.find({
      user: req.user!.id,
      favorite: true,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: clothes.length,
      data: clothes,
    });
  } catch (error) {
    console.error("Get Favorites Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch favorite clothes.",
    });
  }
};

export const wearClothingItems = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { itemIds } = req.body;
    if (!Array.isArray(itemIds) || itemIds.length === 0) {
      res.status(400).json({ success: false, message: "itemIds array required" });
      return;
    }

    await Clothes.updateMany(
      { _id: { $in: itemIds }, user: req.user!.id },
      { $inc: { timesUsed: 1 } }
    );

    res.status(200).json({
      success: true,
      message: "Garment wear counts updated successfully.",
    });
  } catch (error) {
    console.error("Wear Clothing Items Error:", error);
    res.status(500).json({ success: false, message: "Failed to update wear counts." });
  }
};