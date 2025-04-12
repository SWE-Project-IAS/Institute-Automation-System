import mongoose from "mongoose";

// User Model
const userSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  refreshToken:{type:String, required:true},
  contactNo: { type: String },
  profilePicture: { type: String },
  signature: { type: String },
  address: { type: String },
  dateOfBirth: { type: Date },
  bloodGroup: { type: String },
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const User = mongoose.model('User', userSchema);