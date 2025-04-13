import mongoose from 'mongoose';

// Courses Model
const courseSchema = new mongoose.Schema({
    courseCode: { type: String, required: true, unique: true },
    courseName: { type: String, required: true },
    department: { type: String, required: true }, // enum?
    slot: { type: String },
    credits: { type: Number, required: true, default: 6 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Student Courses Model
const studentCourseSchema = new mongoose.Schema({
    rollNo: { type: String, required: true, ref: 'Student' },
    courseId: { type: String, required: true, ref: 'Course' },
    creditOrAudit: { type: String, enum: ['Credit', 'Audit'], required: true },
    semester: { type: String, required: true },
    status: { type: String, enum: ['Approved', 'Pending'], default: 'Pending' },
    grade: { type: String, default: null },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Faculty Courses Model
export const facultyCourseSchema = new mongoose.Schema({
    facultyId: { type: String, required: true, ref: 'Faculty' },
    courseCode: { type: String, required: true, ref: 'Course' },
    year: { type: Number, required: true },
    session: { type: String, enum: ['Winter Semester', 'Spring Semester', 'Summer Course'], required: true },
    status: { type: String, enum: ['Ongoing', 'Completed'], default: 'Ongoing' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Course Registration Model
const courseRegistrationSchema = new mongoose.Schema({
    courseCode: { type: String, required: true, ref: 'Course' },
    rollNo: { type: String, required: true, ref: 'Student' },
    creditOrAudit: { type: String, enum: ['Credit', 'Audit'], required: true },
    semester: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

export const Course = mongoose.model('Course', courseSchema);
export const StudentCourse = mongoose.model('StudentCourse', studentCourseSchema);
export const FacultyCourse = mongoose.model('FacultyCourse', facultyCourseSchema);
export const CourseRegistration = mongoose.model('CourseRegistration', courseRegistrationSchema);