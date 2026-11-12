import { Router } from "express";
import {
  addPost,
  deletePost,
  getAllPosts,
  getPostById,
  updatePost,
} from "../controllers/post-controller.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../utils/httpError.js";

const postRouter = Router();

postRouter.get("/", asyncHandler(getAllPosts));
postRouter.get("/:id", asyncHandler(getPostById));
postRouter.post("/", requireAuth, asyncHandler(addPost));
postRouter.put("/:id", requireAuth, asyncHandler(updatePost));
postRouter.delete("/:id", requireAuth, asyncHandler(deletePost));

export default postRouter;
