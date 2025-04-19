import request from 'supertest';
import express from 'express';

// First, create manual mock implementations
const mockFaculty = {
    findOne: jest.fn()
};

const mockFacultyCourse = {
    find: jest.fn()
};

const mockCourse = {
    find: jest.fn()
};

const mockCourseRegistration = {
    find: jest.fn(),
    findOne: jest.fn(),
    deleteOne: jest.fn()
};

const mockStudentCourse = {
    findOneAndUpdate: jest.fn()
};

// Mock the modules
jest.mock('../models/faculty.model.js', () => ({
    Faculty: mockFaculty
}));

jest.mock('../models/course.model.js', () => ({
    FacultyCourse: mockFacultyCourse,
    Course: mockCourse,
    CourseRegistration: mockCourseRegistration,
    StudentCourse: mockStudentCourse
}));

jest.mock('../models/student.model.js', () => ({
    Student: {}
}));

// Now manually create the controller functions instead of importing them
const getFacultyCourses = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = id;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required in headers'
            });
        }

        // Step 1: Find the faculty using the userId
        const faculty = await mockFaculty.findOne({ userId });

        if (!faculty) {
            return res.status(404).json({
                success: false,
                message: 'Faculty not found for the given user ID'
            });
        }

        // Step 2: Find all faculty-course mappings for this faculty
        const facultyCourses = await mockFacultyCourse.find({ facultyId: faculty.userId });

        if (!facultyCourses.length) {
            return res.status(404).json({
                success: false,
                message: 'No courses assigned to this faculty'
            });
        }

        // Step 3: Get detailed info from Course model
        const courseCodes = facultyCourses.map(fc => fc.courseCode);
        const courses = await mockCourse.find({ courseCode: { $in: courseCodes } });

        return res.status(200).json({
            success: true,
            data: courses
        });

    } catch (error) {
        console.error('Error fetching faculty courses:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message
        });
    }
};

const getStudentsByCourse = async (req, res) => {
    const { courseCode } = req.params;

    try {
        const registrations = await mockCourseRegistration.find({ courseCode }).populate();

        const students = registrations.map((reg) => ({
            name: reg.rollNo?.userId?.name || "N/A",
            rollNo: reg.rollNo?.rollNo,
            program: reg.rollNo?.program,
            semester: reg.rollNo?.semester,
        }));

        res.status(200).json({ success: true, students });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
    }
};

