import mongoose from 'mongoose';

// Student Model
const studentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    registerNo: { type: String, unique: true, required: true },
    department: { type: String, required: true },
    semester: { type: Number, required: true },
    batch: { type: String, required: true },
    program: { type: String, required: true },
    status: { 
      type: String, 
      enum: ['active', 'inactive', 'graduated', 'suspended'], 
      default: 'active' 
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });
  
  export const Student = mongoose.model('Student', studentSchema);