import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../index.js';
import { closeDB, resetDBConnectionForTests } from '../database/mongoDb.js';
import { Course, FacultyCourse, ProgramCourseMapping } from '../models/course.model.js';
import { Faculty } from '../models/faculty.model.js';
import { User } from '../models/user.model.js';

const TEST_DB_URI = 'mongodb+srv://kevintj916:VvLxpm85TJLuxr0B@institutionautomationcl.bn7xvyp.mongodb.net/?retryWrites=true&w=majority&appName=institutionAutomationclu';
const agent = request(app);

// Connect to test database before all tests
beforeAll(async () => {
    await resetDBConnectionForTests(TEST_DB_URI);
});

// Clean up after all tests
afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await closeDB();
});
// ... (previous imports remain same)

describe('POST /api/course/create-course', () => {
    let testUser;
    let testFaculty;

    // Setup remains same
    beforeEach(async () => {
        testUser = new User({
            name: 'Test Faculty',
            email: 'testfaculty@example.com',
            role: 'faculty',
            password: 'hashedpassword123',
            refreshToken: 'refreshToken'
        });
        await testUser.save();

        testFaculty = new Faculty({
            userId: testUser._id,
            email: 'testfaculty@example.com',
            department: 'Computer Science',
            designation: 'Associate Professor',
            yearOfJoining: 2020,
            specialization: 'Database Systems',
            status: 'active'
        });
        await testFaculty.save();
    });

    // Cleanup remains same
    afterEach(async () => {
        await Course.deleteMany({});
        await FacultyCourse.deleteMany({});
        await ProgramCourseMapping.deleteMany({});
        await Faculty.deleteMany({});
        await User.deleteMany({});
    });

    it('should create a new course successfully', async () => {
        const courseData = {
            courseCode: 'CS401',
            courseName: 'Advanced Database Systems',
            maxIntake: 60,
            slot: 'B',
            courseDepartment: 'Computer Science',
            credits: 4,
            faculty: testFaculty._id,
            year: 2025,
            session: 'Winter Semester', // Updated to match enum
            configurations: [
                {
                    program: 'BTech',
                    department: 'Computer Science',
                    semesters: ['5', '7'],
                    type: 'Elective'
                }
            ]
        };

        const response = await agent
            .post('/api/course/create-course')
            .send(courseData);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Course and mappings created successfully');
        expect(response.body.courseCode).toBe(courseData.courseCode);

        const savedCourse = await Course.findOne({ courseCode: courseData.courseCode });
        expect(savedCourse).toBeTruthy();
        expect(savedCourse.courseName).toBe(courseData.courseName);
    });

    it('should handle validation errors for required fields', async () => {
        const invalidCourseData = {
            courseName: 'Invalid Course',
            faculty: testFaculty._id
        };

        const response = await agent
            .post('/api/course/create-course')
            .send(invalidCourseData);

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Missing required course fields');
    });

    it('should handle invalid configurations', async () => {
        const courseData = {
            courseCode: 'CS402',
            courseName: 'Test Course',
            maxIntake: 60,
            slot: 'B',
            courseDepartment: 'Computer Science',
            credits: 4,
            faculty: testFaculty._id,
            year: 2025,
            session: 'Winter Semester', // Updated to match enum
            configurations: []
        };

        const response = await agent
            .post('/api/course/create-course')
            .send(courseData);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Course and mappings created successfully');
    });

    it('should handle duplicate course codes', async () => {
        // First create a course
        const existingCourse = new Course({
            courseCode: 'CS403',
            courseName: 'Existing Course',
            department: 'Computer Science',
            maxIntake: 50,
            slot: 'A',
            credits: 3
        });
        await existingCourse.save();

        const courseData = {
            courseCode: 'CS403',
            courseName: 'New Course',
            maxIntake: 60,
            slot: 'B',
            courseDepartment: 'Computer Science',
            credits: 4,
            faculty: testFaculty._id,
            year: 2025,
            session: 'Winter Semester', // Updated to match enum
            configurations: [
                {
                    program: 'BTech',
                    department: 'Computer Science',
                    semesters: ['5'],
                    type: 'Core'
                }
            ]
        };

        const response = await agent
            .post('/api/course/create-course')
            .send(courseData);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Course and mappings created successfully');

        const updatedCourse = await Course.findOne({ courseCode: 'CS403' });
        expect(updatedCourse).toBeTruthy();
        expect(updatedCourse.courseName).toBe('Existing Course');
    });
});
