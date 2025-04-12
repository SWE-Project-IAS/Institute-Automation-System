import mongoose from "mongoose";

// Hostel Leave Model
const hostelLeaveSchema = new mongoose.Schema({
//   applicationId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
  rollNo: { type: String, required: true, ref: 'Student' },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  reason: { type: String },
  status: { type: String, required: true, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  remarks: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Hostel Transfer Model
const hostelTransferSchema = new mongoose.Schema({
  applicationId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
  rollNo: { type: String, required: true, ref: 'Student' },
  // availableHostels: { type: String } // from where will this come?
  currentHostel: {
    type: String,
    enum: ['Brahmaputra', 'Lohit', 'Disang', 'Subansiri', 'Dhansiri', 'Kapili', 'Manas', 'Dihing', 'Barak', 'Siang', 'Kameng', 'Umiam', 'Married Scholar'],
    required: true
  }, // can be fetched from roll number
  requestedHostel: {
    type: String,
    enum: ['Brahmaputra', 'Lohit', 'Disang', 'Subansiri', 'Dhansiri', 'Kapili', 'Manas', 'Dihing', 'Barak', 'Siang', 'Kameng', 'Umiam', 'Married Scholar'],
    required: true
  },
  status: { type: String, required: true, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  remarks: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const HostelTransfer = mongoose.model('HostelTransfer', hostelTransferSchema);
export const HostelLeave = mongoose.model('HostelLeave', hostelLeaveSchema);