import mongoose from "mongoose";

// Application Document Schema (for documents requiring approval)
const applicationDocumentSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  documentType: { type: String, enum: ['Bonafide', 'Passport'], required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  certificateNumber: { type: String },
  approvalDetails: {
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    approvalDate: { type: Date },
    remarks: { type: String }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Bonafide Application Schema
const bonafideSchema = new mongoose.Schema({
  applicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'ApplicationDocument', required: true },
  currentSemester: { type: Number, required: true },
  purpose: { 
    type: String, 
    required: true, 
    enum: [
      'Bank Account Opening',
      'Passport Application',
      'Visa Application',
      'Education Loan',
      'Scholarship Application',
      'Other'
    ]
  },
  otherReason: { 
    type: String,
    required: function() {
      return this.purpose === 'Other';
    }
  },
  otherDetails: { type: String }
});

// Viewable Document Schema (for direct access documents)
const viewableDocumentSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  documentType: { type: String, enum: ['ID Card', 'Fee Details'], required: true },
  metadata: {
    generatedDate: { type: Date, default: Date.now },
    validUntil: { type: Date }
  }
});

// Fee Details Schema
const feeDetailsSchema = new mongoose.Schema({
  viewableDocumentId: { type: mongoose.Schema.Types.ObjectId, ref: 'ViewableDocument', required: true },
  semester: { type: Number, required: true },
  academicYear: { type: String, required: true },
  transactions: [{
    amount: { type: Number, required: true },
    feeType: { type: String, required: true },
    paidDate: { type: Date, required: true },
    transactionId: { type: String }
  }]
});

// ID Card Schema
const idCardSchema = new mongoose.Schema({
  viewableDocumentId: { type: mongoose.Schema.Types.ObjectId, ref: 'ViewableDocument', required: true },
  cardNumber: { type: String, required: true, unique: true },
  validFrom: { type: Date, required: true },
  validUntil: { type: Date, required: true }
});

// Create and export the models
export const ApplicationDocument = mongoose.model('ApplicationDocument', applicationDocumentSchema);
export const Bonafide = mongoose.model('Bonafide', bonafideSchema);
export const ViewableDocument = mongoose.model('ViewableDocument', viewableDocumentSchema);
export const FeeDetails = mongoose.model('FeeDetails', feeDetailsSchema);
export const IDCard = mongoose.model('IDCard', idCardSchema);