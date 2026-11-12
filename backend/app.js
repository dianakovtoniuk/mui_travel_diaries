import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import userRouter from "./routes/user-routes.js";
import postRouter from "./routes/post-routes.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

const app = express();

const allowedOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(helmet());
app.use(cors(allowedOrigins.length ? { origin: allowedOrigins } : undefined));
app.use(express.json({ limit: "100kb" }));

// Slow down brute force on login / signup
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many attempts, please try again later" },
});

app.get("/health", (req, res) => res.status(200).json({ status: "ok" }));
app.use("/user/login", authLimiter);
app.use("/user/signup", authLimiter);
app.use("/user", userRouter);
app.use("/posts", postRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
