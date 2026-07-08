import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../types/auth.types";
const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    let token: string | undefined;

// From Header
if (req.headers.authorization?.startsWith("Bearer ")) {
  token = req.headers.authorization.split(" ")[1];
}

// From Cookie
if (!token) {
  token = req.cookies.token;
}

if (!token) {
   res.status(401).json({
    message: "Unauthorized",
  });
  return;
}

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    );

    req.user = decoded;

    next();
  } catch (error) {
    res.status(401).json({
      message: "Invalid Token",
    });
    return;
  }
};
export default authMiddleware;