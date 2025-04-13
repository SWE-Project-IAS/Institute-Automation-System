import mongoose from "mongoose";

// Complaint Model
const complaintSchema = new mongoose.Schema({
  complaintId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  title: { type: String },
  date: { type: Date, required: true, default: Date.now },
  status: { type: String, required: true, enum: ['Under Review', 'Resolved'], default: 'Under Review' },
  description: { type: String },
  images: {type: String },
//   address: { type: String },
  category: { type: String, required: true }, // enum?
  subCategory: { type: String, required: true }, // enum?
  assignedName: { type: String },
  assignedContact: { type: Number },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Complaint = mongoose.model('Complaint', complaintSchema);