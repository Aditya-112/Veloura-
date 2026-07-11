import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import authRoutes from"./routes/auth.routes";
import clothesRoutes from "./routes/clothes.routes";

const app = express();

// MIDDLEWARES
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(cookieParser());
app.use(morgan("dev"));
app.use("/api/clothes", clothesRoutes);

//TEST ROUTE 
app.get("/", (req, res) => {
  res.send(" Veloura Backend is Running!");
});

app.use("/api/auth", authRoutes);
export default app;