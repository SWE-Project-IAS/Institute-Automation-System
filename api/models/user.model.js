import mongoose from "mongoose";

// User Model
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  refreshToken:{type:String,required:true},
  contactNo: { type: String },
  profilePicture: { type: String },
  address: { type: String },
  dateOfBirth: { type: Date },
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const User = mongoose.model('User', userSchema);



// // Notification Model
// const notificationSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   title: { type: String, required: true },
//   description: { type: String },
//   type: { 
//     type: String, 
//     enum: ['assignment', 'course', 'system', 'personal'], 
//     required: true 
//   },
//   isRead: { type: Boolean, default: false },
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now }
// });

// // Registration Request Model
// const registrationRequestSchema = new mongoose.Schema({
//   studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
//   courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
//   status: { 
//     type: String, 
//     enum: ['pending', 'approved', 'rejected'], 
//     default: 'pending' 
//   },
//   requestDate: { type: Date, default: Date.now },
//   approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty' },
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now }
// });

// // Attendance Record Model
// const attendanceRecordSchema = new mongoose.Schema({
//   studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
//   courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
//   date: { type: Date, required: true },
//   status: { 
//     type: String, 
//     enum: ['present', 'absent', 'late'], 
//     required: true 
//   },
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now }
// });

// // ID Card Model
// const idCardSchema = new mongoose.Schema({
//   studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
//   cardNumber: { type: String, unique: true, required: true },
//   issueDate: { type: Date, required: true },
//   expiryDate: { type: Date, required: true },
//   status: { 
//     type: String, 
//     enum: ['active', 'expired', 'lost'], 
//     default: 'active' 
//   },
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now }
// });

// // Transcript Model
// const transcriptSchema = new mongoose.Schema({
//   studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
//   semester: { type: Number, required: true },
//   cgpa: { type: Number, required: true },
//   totalCredits: { type: Number, required: true },
//   remarks: { type: String },
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now }
// });

// // Bonafide Certificate Model
// const bonafideCertificateSchema = new mongoose.Schema({
//   studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
//   purpose: { type: String, required: true },
//   issuedDate: { type: Date, default: Date.now },
//   status: { 
//     type: String, 
//     enum: ['pending', 'issued', 'rejected'], 
//     default: 'pending' 
//   },
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now }
// });