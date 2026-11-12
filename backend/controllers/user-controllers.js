import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { signToken } from "../middleware/auth.js";
import { HttpError } from "../utils/httpError.js";
import {
  assertObjectId,
  isEmail,
  isNonEmptyString,
} from "../utils/validate.js";

const publicUser = (u) => ({ id: u._id, name: u.name, email: u.email });

export const getAllUsers = async (req, res) => {
  const users = await User.find().select("name posts");
  res.status(200).json({ users });
};

// Public profile of any user: no email, no password
export const getUserById = async (req, res) => {
  assertObjectId(req.params.id);
  const user = await User.findById(req.params.id)
    .select("name posts")
    .populate({ path: "posts", options: { sort: { date: -1 } } });
  if (!user) throw new HttpError(404, "No user found");
  res.status(200).json({ user });
};

// Profile of the logged-in user
export const getMe = async (req, res) => {
  const user = await User.findById(req.userId)
    .select("name email posts")
    .populate({ path: "posts", options: { sort: { date: -1 } } });
  if (!user) throw new HttpError(404, "No user found");
  res.status(200).json({ user });
};

export const signup = async (req, res) => {
  const { name, email, password } = req.body || {};

  if (!isNonEmptyString(name, 60))
    throw new HttpError(422, "Name is required (max 60 characters)");
  if (!isEmail(email)) throw new HttpError(422, "A valid email is required");
  if (typeof password !== "string" || password.length < 6 || password.length > 72)
    throw new HttpError(422, "Password must be 6 to 72 characters long");

  const normalizedEmail = email.trim().toLowerCase();
  if (await User.exists({ email: normalizedEmail }))
    throw new HttpError(409, "User with this email already exists");

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password: await bcrypt.hash(password, 10),
  });

  res.status(201).json({
    message: "Signup successful",
    token: signToken(user._id.toString()),
    user: publicUser(user),
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body || {};

  if (!isEmail(email) || typeof password !== "string" || !password)
    throw new HttpError(422, "Email and password are required");

  const user = await User.findOne({ email: email.trim().toLowerCase() }).select(
    "+password"
  );

  // Same message for unknown email and wrong password: don't leak which exists
  const ok = user && (await bcrypt.compare(password, user.password));
  if (!ok) throw new HttpError(401, "Incorrect email or password");

  res.status(200).json({
    message: "Login successful",
    token: signToken(user._id.toString()),
    user: publicUser(user),
  });
};
