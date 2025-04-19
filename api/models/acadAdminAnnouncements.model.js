import mongoose from 'mongoose';

const AcadAdminAnnouncementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide announcement title'],
    trim: true,
  },
  content: {
    type: String,
    required: [true, 'Please provide announcement content'],
  },
  importance: {
    type: String,
    enum: ['Critical', 'High', 'Medium', 'Low'],
    default: 'Medium',
  },
  date: {
    type: Date,
    default: Date.now,
  },
  postedBy: {
    type: String,
    required: true,
  },  
  audienceType: {
    type: [String], 
    default: ["All"]
  },
  targetEmails: {
    type: [String],
    default: []
  },
  targetGroups: {
    allUniversity: {
      type: Boolean,
      default: true
    },
    students: {
      type: Boolean,
      default: false
    },
    faculty: {
      type: Boolean,
      default: false
    },
    departments: {
      type: [String],
      default: [] 
    },
    programs: {
      type: [String],
      default: []
    },
    semester: {
      type: String,
      default: ""
    },
    specificEmails: {
      type: String,
      default: ""
    },
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp on each save
AcadAdminAnnouncementSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export const AcadAdminAnnouncement = mongoose.model('AcadAdminAnnouncement', AcadAdminAnnouncementSchema);