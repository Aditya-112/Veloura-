import { Request, Response } from "express";
import { AuthRequest } from "../types/auth.types";

import Clothes from "../models/clothes.model";

import { uploadImage,deleteImage } from "../services/cloudinary.service";
import { analyzeClothing } from "../services/gemini.service";
import { ClothingCategory } from "../types/clothing.types";

export const uploadClothes = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: "No image uploaded.",
      });
      return;
    }

    // Step 1: Upload to Cloudinary
    const uploadedImage = await uploadImage(req.file);

    // Step 2: Analyze using Gemini
    const metadata = await analyzeClothing(
      req.file.buffer,
      req.file.mimetype
    );


  const clothes = await Clothes.create({
  user: req.user!.id,

  imageUrl: uploadedImage.secure_url,
  publicId: uploadedImage.public_id,

  category: metadata.category,
  subcategory: metadata.subcategory,

  color: {
    primary: metadata.primaryColor,
    secondary: metadata.secondaryColor,
  },

  pattern: metadata.pattern,
  material: metadata.material,

  season: metadata.season,
  occasion: metadata.occasion,

  favorite: false,
  timesUsed: 0,
});

    // Return everything to frontend
    res.status(201).json({
      success: true,
      message: "Clothing uploaded successfully.",
      data:clothes,
    });

  } catch (error) {
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
    const { category } = req.query;
    const selectedCategory =
  typeof category === "string" ? category.trim() : undefined;



    const filter: {
  user: string;
  category?: ClothingCategory;
} = {
  user: req.user!.id,
};

if (
  selectedCategory === "Top" ||
  selectedCategory === "Bottom" ||
  selectedCategory === "Shoes" ||
  selectedCategory === "Outerwear" ||
  selectedCategory === "Accessories"
) {
  filter.category = selectedCategory;
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

export const deleteClothing = async(
  req:AuthRequest,
  res: Response
): Promise<void> =>{
  try{
    const{ id } = req.params;

    const clothes = await Clothes.findOne({
      _id:id,
      user: req.user!.id,
    });

    if(!clothes){
      res.status(404).json({
        success:false,
        message:"Clothing not found.",
      });
      return;
    }
    await deleteImage(clothes.publicId);
    await clothes.deleteOne();
    
    res.status(200).json({
      success:true,
      message: "Clothing deleted successfully.",
    });
  } catch(error){
    console.error("Delete Clothing Error:",error);
    
    res.status(500).json({
      success:false,
      message:"Failed to delete clothing.",
    });
  }
};
    
export const updateClothing = async(
  req: AuthRequest,
  res: Response
): Promise<void> =>{
  try{
    const { id } = req.params;

    const clothes = await Clothes.findOne({
      _id:id,
      user:req.user!.id,
    });
    if(!clothes){
      res.status(404).json({
        success :false,
        message:"Clothing not found.",
      });
      return;
    }
    const{
      category,
      subcategory,
      primaryColor,
      secondaryColor,
      pattern,
      material,
      season,
      occasion,
      favorite,
    }=req.body;

   clothes.category = category;
    clothes.subcategory = subcategory;

    clothes.color = {
      primary: primaryColor,
      secondary: secondaryColor,
    };

    clothes.pattern = pattern;
    clothes.material = material;

    clothes.season = season;
    clothes.occasion = occasion;

    clothes.favorite = favorite;

    await clothes.save();

    res.status(200).json({
      success:true,
       message: "Clothing updated successfully.",
      data: clothes,
    });
  }catch(error){
    console.error("Update Clothing Error:", error);
    
  res.status(500).json({
      success: false,
      message: "Failed to update clothing.",
    });
  }
};


export const toggleFavorite = async(
  req: AuthRequest,
  res: Response
): Promise<void> =>{
  try{
    const { id } = req.params;

    const clothes = await Clothes.findOne({
      _id:id,
      user: req.user!.id,
    });

    if (!clothes) {
      res.status(404).json({
        success: false,
        message: "Clothing not found.",
      });
      return;
    }
    //if fav-> falese => fav = false and same for true
    clothes.favorite = !clothes.favorite;

    await clothes.save();

    res.status(200).json({
      success:true,
      message:"Favorite uploaded successfully.",
      data: clothes,
    });

  }catch(error){
    console.error("Toggle Favorite Error:",error);

    res.status(500).json({
      success:false,
      message:"Failed to update favorite.",
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