import mongoose from "mongoose";

// Feedback Model
const feedbackSchema = new mongoose.Schema({
  feedbackId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
  rollNo: { type: String, required: true, ref: 'Student' },
  facultyId: { type: String, required: true, ref: 'Faculty' },
  courseCode: { type: String, required: true, ref: 'Course' },
  isActive: { type: Boolean },
//   sections: [
//     {
//       questionID: {
//         type: mongoose.Schema.Types.ObjectId,
//         required: true,
//         ref: 'Question' // assuming a Question model
//       }, // check question is
//       rating: {
//         type: Number,
//         required: true,
//         min: 1,
//         max: 5,
//         default: 3
//       }
//     }
//   ], // if questions are coming from backend
  comments: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Feedback = mongoose.model('Feedback', feedbackSchema);