import mongoose from "mongoose";

// Fee Breakdown Model
const feeBreakdownSchema = new mongoose.Schema({
  breakdownId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
  semester: { type: Number },
  program: { type: String, enum: ['BTech', 'MTech', 'PhD', 'BDes', 'MDes'], required: true },
  tuitionFees: { type: Number, required: true },
  examinationFees: { type: Number, required: true },
  registrationFee: { type: Number, required: true },
  gymkhanaFee: { type: Number, required: true },
  medicalFee: { type: Number, required: true },
  hostelFund: { type: Number, required: true },
  hostelRent: { type: Number, required: true },
  elecAndWater: { type: Number, required: true },
  messAdvance: { type: Number, required: true },
  studentsBrotherhoodFund: { type: Number, required: true },
  acadFacilitiesFee: { type: Number, required: true },
  hostelMaintenance: { type: Number, required: true },
  studentsTravelAssistance: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Fee Details Model
const feeDetailsSchema = new mongoose.Schema({
  rollNo: { type: String, required: true, ref: 'Student' },
  semester: { type: Number },
  isPaid: { type: Boolean, default: false },
  breakdownId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'FeeBreakdown' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const FeeBreakdown = mongoose.model('FeeBreakdown', feeBreakdownSchema);
export const FeeDetails = new mongoose.model('FeeDetails', feeDetailsSchema);