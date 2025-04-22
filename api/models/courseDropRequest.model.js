import mongoose from 'mongoose';

const courseDropRequestSchema = new mongoose.Schema({
    studentId: { type: String, required: true, ref: 'Student' },
    rollNo: { type: String, required: true },
    courseId: { type: String, required: true, ref: 'Course' },
    courseName: { type: String, required: true },
    requestDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    remarks: { type: String, default: '' },
    semester: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const globalDropSchema = new mongoose.Schema({
    isActive: { type: Boolean, default: false },
    endDate: { type: Date, default: null },
});

export const CourseDropRequest = mongoose.model('CourseDropRequest', courseDropRequestSchema);
export const GlobalDrop = mongoose.model('GlobalDrop', globalDropSchema);
