import "express";
import multer from "multer";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
      };

      file?: multer.Multer.File;
    }
  }
}

export {};