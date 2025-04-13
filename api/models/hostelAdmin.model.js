import mongoose from "mongoose";
const hostelTypeEnum= ["kameng","subansiri","lohit","disang","brahmaputra","dihing","kapili","manas","dhansiri","barak"];

// Hostel Admin Model
const hostelAdminSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   hostel: {
//     type: String,
//     required: true,
//     enum: hostelTypeEnum,
//     default: "Not Assigned"
//   },
//   designation: { type: String, required: true },
    email: { type: String, required: true, unique: true },
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'on-leave'], 
    default: 'active' 
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const HostelAdmin = mongoose.model('HostelAdmin', hostelAdminSchema);