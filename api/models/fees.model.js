import mongoose from "mongoose";

// Fee Breakdown Model
const feeBreakdownSchema = new mongoose.Schema({
  semesterParity: { type: Number, required: true },
  program: {
    type: String,
    enum: ["BTech", "MTech", "PhD", "BDes", "MDes"],
    required: true,
  },
  isActive: { type: Boolean, default: false },
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
  updatedAt: { type: Date, default: Date.now },
});

// Drop indexes on connection
// mongoose.connection.on("connected", async () => {
//   try {
//     await mongoose.connection.db.collection("feebreakdowns").dropIndexes();
//     console.log("Indexes dropped successfully");
//   } catch (error) {
//     console.log("No existing indexes to drop or collection does not exist");
//   }
// });

// Add a simple index without unique constraint
feeBreakdownSchema.index({ program: 1, semesterParity: 1 }, { unique: true });

// Fee Details Model
const feeDetailsSchema = new mongoose.Schema(
  {
    rollNo: { type: String, required: true, ref: "Student" },
    semester: { type: Number, required: true },
    isPaid: { type: Boolean, default: false },
    // Embedded fee breakdown data instead of reference
    feeBreakdownData: {
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
      program: { type: String, required: true },
      semesterParity: { type: Number, required: true },
      totalAmount: { type: Number, required: true },
    },
    academicYear: { type: String, required: true },
    viewableDocumentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    transactionId: { type: String },
    paymentDetails: {
      razorpayOrderId: String,
      razorpayPaymentId: String,
      razorpaySignature: String,
      amount: Number,
      currency: String,
    },
    paidAt: { type: Date },
  },
  { timestamps: true }
);

// Create models
const FeeBreakdown =
  mongoose.models.FeeBreakdown ||
  mongoose.model("FeeBreakdown", feeBreakdownSchema);
const FeeDetails = mongoose.model("FeeDetails", feeDetailsSchema);

export { FeeBreakdown, FeeDetails };
