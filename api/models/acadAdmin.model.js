import mongoose from 'mongoose';

// Academic Admin Model
const acadAdminSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  designation: { type: String, required: true },
  qualifications: [{ type: String }],
//   registrationRequests :[registrationRequestSchema],
  feeReceipts : [feeReceiptSchema],
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'on-leave'], 
    default: 'active' 
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Fee Receipt Model
const feeReceiptSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  semester: { type: Number, required: true },
  amount: { type: Number, required: true },
  paymentDate: { type: Date, required: true },
  paymentMethod: { 
    type: String, 
    enum: ['cash', 'online', 'cheque'], 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['paid', 'pending', 'overdue'], 
    default: 'pending' 
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});


export const AcadAdmin = mongoose.model('AcadAdmin', acadAdminSchema);

