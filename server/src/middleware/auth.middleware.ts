import { Response, NextFunction } from "express";
import { getAuth, clerkClient } from "@clerk/express";
import { AuthRequest } from "../types/auth.types";
import User from "../models/user.model";

const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId: clerkUserId } = getAuth(req);

    if (!clerkUserId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized access. Valid Clerk authentication token required.",
      });
      return;
    }

    // Idempotent MongoDB User lookup & provisioning by clerkUserId ONLY
    let user = await User.findOne({ clerkUserId });
    if (!user) {
      let email = `${clerkUserId}@clerk.user`;
      let name = "User";
      let firstName = "";
      let lastName = "";
      let avatar = "";
      try {
        const cu = await clerkClient.users.getUser(clerkUserId);
        email = cu.emailAddresses?.[0]?.emailAddress || email;
        firstName = cu.firstName || "";
        lastName = cu.lastName || "";
        name = `${firstName} ${lastName}`.trim() || email.split("@")[0];
        avatar = cu.imageUrl || "";
      } catch (err) {
        console.error("Clerk user details fetch warning:", err);
      }

      user = await User.findOneAndUpdate(
        { clerkUserId },
        {
          $setOnInsert: {
            clerkUserId,
            email,
            name,
            firstName,
            lastName,
            avatar,
            outfitsGenerated: 0,
            outfitGenerationDates: [],
          },
        },
        { upsert: true, new: true }
      );
    }

    req.user = user;
    return next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
    return;
  }
};

export default authMiddleware;