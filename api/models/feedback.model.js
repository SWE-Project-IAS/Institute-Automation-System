import mongoose from 'mongoose';

// Feedback schema
const feedbackSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Student', // Reference to the Student model
  },
  faculty: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Faculty', // Reference to the Faculty model
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Course', // Reference to the Course model
  },
  isActive: {
    type: Boolean,
    default: true, // Indicates if the feedback is active or not
  },
  ratings: [
    {
      questionId: {
        type: String, // Unique identifier for each question
        required: true,
      },
      rating: {
        type: Number, // Rating given by the student (1-5)
        required: true,
        min: 1,
        max: 5,
      },
    },
  ],
  comments: {
    type: String, // Additional comments provided by the student
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Timestamp when the feedback was created
  },
  updatedAt: {
    type: Date,
    default: Date.now, // Timestamp when the feedback was last updated
  },
});

// Add a compound index to ensure a student can only submit one feedback per course-faculty pair
feedbackSchema.index(
  { student: 1, course: 1, faculty: 1 },
  { unique: true }
);

export const Feedback = mongoose.model('Feedback', feedbackSchema);



const globalFeedbackConfigSchema = new mongoose.Schema({
  isActive: {
    type: Boolean,
    default: true, // Initial state will be inactive
    required: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

globalFeedbackConfigSchema.statics.getConfig = async function() {
  let config = await this.findOne();
  if (!config) config = await this.create({});
  return config;
};

export const GlobalFeedbackConfig = mongoose.model(
  'GlobalFeedbackConfig', 
  globalFeedbackConfigSchema
);