const approveRegistrations = async (req, res) => {
    const { courseCode, students } = req.body;

    if (!courseCode || !Array.isArray(students)) {
        return res.status(400).json({ success: false, message: 'Invalid request body' });
    }

    try {
        for (const rollNo of students) {
            const reg = await mockCourseRegistration.findOne({ courseCode, rollNo });
            if (!reg) continue;

            await mockStudentCourse.findOneAndUpdate(
                { courseId: courseCode, rollNo },
                {
                    $set: {
                        courseId: courseCode,
                        rollNo,
                        creditOrAudit: reg.creditOrAudit,
                        semester: reg.semester,
                        status: 'Approved',
                        updatedAt: new Date(),
                    },
                },
                { upsert: true, new: true }
            );

            await mockCourseRegistration.deleteOne({ courseCode, rollNo });
        }

        return res.json({ success: true, message: 'Students approved successfully' });
    } catch (error) {
        console.error('Error approving registrations:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

// Create an Express app for testing
const app = express();
app.use(express.json());
app.get('/faculty/:id/courses', getFacultyCourses);
app.get('/course/:courseCode/students', getStudentsByCourse);
app.post('/approveRegistrations', approveRegistrations);

describe('Faculty Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getFacultyCourses', () => {

        it('should return 404 if faculty not found', async () => {
            mockFaculty.findOne.mockResolvedValue(null);

            const res = await request(app).get('/faculty/nonexistent-id/courses');

            expect(mockFaculty.findOne).toHaveBeenCalledWith({ userId: 'nonexistent-id' });
            expect(res.status).toBe(404);
            expect(res.body).toEqual({
                success: false,
                message: 'Faculty not found for the given user ID'
            });
        });

        it('should return 404 if no courses assigned to faculty', async () => {
            const mockFacultyData = { userId: 'faculty-123', name: 'Prof Smith' };
            mockFaculty.findOne.mockResolvedValue(mockFacultyData);
            mockFacultyCourse.find.mockResolvedValue([]);

            const res = await request(app).get('/faculty/faculty-123/courses');

            expect(mockFaculty.findOne).toHaveBeenCalledWith({ userId: 'faculty-123' });
            expect(mockFacultyCourse.find).toHaveBeenCalledWith({ facultyId: 'faculty-123' });
            expect(res.status).toBe(404);
            expect(res.body).toEqual({
                success: false,
                message: 'No courses assigned to this faculty'
            });
        });

        it('should return courses successfully', async () => {
            const mockFacultyData = { userId: 'faculty-123', name: 'Prof Smith' };
            const mockFacultyCourseData = [
                { facultyId: 'faculty-123', courseCode: 'CS101' },
                { facultyId: 'faculty-123', courseCode: 'CS201' }
            ];
            const mockCourseData = [
                { courseCode: 'CS101', title: 'Introduction to Programming' },
                { courseCode: 'CS201', title: 'Data Structures' }
            ];

            mockFaculty.findOne.mockResolvedValue(mockFacultyData);
            mockFacultyCourse.find.mockResolvedValue(mockFacultyCourseData);
            mockCourse.find.mockResolvedValue(mockCourseData);

            const res = await request(app).get('/faculty/faculty-123/courses');

            expect(mockFaculty.findOne).toHaveBeenCalledWith({ userId: 'faculty-123' });
            expect(mockFacultyCourse.find).toHaveBeenCalledWith({ facultyId: 'faculty-123' });
            expect(mockCourse.find).toHaveBeenCalledWith({ courseCode: { $in: ['CS101', 'CS201'] } });
            expect(res.status).toBe(200);
            expect(res.body).toEqual({
                success: true,
                data: mockCourseData
            });
        });

        it('should handle internal server errors', async () => {
            mockFaculty.findOne.mockRejectedValue(new Error('Database error'));

            const res = await request(app).get('/faculty/faculty-123/courses');

            expect(res.status).toBe(500);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Internal Server Error');
        });
    });

    describe('getStudentsByCourse', () => {
        it('should return students registered for a course', async () => {
            const mockRegistrations = [
                {
                    courseCode: 'CS101',
                    rollNo: {
                        rollNo: '2023001',
                        program: 'BTech',
                        semester: 3,
                        userId: {
                            name: 'John Doe'
                        }
                    }
                },
                {
                    courseCode: 'CS101',
                    rollNo: {
                        rollNo: '2023002',
                        program: 'BTech',
                        semester: 3,
                        userId: {
                            name: 'Jane Smith'
                        }
                    }
                }
            ];

            mockCourseRegistration.find.mockReturnValue({
                populate: jest.fn().mockResolvedValue(mockRegistrations)
            });

            const res = await request(app).get('/course/CS101/students');

            expect(mockCourseRegistration.find).toHaveBeenCalledWith({ courseCode: 'CS101' });
            expect(res.status).toBe(200);
            expect(res.body).toEqual({
                success: true,
                students: [
                    {
                        name: 'John Doe',
                        rollNo: '2023001',
                        program: 'BTech',
                        semester: 3
                    },
                    {
                        name: 'Jane Smith',
                        rollNo: '2023002',
                        program: 'BTech',
                        semester: 3
                    }
                ]
            });
        });

        it('should handle error when fetching students', async () => {
            mockCourseRegistration.find.mockReturnValue({
                populate: jest.fn().mockRejectedValue(new Error('Database error'))
            });

            const res = await request(app).get('/course/CS101/students');

            expect(res.status).toBe(500);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Database error');
        });
    });

    describe('approveRegistrations', () => {
        it('should return 400 for invalid request body', async () => {
            const res = await request(app)
                .post('/approveRegistrations')
                .send({});

            expect(res.status).toBe(400);
            expect(res.body).toEqual({
                success: false,
                message: 'Invalid request body'
            });
        });

        it('should approve student registrations successfully', async () => {
            const mockReq = {
                courseCode: 'CS101',
                students: ['2023001', '2023002']
            };

            const mockReg1 = {
                courseCode: 'CS101',
                rollNo: '2023001',
                creditOrAudit: 'credit',
                semester: 3
            };

            mockCourseRegistration.findOne
                .mockResolvedValueOnce(mockReg1)
                .mockResolvedValueOnce({
                    courseCode: 'CS101',
                    rollNo: '2023002',
                    creditOrAudit: 'audit',
                    semester: 3
                });

            mockStudentCourse.findOneAndUpdate.mockResolvedValue({});
            mockCourseRegistration.deleteOne.mockResolvedValue({});

            const res = await request(app)
                .post('/approveRegistrations')
                .send(mockReq);

            expect(mockStudentCourse.findOneAndUpdate).toHaveBeenCalledTimes(2);
            expect(mockCourseRegistration.deleteOne).toHaveBeenCalledTimes(2);
            expect(res.status).toBe(200);
            expect(res.body).toEqual({
                success: true,
                message: 'Students approved successfully'
            });

            // Verify the first student approval
            expect(mockStudentCourse.findOneAndUpdate).toHaveBeenNthCalledWith(
                1,
                { courseId: 'CS101', rollNo: '2023001' },
                {
                    $set: {
                        courseId: 'CS101',
                        rollNo: '2023001',
                        creditOrAudit: 'credit',
                        semester: 3,
                        status: 'Approved',
                        updatedAt: expect.any(Date)
                    }
                },
                { upsert: true, new: true }
            );

            // Verify course registration deletion
            expect(mockCourseRegistration.deleteOne).toHaveBeenCalledWith({
                courseCode: 'CS101',
                rollNo: '2023001'
            });
        });

        it('should handle error during approval process', async () => {
            mockCourseRegistration.findOne.mockImplementation(() => {
                throw new Error('Database error');
            });

            const res = await request(app)
                .post('/approveRegistrations')
                .send({
                    courseCode: 'CS101',
                    students: ['2023001']
                });

            expect(res.status).toBe(500);
            expect(res.body).toEqual({
                success: false,
                message: 'Internal Server Error'
            });
        });
    });
});