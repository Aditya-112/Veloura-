import "dotenv/config";
import app from "./app";
import connectDB from "./config/db";

const PORT = Number(process.env.PORT) || 8000;

// Connect Database
connectDB();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});