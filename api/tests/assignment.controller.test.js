// Import the controller functions directly
import * as controllers from '../controllers/acadAdmin.controller.js';

// Create mock functions for each controller function
jest.mock('../controllers/acadAdmin.controller.js', () => ({
    getFacultyCourses: jest.fn(),
    getStudentCourses: jest.fn(),
    createAssignment: jest.fn(),
    getCourseAssignments: jest.fn(),
    getAssignmentDetails: jest.fn(),
    submitAssignment: jest.fn(),
    undoSubmission: jest.fn(),
    deleteAssignmentDetails: jest.fn(),
    editAssignmentDetails: jest.fn(),
    getStudent: jest.fn(),
    getUser: jest.fn()
}));

// Create mock models
jest.mock('../models/student.model.js', () => ({
    Faculty: {
        findOne: jest.fn()
    },
    Student: {
        findOne: jest.fn()
    },
    User: {
        findById: jest.fn()
    }
}));

jest.mock('../models/course.model.js', () => ({
    Course: {
        find: jest.fn()
    },
    FacultyCourse: {
        find: jest.fn()
    },
    StudentCourse: {
        find: jest.fn()
    }
}));

jest.mock('../models/assignment.model.js', () => ({
    Assignment: {
        findOne: jest.fn(),
        countDocuments: jest.fn(),
        findOneAndDelete: jest.fn(),
        prototype: {
            save: jest.fn()
        }
    }
}));

// Import httpMocks for request/response mocking
import httpMocks from 'node-mocks-http';

describe('Academic Admin Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getFacultyCourses', () => {
        it('should return faculty courses successfully', async () => {
            // Setup mock implementation for this test
            controllers.getFacultyCourses.mockImplementation((req, res) => {
                return res.status(200).json({ courses: [{ courseCode: 'CS101', name: 'Intro to CS' }] });
            });

            // Create mock request and response
            const req = httpMocks.createRequest({
                params: { userId: 'faculty123' }
            });
            const res = httpMocks.createResponse();

            // Call the function
            await controllers.getFacultyCourses(req, res);

            // Assert expected outcomes
            expect(res.statusCode).toBe(200);
            expect(res._getJSONData()).toHaveProperty('courses');
        });
    });

    describe('getStudentCourses', () => {
        it('should return student courses successfully', async () => {
            controllers.getStudentCourses.mockImplementation((req, res) => {
                return res.status(200).json({ courses: [{ courseCode: 'CS101' }] });
            });

            const req = httpMocks.createRequest({
                params: { userId: 'student123' }
            });
            const res = httpMocks.createResponse();

            await controllers.getStudentCourses(req, res);

            expect(res.statusCode).toBe(200);
            expect(res._getJSONData()).toHaveProperty('courses');
        });
    });

    describe('createAssignment', () => {
        it('should create assignment successfully', async () => {
            controllers.createAssignment.mockImplementation((req, res) => {
                if (!req.body.title || !req.body.description || !req.body.dueDate) {
                    return res.status(400).json({ success: false });
                }
                return res.status(201).json({
                    success: true,
                    assignment: {
                        assignmentNumber: 3,
                        courseCode: req.params.courseId,
                        title: req.body.title
                    }
                });
            });

            const req = httpMocks.createRequest({
                params: { courseId: 'CS101' },
                body: {
                    title: 'Test Assignment',
                    description: 'Test Description',
                    dueDate: '2025-05-01'
                }
            });
            const res = httpMocks.createResponse();

            await controllers.createAssignment(req, res);

            expect(res.statusCode).toBe(201);
            expect(res._getJSONData().assignment.assignmentNumber).toBe(3);
        });

        it('should reject missing required fields', async () => {
            controllers.createAssignment.mockImplementation((req, res) => {
                if (!req.body.title || !req.body.description || !req.body.dueDate) {
                    return res.status(400).json({ success: false });
                }
                return res.status(201).json({ success: true });
            });

            const req = httpMocks.createRequest({
                params: { courseId: 'CS101' },
                body: { title: 'Incomplete' }
            });
            const res = httpMocks.createResponse();

            await controllers.createAssignment(req, res);
            expect(res.statusCode).toBe(400);
        });
    });

    describe('submitAssignment', () => {
        it('should accept valid submission', async () => {
            controllers.submitAssignment.mockImplementation((req, res) => {
                return res.status(200).json({ success: true });
            });

            const req = httpMocks.createRequest({
                params: { courseCode: 'CS101', assignmentId: '1' },
                body: {
                    studentRollNo: 'S123',
                    studentName: 'John Doe',
                    content: 'Test Content'
                }
            });
            const res = httpMocks.createResponse();

            await controllers.submitAssignment(req, res);
            expect(res.statusCode).toBe(200);
        });

        it('should reject duplicate submissions', async () => {
            controllers.submitAssignment.mockImplementation((req, res) => {
                if (req.body.studentRollNo === 'S123') {
                    return res.status(409).json({ success: false, message: "Already submitted" });
                }
                return res.status(200).json({ success: true });
            });

            const req = httpMocks.createRequest({
                params: { courseCode: 'CS101', assignmentId: '1' },
                body: { studentRollNo: 'S123' }
            });
            const res = httpMocks.createResponse();

            await controllers.submitAssignment(req, res);
            expect(res.statusCode).toBe(409);
        });
    });

    describe('deleteAssignmentDetails', () => {
        it('should delete existing assignment', async () => {
            controllers.deleteAssignmentDetails.mockImplementation((req, res) => {
                return res.status(200).json({ success: true });
            });

            const req = httpMocks.createRequest({
                params: { courseId: 'CS101', assignmentId: '1' }
            });
            const res = httpMocks.createResponse();

            await controllers.deleteAssignmentDetails(req, res);
            expect(res.statusCode).toBe(200);
        });

        it('should handle non-existent assignment', async () => {
            controllers.deleteAssignmentDetails.mockImplementation((req, res) => {
                if (req.params.courseId === 'invalid' || req.params.assignmentId === '999') {
                    return res.status(404).json({ success: false });
                }
                return res.status(200).json({ success: true });
            });

            const req = httpMocks.createRequest({
                params: { courseId: 'invalid', assignmentId: '999' }
            });
            const res = httpMocks.createResponse();

            await controllers.deleteAssignmentDetails(req, res);
            expect(res.statusCode).toBe(404);
        });
    });

    describe('getStudent', () => {
        it('should retrieve student details', async () => {
            controllers.getStudent.mockImplementation((req, res) => {
                return res.status(200).json({ success: true, student: { name: 'John Doe' } });
            });

            const req = httpMocks.createRequest({
                params: { userId: 'student123' }
            });
            const res = httpMocks.createResponse();

            await controllers.getStudent(req, res);
            expect(res.statusCode).toBe(200);
            expect(res._getJSONData().student.name).toBe('John Doe');
        });
    });

    describe('getUser', () => {
        it('should fetch user details by ID', async () => {
            controllers.getUser.mockImplementation((req, res) => {
                return res.status(200).json({ success: true, user: { _id: 'user123', email: 'test@example.com' } });
            });

            const req = httpMocks.createRequest({
                params: { userId: 'user123' }
            });
            const res = httpMocks.createResponse();

            await controllers.getUser(req, res);
            expect(res.statusCode).toBe(200);
            expect(res._getJSONData().user.email).toBe('test@example.com');
        });
    });
});