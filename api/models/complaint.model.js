import mongoose from "mongoose";

// Complaint Model
const complaintSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  title: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true,
  },
  phoneNumber: {
    type: String, 
    required: true,
    defualt: ""
  },
  status: {
    type: String,
    required: true,
    enum: ['Pending', 'In Progress', 'Resolved'],
    default: 'Pending'
  },
  description: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: false,
    default: ""
  },
  imageUrls: {
    type: [String],
    required: false,
    default: []
  },
  category: {
    type: String,
    required: true
  },
  subCategory: {
    type: String,
    required: true
  },
  assignedName: {
    type: String,
    required: false,
    default: null
  },
  assignedContact: {
    type: String,
    required: false,
    default: null
  },
  assignedStaffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SupportStaff",
    required: false,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
});

const SupportStaffSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  categories: [{ 
    type: String,
    required: false 
  }],
  subCategories: [{ 
    type: String,
    required: false 
  }],
  assignedComplaints: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Complaint"
  }],
  resolvedComplaints: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Complaint"
  }],
  isAvailable: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Virtual property to calculate availability based on assigned complaints
SupportStaffSchema.virtual('isBusy').get(function() {
  return this.assignedComplaints && this.assignedComplaints.length >= 5; // Staff is busy if they have 5 or more active complaints
});

// Virtual property to get total resolved complaints count
SupportStaffSchema.virtual('totalResolved').get(function() {
  return this.resolvedComplaints ? this.resolvedComplaints.length : 0;
});

// Set toJSON option to include virtuals
SupportStaffSchema.set('toJSON', { virtuals: true });
SupportStaffSchema.set('toObject', { virtuals: true });

export const Complaint = mongoose.model("Complaint", complaintSchema);
export const SupportStaff = mongoose.model("SupportStaff", SupportStaffSchema);
