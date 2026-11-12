import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, required: true, trim: true, maxlength: 5000 },
    image: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true, maxlength: 120 },
    date: { type: Date, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);
