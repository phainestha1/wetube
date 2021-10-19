import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "userModel",
  },
  ownerName: { type: String },
  ownerAvatarUrl: { type: String },
  video: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "videoModel",
  },
  createdAt: { type: String, required: true, default: Date.now },
});

const commentModel = mongoose.model("commentModel", commentSchema);
export default commentModel;
