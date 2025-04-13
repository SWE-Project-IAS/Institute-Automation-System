import mongoose from 'mongoose';

// Student Model
const studentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    email: { type: String, required: true, unique: true },
    rollNo: { type: String, unique: true, required: true },
    fatherName: { type: String, required: true },
    motherName: { type: String, required: true },
    department: { type: String, required: true },
    semester: { type: Number, required: true, default: 1 },
    batch: { type: String, required: true },
    program: { type: String, enum: ['BTech', 'MTech', 'PhD', 'BDes', 'MDes'], required: true },
    status: { 
      type: String, 
      enum: ['active', 'inactive', 'graduated', 'suspended'], 
      default: 'active' 
    },
    hostel: {
      type: String,
      enum: ['Brahmaputra', 'Lohit', 'Disang', 'Subansiri', 'Dhansiri', 'Kapili', 'Manas', 'Dihing', 'Barak', 'Siang', 'Kameng', 'Umiam', 'Married Scholar'],
      required: true
    },
    roomNo: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });
  
  export const Student = mongoose.model('Student', studentSchema);