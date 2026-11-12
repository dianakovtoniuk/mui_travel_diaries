import Post from "../models/Post.js";
import User from "../models/User.js";
import { HttpError } from "../utils/httpError.js";
import { assertObjectId, validatePostBody } from "../utils/validate.js";

const pick = (body, keys) =>
  Object.fromEntries(keys.filter((k) => body[k] !== undefined).map((k) => [k, body[k]]));

export const getAllPosts = async (req, res) => {
  const posts = await Post.find().sort({ date: -1 }).populate("user", "name");
  res.status(200).json({ posts });
};

export const getPostById = async (req, res) => {
  assertObjectId(req.params.id);
  const post = await Post.findById(req.params.id).populate("user", "name");
  if (!post) throw new HttpError(404, "No post found");
  res.status(200).json({ post });
};

export const addPost = async (req, res) => {
  const body = req.body || {};
  validatePostBody(body);

  const author = await User.findById(req.userId);
  if (!author) throw new HttpError(404, "User not found");

  const post = await Post.create({
    ...pick(body, ["title", "description", "image", "location"]),
    date: new Date(body.date),
    user: author._id,
  });

  try {
    await User.updateOne({ _id: author._id }, { $push: { posts: post._id } });
  } catch (err) {
    // keep both collections consistent
    await Post.deleteOne({ _id: post._id });
    throw err;
  }

  res.status(201).json({ post });
};

export const updatePost = async (req, res) => {
  assertObjectId(req.params.id);
  const body = req.body || {};
  validatePostBody(body, { partial: true });

  const post = await Post.findById(req.params.id);
  if (!post) throw new HttpError(404, "No post found");
  if (post.user.toString() !== req.userId)
    throw new HttpError(403, "You can only edit your own diaries");

  Object.assign(post, pick(body, ["title", "description", "image", "location"]));
  if (body.date !== undefined) post.date = new Date(body.date);
  await post.save();

  res.status(200).json({ message: "Updated successfully", post });
};

export const deletePost = async (req, res) => {
  assertObjectId(req.params.id);

  const post = await Post.findById(req.params.id);
  if (!post) throw new HttpError(404, "No post found");
  if (post.user.toString() !== req.userId)
    throw new HttpError(403, "You can only delete your own diaries");

  await Post.deleteOne({ _id: post._id });
  await User.updateOne({ _id: post.user }, { $pull: { posts: post._id } });

  res.status(200).json({ message: "Deleted successfully" });
};
