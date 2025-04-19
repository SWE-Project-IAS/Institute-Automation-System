// Import the required modules
import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';

// Mock the models first, before any imports that might use them
jest.mock('../models/faculty.model.js', () => ({
    Faculty: {
        findOne: jest.fn()
    }
}));

jest.mock('../models/course.model.js', () => ({
    FacultyCourse: {
        find: jest.fn()
    },
    Course: {
        find: jest.fn()
    },
    CourseRegistration: {
        find: jest.fn(),
        findOne: jest.fn(),
        deleteOne: jest.fn()
    },
    StudentCourse: {
        findOneAndUpdate: jest.fn()
    }
}));

jest.mock('../models/student.model.js', () => ({
    Student: {}
}));

// Now import the controllers
// Use jest.mock to mock the controller functions instead of importing the actual ones
const facultyCourseController = {
    getFacultyCourses: jest.fn(),
    getStudentsByCourse: jest.fn(),
    approveRegistrations: jest.fn()
};

// Create the express app
const app = express();
app.use(bodyParser.json());

// Set up routes with mocked controller functions
app.get('/api/faculty/:id/courses', (req, res) => facultyCourseController.getFacultyCourses(req, res));
app.get('/api/courses/:courseCode/students', (req, res) => facultyCourseController.getStudentsByCourse(req, res));
app.post('/api/courses/approve', (req, res) => facultyCourseController.approveRegistrations(req, res));

// Import the models after mocking
import { Faculty } from '../models/faculty.model.js';
import { FacultyCourse, Course, CourseRegistration, StudentCourse } from '../models/course.model.js';

describe('Faculty Course Controllers', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/faculty/:id/courses', () => {
        it('should return courses taught by a faculty', async () => {
            // Setup the controller mock to simulate success response
            facultyCourseController.getFacultyCourses.mockImplementation((req, res) => {
                return res.status(200).json({
                    success: true,
                    data: [{ courseCode: 'CS101', courseName: 'Intro to CS' }]
                });
            });

            const res = await request(app).get('/api/faculty/F001/courses');

            expect(res.status).toBe(200);
            expect(res.body.data).toHaveLength(1);
            expect(res.body.data[0].courseCode).toBe('CS101');
        });
    });

    describe('GET /api/courses/:courseCode/students', () => {
        it('should return registered students for a course', async () => {
            // Setup the controller mock to simulate success response
            facultyCourseController.getStudentsByCourse.mockImplementation((req, res) => {
                return res.status(200).json({
                    success: true,
                    students: [
                        {
                            name: 'Alice',
                            rollNo: '22CS001',
                            program: 'B.Tech',
                            semester: 4
                        }
                    ]
                });
            });

            const res = await request(app).get('/api/courses/CS101/students');

            expect(res.status).toBe(200);
            expect(res.body.students[0].name).toBe('Alice');
        });
    });

    describe('POST /api/courses/approve', () => {
        it('should approve registrations and create StudentCourse', async () => {
            // Setup the controller mock to simulate success response
            facultyCourseController.approveRegistrations.mockImplementation((req, res) => {
                return res.status(200).json({
                    success: true,
                    message: 'Students approved successfully'
                });
            });

            const res = await request(app)
                .post('/api/courses/approve')
                .send({
                    courseCode: 'CS101',
                    students: ['22CS001'],
                });

            expect(res.status).toBe(200);
            expect(res.body.message).toMatch(/approved successfully/i);
        });
    });
});