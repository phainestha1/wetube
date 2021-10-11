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
});

userSchema.pre("save", async function () {
  console.log("user password:", this.password);
  this.password = await bcrypt.hash(this.password, 5);
  console.log("hashed one:", this.password);
});

const userModel = mongoose.model("userModel", userSchema);
export default userModel;
