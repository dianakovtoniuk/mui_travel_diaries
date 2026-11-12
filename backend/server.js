import "dotenv/config";
import mongoose from "mongoose";
import app from "./app.js";

const { MONGODB_URI, JWT_SECRET } = process.env;
const PORT = process.env.PORT || 5000;

if (!MONGODB_URI || !JWT_SECRET) {
  console.error("Missing MONGODB_URI or JWT_SECRET. Copy .env.example to .env and fill it in.");
  process.exit(1);
}

try {
  await mongoose.connect(MONGODB_URI);
  app.listen(PORT, () => console.log(`API listening on port ${PORT}`));
} catch (err) {
  console.error("Failed to start:", err.message);
  process.exit(1);
}
