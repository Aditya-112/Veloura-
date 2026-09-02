import { Response } from "express";
import User from "../models/user.model";
import { AuthRequest } from "../types/auth.types";
import { uploadImage } from "../services/cloudinary.service";

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?.id).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "Profile fetched successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { name, firstName, lastName, avatar, gender } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;

    if (firstName || lastName) {
      user.name = `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.name;
    } else if (name) {
      user.name = name;
    }

    if (gender !== undefined) user.gender = gender;

    if (avatar !== undefined) {
      user.avatar = avatar;
    }

    await user.save();

    const { password: _, ...updatedUser } = user.toObject();
    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    return res.status(500).json({ message: "Failed to update profile" });
  }
};

export const uploadAvatar = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    const uploadResult = await uploadImage(req.file);
    const avatarUrl = uploadResult.secure_url;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.avatar = avatarUrl;
    await user.save();

    const { password: _, ...updatedUser } = user.toObject();
    return res.status(200).json({
      message: "Avatar uploaded successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Upload Avatar Error:", error);
    return res.status(500).json({ message: "Failed to upload avatar" });
  }
};