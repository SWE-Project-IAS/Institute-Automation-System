import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../index.js';
import { closeDB, resetDBConnectionForTests } from '../database/mongoDb.js';
import { Course, FacultyCourse, StudentCourse } from '../models/course.model.js';
import { Faculty } from '../models/faculty.model.js';
import { User } from '../models/user.model.js';
import { Student } from '../models/student.model.js';

const TEST_DB_URI = process.env.TEST_DB_URI;
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

describe('Faculty Grades Controller Integration Tests', () => {
    let testUser;
    let testFaculty;
    let testCourse;
    let testStudentUser1;
    let testStudentUser2;
    let testStudent1;
    let testStudent2;
    let facultyCourse;
    let studentCourse1;
    let studentCourse2;

    // Setup test data before each test
    beforeEach(async () => {
        // Create test faculty user
        testUser = new User({
            name: 'Test Faculty',
            email: 'testfaculty@example.com',
            role: 'faculty',
            password: 'hashedpassword123',
            refreshToken: 'refreshToken'
        });
        await testUser.save();

        // Create test faculty
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

        // Create test course
        testCourse = new Course({
            courseCode: 'CS501',
            courseName: 'Advanced Database Systems',
            department: 'Computer Science',
            slot: 'A',
            credits: 4,
            maxIntake: 60
        });
        await testCourse.save();

        // Create faculty-course mapping
        facultyCourse = new FacultyCourse({
            facultyId: testUser._id.toString(),
            courseCode: 'CS501',
            year: 2025,
            session: 'Winter Semester',
            status: 'Ongoing'
        });
        await facultyCourse.save();

        // Create test student users
        testStudentUser1 = new User({
            name: 'Test Student 1',
            email: 'teststudent1@example.com',
            role: 'student',
            password: 'hashedpassword123',
            refreshToken: 'refreshToken1'
        });
        await testStudentUser1.save();

        testStudentUser2 = new User({
            name: 'Test Student 2',
            email: 'teststudent2@example.com',
            role: 'student',
            password: 'hashedpassword123',
            refreshToken: 'refreshToken2'
        });
        await testStudentUser2.save();

        // Create test students with all required properties
        testStudent1 = new Student({
            userId: testStudentUser1._id,
            email: 'teststudent1@example.com',
            rollNo: 'CS2021001',
            fatherName: 'John Doe Sr.',
            motherName: 'Jane Doe',
            department: 'Computer Science',
            semester: 5,
            batch: '2021',
            program: 'BTech',
            status: 'active',
            hostel: 'Brahmaputra',
            roomNo: 'A-101'
        });
        await testStudent1.save();

        testStudent2 = new Student({
            userId: testStudentUser2._id,
            email: 'teststudent2@example.com',
            rollNo: 'CS2021002',
            fatherName: 'Robert Smith',
            motherName: 'Mary Smith',
            department: 'Computer Science',
            semester: 5,
            batch: '2021',
            program: 'BTech',
            status: 'active',
            hostel: 'Lohit',
            roomNo: 'B-203'
        });
        await testStudent2.save();

        // Create student-course mappings
        studentCourse1 = new StudentCourse({
            rollNo: 'CS2021001',
            courseId: 'CS501',
            creditOrAudit: 'Credit',
            semester: '5',
            status: 'Approved',
            grade: null,
            isCompleted: false
        });
        await studentCourse1.save();

        studentCourse2 = new StudentCourse({
            rollNo: 'CS2021002',
            courseId: 'CS501',
            creditOrAudit: 'Credit',
            semester: '5',
            status: 'Approved',
            grade: null,
            isCompleted: false
        });
        await studentCourse2.save();
    });

    // Clean up after each test
    afterEach(async () => {
        await User.deleteMany({});
        await Faculty.deleteMany({});
        await Course.deleteMany({});
        await FacultyCourse.deleteMany({});
        await Student.deleteMany({});
        await StudentCourse.deleteMany({});
    });

    describe('GET /api/grades/faculty/:userId/courses', () => {
        it('should fetch all ongoing courses for a faculty', async () => {
            const response = await agent
                .get(`/api/grades/faculty/${testUser._id}/courses`);

            expect(response.status).toBe(200);
            expect(response.body.courses).toBeTruthy();
            expect(response.body.courses.length).toBe(1);
            expect(response.body.courses[0].courseCode).toBe('CS501');
            expect(response.body.courses[0].courseName).toBe('Advanced Database Systems');
        });

        it('should return 404 if faculty not found', async () => {
            const nonExistentId = new mongoose.Types.ObjectId();
            const response = await agent
                .get(`/api/grades/faculty/${nonExistentId}/courses`);

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Faculty not found');
        });

        it('should return 404 if faculty has no ongoing courses', async () => {
            // Update faculty course status to "Completed"
            await FacultyCourse.updateOne(
                { facultyId: testUser._id },
                { $set: { status: 'Completed' } }
            );

            const response = await agent
                .get(`/api/grades/faculty/${testUser._id}/courses`);

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('No courses found for this faculty');
        });
    });

    describe('GET /api/grades/:courseId/getStudents', () => {
        it('should fetch all approved students for a course', async () => {
            const response = await agent
                .get(`/api/grades/CS501/getStudents`);

            expect(response.status).toBe(200);
            expect(response.body.students).toBeTruthy();
            expect(response.body.students.length).toBe(2);
            expect(response.body.students[0].rollNumber).toBe('CS2021001');
            expect(response.body.students[1].rollNumber).toBe('CS2021002');
        });

        it('should return 404 if course not found', async () => {
            const response = await agent
                .get(`/api/grades/NONEXISTENT/getStudents`);

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Course not found');
        });

        it('should return empty array if no students enrolled in the course', async () => {
            // Delete all student course mappings
            await StudentCourse.deleteMany({ courseId: 'CS501' });

            const response = await agent
                .get(`/api/grades/CS501/getStudents`);

            expect(response.status).toBe(200);
            expect(response.body.students).toEqual([]);
        });
    });

    describe('POST /api/grades/:courseId/submitGrades', () => {
        it('should successfully submit grades for all students', async () => {
            const gradesData = {
                faculty: testUser._id,
                students: [
                    { rollNumber: 'CS2021001', grade: 'A' },
                    { rollNumber: 'CS2021002', grade: 'B' }
                ]
            };

            const response = await agent
                .post('/api/grades/CS501/submitGrades')
                .send(gradesData);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Grades submitted successfully');

            // Verify student grades were updated
            const updatedStudent1 = await StudentCourse.findOne({ rollNo: 'CS2021001', courseId: 'CS501' });
            const updatedStudent2 = await StudentCourse.findOne({ rollNo: 'CS2021002', courseId: 'CS501' });

            expect(updatedStudent1.grade).toBe('A');
            expect(updatedStudent1.isCompleted).toBe(true);
            expect(updatedStudent2.grade).toBe('B');
            expect(updatedStudent2.isCompleted).toBe(true);

            // Verify faculty course status was updated
            const updatedFacultyCourse = await FacultyCourse.findOne({ 
                courseCode: 'CS501',
                facultyId: testUser._id
            });
            expect(updatedFacultyCourse.status).toBe('Completed');
        });

        it('should handle non-existent student roll numbers gracefully', async () => {
            const gradesData = {
                faculty: testUser._id,
                students: [
                    { rollNumber: 'CS2021001', grade: 'A' },
                    { rollNumber: 'NONEXISTENT', grade: 'C' }
                ]
            };

            const response = await agent
                .post('/api/grades/CS501/submitGrades')
                .send(gradesData);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Grades submitted successfully');

            // Verify the existing student's grade was updated
            const updatedStudent = await StudentCourse.findOne({ rollNo: 'CS2021001', courseId: 'CS501' });
            expect(updatedStudent.grade).toBe('A');
        });

        it('should handle when faculty course mapping does not exist', async () => {
            // Delete faculty course mapping
            await FacultyCourse.deleteOne({ courseCode: 'CS501', facultyId: testUser._id });

            const gradesData = {
                faculty: testUser._id,
                students: [
                    { rollNumber: 'CS2021001', grade: 'A' },
                    { rollNumber: 'CS2021002', grade: 'B' }
                ]
            };

            const response = await agent
                .post('/api/grades/CS501/submitGrades')
                .send(gradesData);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Grades submitted successfully');

            // Verify student grades were still updated
            const updatedStudent1 = await StudentCourse.findOne({ rollNo: 'CS2021001', courseId: 'CS501' });
            expect(updatedStudent1.grade).toBe('A');
        });
    });
});
