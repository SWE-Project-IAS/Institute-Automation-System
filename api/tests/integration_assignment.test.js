import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../index.js';
import { closeDB, resetDBConnectionForTests } from '../database/mongoDb.js';
import { Course, FacultyCourse, StudentCourse } from '../models/course.model.js';
import { Faculty } from '../models/faculty.model.js';
import { Student } from '../models/student.model.js';
import { User } from '../models/user.model.js';
import { Assignment } from '../models/assignment.model.js';

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

describe('Assignment API Integration Tests', () => {
    let testUser;
    let testFaculty;
    let testStudent;
    let testStudentUser;
    let testCourse;
    let testAssignment;
    let testStudentCourse;

    // Setup before each test
    beforeEach(async () => {
        // Create a faculty user
        testUser = new User({
            name: 'Test Faculty',
            email: 'testfaculty@example.com',
            role: 'faculty',
            password: 'hashedpassword123',
            refreshToken: 'refreshToken'
        });
        await testUser.save();

        // Create a faculty
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

        // Create a student user
        testStudentUser = new User({
            name: 'Test Student',
            email: 'teststudent@example.com',
            role: 'student',
            password: 'hashedpassword456',
            refreshToken: 'refreshToken'
        });
        await testStudentUser.save();

        // Create a student
        testStudent = new Student({
            userId: testStudentUser._id,
            email: 'teststudent@example.com',
            rollNo: 'CS20B001',
            fatherName: 'Test Father',
            motherName: 'Test Mother',
            department: 'Computer Science',
            semester: 5,
            batch: '2020',
            program: 'BTech',
            status: 'active',
            hostel: 'Brahmaputra',
            roomNo: 'A-101'
        });
        await testStudent.save();

        // Create a course
        testCourse = new Course({
            courseCode: 'CS501',
            courseName: 'Advanced Database Systems',
            department: 'Computer Science',
            maxIntake: 60,
            slot: 'B',
            credits: 4
        });
        await testCourse.save();

        // Associate faculty with course
        const facultyCourse = new FacultyCourse({
            facultyId: testUser._id,
            courseCode: testCourse.courseCode,
            session: 'Winter Semester',
            year: 2025,
            slot: 'B',
            status: 'Ongoing'
        });
        await facultyCourse.save();

        // Associate student with course
        testStudentCourse = new StudentCourse({
            rollNo: testStudent.rollNo,
            courseId: testCourse.courseCode,
            creditOrAudit: 'Credit',
            semester: '5',
            status: 'Approved'
        });
        await testStudentCourse.save();

        // Create a test assignment
        testAssignment = new Assignment({
            assignmentNumber: 1,
            courseCode: testCourse.courseCode,
            title: 'Test Assignment',
            description: 'This is a test assignment',
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
            submissions: [],
            createdAt: new Date(),
            updatedAt: new Date()
        });
        await testAssignment.save();
    });

    // Cleanup after each test
    afterEach(async () => {
        await Course.deleteMany({});
        await Faculty.deleteMany({});
        await Student.deleteMany({});
        await User.deleteMany({});
        await Assignment.deleteMany({});
        await FacultyCourse.deleteMany({});
        await StudentCourse.deleteMany({});
    });

    // Test for getting user
    describe('GET /api/assignment/:userId', () => {
        it('should get user details', async () => {
            const response = await agent
                .get(`/api/assignment/${testUser._id}`);
            
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.user).toBeTruthy();
            expect(response.body.user.name).toBe('Test Faculty');
            expect(response.body.user.email).toBe('testfaculty@example.com');
        });

        it('should handle user not found', async () => {
            const invalidUserId = new mongoose.Types.ObjectId();
            const response = await agent
                .get(`/api/assignment/${invalidUserId}`);
            
            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('User not found');
        });
    });

    // Test for getting student
    describe('GET /api/assignment/student/:userId', () => {
        it('should get student details', async () => {
            const response = await agent
                .get(`/api/assignment/student/${testStudent.userId}`);
            
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.student).toBeTruthy();
            expect(response.body.student.rollNo).toBe('CS20B001');
            expect(response.body.student.email).toBe('teststudent@example.com');
        });

        it('should handle student not found', async () => {
            const invalidUserId = new mongoose.Types.ObjectId();
            const response = await agent
                .get(`/api/assignment/student/${invalidUserId}`);
            
            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Student not found');
        });
    });

    // Test for getting faculty courses
    describe('GET /api/assignment/faculty/:userId/courses', () => {
        it('should get courses for faculty', async () => {
            const response = await agent
                .get(`/api/assignment/faculty/${testUser._id}/courses`);
            
            expect(response.status).toBe(200);
            expect(response.body.courses).toBeTruthy();
            expect(response.body.courses.length).toBe(1);
            expect(response.body.courses[0].courseCode).toBe(testCourse.courseCode);
            expect(response.body.courses[0].courseName).toBe(testCourse.courseName);
        });

        it('should handle faculty not found', async () => {
            const invalidUserId = new mongoose.Types.ObjectId();
            const response = await agent
                .get(`/api/assignment/faculty/${invalidUserId}/courses`);
            
            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Faculty not found');
        });

        it('should handle faculty with no courses', async () => {
            // Create a faculty with no courses
            const newUser = new User({
                name: 'Faculty No Courses',
                email: 'nocourses@example.com',
                role: 'faculty',
                password: 'hashedpassword789',
                refreshToken:'refreshToken'
            });
            await newUser.save();

            const newFaculty = new Faculty({
                userId: newUser._id,
                email: 'nocourses@example.com',
                department: 'Mathematics',
                designation: 'Professor',
                status: 'active'
            });
            await newFaculty.save();

            const response = await agent
                .get(`/api/assignment/faculty/${newUser._id}/courses`);
            
            expect(response.status).toBe(404);
            expect(response.body.message).toBe('No courses found for this faculty');
        });
    });

    // Test for getting student courses
    describe('GET /api/assignment/student/:userId/courses', () => {
        it('should get courses for student', async () => {
            const response = await agent
                .get(`/api/assignment/student/${testStudent.userId}/courses`);
            
            expect(response.status).toBe(200);
            expect(response.body.courses).toBeTruthy();
            expect(response.body.courses.length).toBe(1);
            expect(response.body.courses[0].courseCode).toBe(testCourse.courseCode);
        });

        it('should handle student not found', async () => {
            const invalidUserId = new mongoose.Types.ObjectId();
            const response = await agent
                .get(`/api/assignment/student/${invalidUserId}/courses`);
            
            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Student not found');
        });
    });

    // Test for getting course assignments
    describe('GET /api/assignment/course/:courseId/assignments', () => {
        it('should get assignments for a course', async () => {
            const response = await agent
                .get(`/api/assignment/course/${testCourse.courseCode}/assignments`);
            
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.count).toBe(1);
            expect(response.body.assignments.length).toBe(1);
            expect(response.body.assignments[0].title).toBe('Test Assignment');
            expect(response.body.assignments[0].courseCode).toBe(testCourse.courseCode);
        });

    });

    // Test for getting course details
    describe('GET /api/assignment/course/:courseCode', () => {
        it('should get course details', async () => {
            const response = await agent
                .get(`/api/assignment/course/${testCourse.courseCode}`);
            
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toBeTruthy();
            expect(response.body.data.courseCode).toBe(testCourse.courseCode);
            expect(response.body.data.courseName).toBe(testCourse.courseName);
        });

        it('should handle course not found', async () => {
            const response = await agent
                .get('/api/assignment/course/INVALID');
            
            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Course not found');
        });
    });

    // Test for creating assignments
    describe('POST /api/assignment/course/:courseId/assignments', () => {
        it('should create a new assignment', async () => {
            const assignmentData = {
                title: 'New Assignment',
                description: 'This is a new test assignment',
                dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() // 14 days from now
            };

            const response = await agent
                .post(`/api/assignment/course/${testCourse.courseCode}/assignments`)
                .send(assignmentData);
            
            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('Assignment created successfully');
            expect(response.body.assignment).toBeTruthy();
            expect(response.body.assignment.title).toBe(assignmentData.title);
            expect(response.body.assignment.assignmentNumber).toBe(2); // Should be incremented
            
            // Verify saved in database
            const savedAssignment = await Assignment.findOne({ title: assignmentData.title });
            expect(savedAssignment).toBeTruthy();
            expect(savedAssignment.courseCode).toBe(testCourse.courseCode);
        });

        it('should handle missing required fields', async () => {
            const invalidData = {
                title: 'Incomplete Assignment'
                // Missing description and dueDate
            };

            const response = await agent
                .post(`/api/assignment/course/${testCourse.courseCode}/assignments`)
                .send(invalidData);
            
            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Missing required fields.');
        });
    });

    // Test for getting assignment details
    describe('GET /api/assignment/:courseId/:assignmentId', () => {
        it('should get assignment details', async () => {
            const response = await agent
                .get(`/api/assignment/${testCourse.courseCode}/1`); // Assignment number 1
            
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.assignment).toBeTruthy();
            expect(response.body.assignment.title).toBe('Test Assignment');
            expect(response.body.assignment.assignmentNumber).toBe(1);
        });

        it('should handle assignment not found', async () => {
            const response = await agent
                .get(`/api/assignment/${testCourse.courseCode}/999`); // Non-existent assignment
            
            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Assignment not found');
        });
    });

    // Test for deleting assignments
    describe('DELETE /api/assignment/:courseId/:assignmentId', () => {
        it('should delete an assignment', async () => {
            const response = await agent
                .delete(`/api/assignment/${testCourse.courseCode}/1`);
            
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('Assignment deleted successfully');
            expect(response.body.assignment.assignmentNumber).toBe(1);
            
            // Verify deleted from database
            const deletedAssignment = await Assignment.findOne({ 
                courseCode: testCourse.courseCode,
                assignmentNumber: 1
            });
            expect(deletedAssignment).toBeNull();
        });

        it('should handle assignment not found', async () => {
            const response = await agent
                .delete(`/api/assignment/${testCourse.courseCode}/999`);
            
            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Assignment not found.');
        });
    });

    // Test for editing assignments
    describe('PUT /api/assignment/:courseId/:assignmentId', () => {
        it('should update an assignment', async () => {
            const updatedData = {
                title: 'Updated Assignment',
                description: 'This assignment has been updated',
                dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString() // 10 days from now
            };

            const response = await agent
                .put(`/api/assignment/${testCourse.courseCode}/1`)
                .send(updatedData);
            
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('Assignment updated successfully.');
            expect(response.body.assignment.title).toBe(updatedData.title);
            
            // Verify updated in database
            const updatedAssignment = await Assignment.findOne({
                courseCode: testCourse.courseCode,
                assignmentNumber: 1
            });
            expect(updatedAssignment.title).toBe(updatedData.title);
            expect(updatedAssignment.description).toBe(updatedData.description);
        });

        it('should handle missing required fields', async () => {
            const invalidData = {
                title: 'Partial Update'
                // Missing description and dueDate
            };

            const response = await agent
                .put(`/api/assignment/${testCourse.courseCode}/1`)
                .send(invalidData);
            
            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Title, description, and due date are required.');
        });

        it('should handle assignment not found', async () => {
            const updatedData = {
                title: 'Update Non-existent',
                description: 'This assignment does not exist',
                dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString()
            };

            const response = await agent
                .put(`/api/assignment/${testCourse.courseCode}/999`)
                .send(updatedData);
            
            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Assignment not found.');
        });
    });

    // Test for submitting assignments
    describe('POST /api/assignment/:courseCode/:assignmentId/submit', () => {
        it('should submit an assignment', async () => {
            const submissionData = {
                studentRollNo: testStudent.rollNo,
                studentName: testStudentUser.name,
                content: 'This is my assignment submission'
            };

            const response = await agent
                .post(`/api/assignment/${testCourse.courseCode}/1/submit`)
                .send(submissionData);
            
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('Submitted successfully');
            
            // Verify submission in database
            const assignment = await Assignment.findOne({
                courseCode: testCourse.courseCode,
                assignmentNumber: 1
            });
            expect(assignment.submissions.length).toBe(1);
            expect(assignment.submissions[0].studentRollNo).toBe(testStudent.rollNo);
            expect(assignment.submissions[0].content).toBe(submissionData.content);
        });

        it('should prevent duplicate submissions', async () => {
            // Add initial submission
            const assignment = await Assignment.findOne({
                courseCode: testCourse.courseCode,
                assignmentNumber: 1
            });
            
            assignment.submissions.push({
                studentRollNo: testStudent.rollNo,
                studentName: testStudentUser.name,
                content: 'Initial submission',
                submittedAt: new Date()
            });
            await assignment.save();

            // Try to submit again
            const submissionData = {
                studentRollNo: testStudent.rollNo,
                studentName: testStudentUser.name,
                content: 'Duplicate submission attempt'
            };

            const response = await agent
                .post(`/api/assignment/${testCourse.courseCode}/1/submit`)
                .send(submissionData);
            
            expect(response.status).toBe(409);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Already submitted');
            
            // Verify submission wasn't added
            const unchangedAssignment = await Assignment.findOne({
                courseCode: testCourse.courseCode,
                assignmentNumber: 1
            });
            expect(unchangedAssignment.submissions.length).toBe(1);
            expect(unchangedAssignment.submissions[0].content).toBe('Initial submission');
        });

        it('should handle assignment not found', async () => {
            const submissionData = {
                studentRollNo: testStudent.rollNo,
                studentName: testStudentUser.name,
                content: 'Submission to non-existent assignment'
            };

            const response = await agent
                .post(`/api/assignment/${testCourse.courseCode}/999/submit`)
                .send(submissionData);
            
            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Assignment not found');
        });
    });

    // Test for undoing submissions
    describe('DELETE /api/assignment/:courseCode/:assignmentId/undo/:rollNo', () => {
        beforeEach(async () => {
            // Add a submission to delete
            const assignment = await Assignment.findOne({
                courseCode: testCourse.courseCode,
                assignmentNumber: 1
            });
            
            assignment.submissions.push({
                studentRollNo: testStudent.rollNo,
                studentName: testStudentUser.name,
                content: 'Submission to be undone',
                submittedAt: new Date()
            });
            await assignment.save();
        });

        it('should undo an assignment submission', async () => {
            const response = await agent
                .delete(`/api/assignment/${testCourse.courseCode}/1/undo/${testStudent.rollNo}`);
            
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('Submission undone');
            
            // Verify submission removed from database
            const updatedAssignment = await Assignment.findOne({
                courseCode: testCourse.courseCode,
                assignmentNumber: 1
            });
            expect(updatedAssignment.submissions.length).toBe(0);
        });

        it('should handle submission not found', async () => {
            const response = await agent
                .delete(`/api/assignment/${testCourse.courseCode}/1/undo/INVALID`);
            
            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Submission not found');
        });

        it('should handle assignment not found', async () => {
            const response = await agent
                .delete(`/api/assignment/${testCourse.courseCode}/999/undo/${testStudent.rollNo}`);
            
            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Assignment not found');
        });
    });
});