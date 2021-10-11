import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
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
    type: Date,
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
    rating: {
      type: Number,
      default: 0,
      required: true,
    },
  },
});

videoSchema.static("formatHashtags", (hashtags) => {
  return hashtags
    .split(",")
    .map((word) => (word.startsWith("#") ? word : `#${word}`));
});

const videoModel = mongoose.model("videoModel", videoSchema);
export default videoModel;
