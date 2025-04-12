import mongoose from "mongoose";

// Document Model
const documentSchema = new mongoose.Schema({
  documentId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
  documentType: { type: String, required: true, enum: ['Bonafide', 'Passport', 'Fee Details', 'ID Card'] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Bonafide Model
const bonafideSchema = new mongoose.Schema({
  documentId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true, ref: 'Document' },
  rollNo: { type: String, required: true, ref: 'Student' },
  reason: { type: String, required: true },
  status: { type: String, required: true, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  remarks: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Passport Model
const passportSchema = new mongoose.Schema({
  documentId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true, ref: 'Document' },
  rollNo: { type: String, required: true, ref: 'Student' },
  typeOfApplication: { type: String, required: true, enum: ['Fresh', 'Renewal'], default: 'Fresh' },
  modeOfApplication: { type: String, required: true, enum: ['Normal', 'Tatkal'], default: 'Normal' },
  tatkalReason: { type: String },
  travelInTwoMonths: { type: Boolean, required: true, default: false },
  placeAndPurpose: { type: String },
  fromDate: { type: Date },
  toDate: { type: Date },
  placeOfBirth: { type: String, required: true },
  status: { type: String, required: true, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  remarks: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Document = mongoose.model('Document', documentSchema);
export const Bonafide = mongoose.model('Bonafide', bonafideSchema);
export const Passport = mongoose.model('Passport', passportSchema);