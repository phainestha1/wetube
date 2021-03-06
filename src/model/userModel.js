import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  avatarUrl: { type: String },
  username: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  socialOnly: { type: Boolean, default: false },
  password: { type: String },
  location: { type: String },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "commentModel",
    },
  ],
  videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "videoModel" }],
});

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 5);
  }
});

const userModel = mongoose.model("userModel", userSchema);
export default userModel;
