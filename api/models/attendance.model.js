import mongoose from "mongoose";

// Attendance Model
const attendanceSchema = new mongoose.Schema({
  courseCode: { type: String, required: true, ref: 'Course' },
  rollNo: { type: String, required: true, ref: 'Student' },
  date: { type: Date, required: true, default: Date.now },
  isPresent: { type: Boolean, required: true, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Attendance = mongoose.model('Attendance', attendanceSchema);