import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import multer from "multer";
import { clerkMiddleware } from "@clerk/express";
import authRoutes from "./routes/auth.routes";
import clothesRoutes from "./routes/clothes.routes";
import dashboardRoutes from "./routes/dashboard.routes";

const app = express();

// CORS Allowed Origins Setup
const rawAllowedOrigins = process.env.CLIENT_URL || process.env.ALLOWED_ORIGINS || "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173";
const allowedOrigins = rawAllowedOrigins.split(",").map((url) => url.trim().replace(/\/$/, "")).filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser tools (curl, postman, mobile) with no Origin header
      if (!origin) return callback(null, true);

      const normalizedOrigin = origin.trim().replace(/\/$/, "");
      if (allowedOrigins.includes(normalizedOrigin) || process.env.NODE_ENV !== "production") {
        return callback(null, true);
      }

      console.warn(`[CORS Blocked] Origin '${origin}' is not in allowed list:`, allowedOrigins);
      return callback(new Error(`CORS policy violation: Origin '${origin}' is not allowed.`));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(helmet());
app.use(compression());
app.use(cookieParser());
app.use(clerkMiddleware({ authorizedParties: allowedOrigins }));
app.use(morgan("dev"));

// API Routes
app.use("/api/clothes", clothesRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Root Health Check Endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Veloura Backend API is Running!",
    environment: process.env.NODE_ENV || "development",
  });
});

// Global Production Error Handling Middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("[Global Error Handler]:", err);

  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File size limit exceeded. Maximum allowed size is 5MB.",
      });
    }
    return res.status(400).json({
      success: false,
      message: err.message || "File upload error.",
    });
  }

  if (err.message && err.message.includes("Only JPG, JPEG, PNG")) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  const statusCode = err.status || err.statusCode || 500;
  const message =
    process.env.NODE_ENV === "production"
      ? "An internal server error occurred."
      : err.message || "An internal server error occurred.";

  return res.status(statusCode).json({
    success: false,
    message,
  });
});

export default app;