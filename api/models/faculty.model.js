import mongoose from "mongoose";
import { facultyCourseSchema } from "./course.model.js";

// Faculty Model
const facultySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  department: { type: String, required: true },
  designation: { type: String, required: true },
  courses:  [facultyCourseSchema],
  specialization: { type: String },
  qualifications: [{ type: String }],
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'on-leave'], 
    default: 'active' 
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Faculty = mongoose.model('Faculty', facultySchema);