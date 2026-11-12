import mongoose from "mongoose";
import { HttpError } from "./httpError.js";

export const isNonEmptyString = (v, max = Infinity) =>
  typeof v === "string" && v.trim().length > 0 && v.trim().length <= max;

export const isEmail = (v) =>
  typeof v === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

export const isHttpUrl = (v) => {
  if (typeof v !== "string") return false;
  try {
    const u = new URL(v.trim());
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
};

export const isValidDate = (v) =>
  v !== undefined && v !== null && v !== "" && !Number.isNaN(new Date(v).getTime());

export const assertObjectId = (id) => {
  if (!mongoose.isValidObjectId(id)) throw new HttpError(400, "Invalid id");
};

// Validates post fields. With partial=true only provided fields are checked.
export const validatePostBody = (body, { partial = false } = {}) => {
  const errors = [];
  const has = (k) => body[k] !== undefined;

  if (!partial || has("title")) {
    if (!isNonEmptyString(body.title, 120))
      errors.push("Title is required (max 120 characters)");
  }
  if (!partial || has("description")) {
    if (!isNonEmptyString(body.description, 5000))
      errors.push("Description is required (max 5000 characters)");
  }
  if (!partial || has("location")) {
    if (!isNonEmptyString(body.location, 120))
      errors.push("Location is required (max 120 characters)");
  }
  if (!partial || has("image")) {
    if (!isHttpUrl(body.image)) errors.push("Image must be a valid http(s) URL");
  }
  if (!partial || has("date")) {
    if (!isValidDate(body.date)) errors.push("Date is required and must be valid");
  }

  if (errors.length) throw new HttpError(422, errors.join(". "));
};
