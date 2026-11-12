import jwt from "jsonwebtoken";
import { HttpError } from "../utils/httpError.js";

export const signToken = (userId) =>
  jwt.sign({ sub: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

export const requireAuth = (req, res, next) => {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return next(new HttpError(401, "Authentication required"));
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.sub;
    return next();
  } catch {
    return next(new HttpError(401, "Invalid or expired token"));
  }
};
