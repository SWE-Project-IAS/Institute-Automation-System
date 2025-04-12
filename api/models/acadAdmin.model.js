import mongoose from 'mongoose';

// Academic Admin Model
const acadAdminSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  designation: { type: String, required: true },
  qualifications: [{ type: String }],
//   registrationRequests :[registrationRequestSchema],
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'on-leave'], 
    default: 'active' 
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const AcadAdmin = mongoose.model('AcadAdmin', acadAdminSchema);