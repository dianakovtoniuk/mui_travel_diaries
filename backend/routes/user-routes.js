import { Router } from "express";
import {
  getAllUsers,
  getMe,
  getUserById,
  login,
  signup,
} from "../controllers/user-controllers.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../utils/httpError.js";

const userRouter = Router();

userRouter.post("/signup", asyncHandler(signup));
userRouter.post("/login", asyncHandler(login));
userRouter.get("/me", requireAuth, asyncHandler(getMe));
userRouter.get("/", asyncHandler(getAllUsers));
userRouter.get("/:id", asyncHandler(getUserById));

export default userRouter;
