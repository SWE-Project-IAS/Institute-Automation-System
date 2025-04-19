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
    remarks: [{ type: String }]  // Changed from String to Array of Strings
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

// Passport Application Schema
const passportSchema = new mongoose.Schema({
  applicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'ApplicationDocument', required: true },
  applicationType: { type: String, enum: ['fresh', 'renewal'], required: true },
  placeOfBirth: { type: String, required: true },
  semester: { type: Number, required: true },
  mode: { type: String, enum: ['normal', 'tatkal'], required: true },
  tatkalReason: { 
    type: String,
    required: function() {
      return this.mode === 'tatkal';
    }
  },
  travelPlans: { type: String, enum: ['yes', 'no'], required: true },
  travelDetails: { 
    type: String,
    required: function() {
      return this.travelPlans === 'yes';
    }
  },
  fromDate: { 
    type: Date,
    required: function() {
      return this.travelPlans === 'yes';
    }
  },
  toDate: { 
    type: Date,
    required: function() {
      return this.travelPlans === 'yes';
    }
  }
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
export const IDCard = mongoose.model('IDCard', idCardSchema);
export const Passport = mongoose.model('Passport', passportSchema);