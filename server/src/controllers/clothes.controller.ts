import { Request, Response } from "express";
import Clothes from "../models/clothes.model";
import { uploadImage } from "../services/cloudinary.service";
import { AuthRequest } from "../types/auth.types";

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

    const {
      category,
      subcategory,
      pattern,
      material,
      season,
      occasion,
      primaryColor,
      secondaryColor,
    } = req.body;

    const uploadedImage = await uploadImage(req.file);

    const cloth = new Clothes({
      user: req.user?.id,

      imageUrl: uploadedImage.secure_url,
      publicId: uploadedImage.public_id,

      category,
      subcategory,

      color: {
        primary: primaryColor,
        secondary: secondaryColor || "",
      },

      pattern: pattern ? [pattern] : [],
      material: material ? [material] : [],
      season: season ? [season] : [],
      occasion: occasion ? [occasion] : [],

      favorite: false,
      timesUsed: 0,
    });

    const savedCloth = await cloth.save();

    res.status(201).json({
      success: true,
      message: "Clothing uploaded successfully.",
      data: savedCloth,
    });

  } catch (error) {
    console.error("Upload Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to upload clothing.",
    });
  }
};

export const getMyWardrobe = async(
  req:AuthRequest,
  res:Response
): Promise<void>=>{
  try{
    const clothes = await Clothes.find({
      user: req.user?.id,
    }).sort({
       createdAt: -1
    });

    res.status(200).json({
      success: true,
      count:clothes.length,
      data:clothes,
    });
  }catch(error){
    console.error("Fetch Wardrobe Error:",error);

    res.status(500).json({
      success:false,
      message:"Failed to fetch wardrobe.",
    });
  }
};
