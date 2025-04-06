import mongoose from "mongoose";

// Faculty Model
const facultySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  department: { type: String, required: true },
  designation: { type: String, required: true },
  courses:  [courseSchema],
  specialization: { type: String },
  qualifications: [{ type: String }],
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'on-leave'], 
    default: 'active' 
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});


// Course Model
const courseSchema = new mongoose.Schema({
  courseName: { type: String, required: true },
  courseCode: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  semester: { type: Number, required: true },
  credits: { type: Number, required: true },
  facultyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty' },
  description: { type: String },
  prerequisites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'upcoming'], 
    default: 'active' 
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Faculty = mongoose.model('Faculty', facultySchema);
export const Course = mongoose.model('Course', courseSchema);


// Assignment Model
// const assignmentSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   description: { type: String },
//   courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
//   facultyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty', required: true },
//   dueDate: { type: Date, required: true },
//   maxMarks: { type: Number, required: true },
//   attachments: [{ type: String }],
//   status: { 
//     type: String, 
//     enum: ['active', 'draft', 'closed'], 
//     default: 'active' 
//   },
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now }
// });

// // Submission Model
// const submissionSchema = new mongoose.Schema({
//   assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
//   studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
//   submissionFile: { type: String, required: true },
//   submissionDate: { type: Date, default: Date.now },
//   remarks: { type: String },
//   status: { 
//     type: String, 
//     enum: ['submitted', 'late', 'rejected'], 
//     default: 'submitted' 
//   },
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now }
// });

// // AssignmentGrade Model
// const assignmentGradeSchema = new mongoose.Schema({
//   submissionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Submission', required: true },
//   facultyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty', required: true },
//   obtainedMarks: { type: Number, required: true },
//   feedback: { type: String },
//   gradedAt: { type: Date, default: Date.now },
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now }
// });

// // Grade Model
// const gradeSchema = new mongoose.Schema({
//   studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
//   courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
//   semester: { type: Number, required: true },
//   grade: { 
//     type: String, 
//     enum: ['AS', 'AA', 'AB', 'BB', 'BC', 'CC', 'CD', 'DD'], 
//     required: true 
//   },
//   creditPoints: { type: Number, required: true },
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now }
// });

