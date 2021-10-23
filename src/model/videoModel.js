import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  fileUrl: { type: String, required: true },
  thumbUrl: { type: String },
  title: {
    type: String,
    required: true,
    maxLength: 80,
  },
  description: {
    type: String,
    required: true,
    maxLength: 1000,
  },
  createdAt: {
    type: String,
    required: true,
    default: Date.now,
  },
  hashtags: [
    {
      type: String,
      trim: true,
    },
  ],
  meta: {
    views: {
      type: Number,
      default: 0,
      required: true,
    },
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "commentModel",
    },
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "userModel",
  },
});

videoSchema.static("formatHashtags", (hashtags) => {
  return hashtags
    .split(",")
    .map((word) => (word.startsWith("#") ? word : `#${word}`));
});

const videoModel = mongoose.model("videoModel", videoSchema);
export default videoModel;
