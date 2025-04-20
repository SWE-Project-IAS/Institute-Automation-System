import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../index.js'; // Import your express app
import { closeDB, resetDBConnectionForTests } from '../database/mongoDb.js'; // Import your db connection functions
import { Student } from '../models/student.model.js';
import { Course } from '../models/course.model.js';
import { StudentCourse } from '../models/course.model.js';
import { FacultyCourse } from '../models/course.model.js';
import { Faculty } from '../models/faculty.model.js';
import { User } from '../models/user.model.js';
import { CourseDropRequest } from '../models/courseDropRequest.model.js';
import { Bonafide, ApplicationDocument } from '../models/documents.models.js';

const TEST_DB_URI = 'mongodb+srv://kevintj916:VvLxpm85TJLuxr0B@institutionautomationcl.bn7xvyp.mongodb.net/?retryWrites=true&w=majority&appName=institutionAutomationclu';
const agent = request(app);


// Connect to the test database before all tests
beforeAll(async () => {
    await resetDBConnectionForTests(TEST_DB_URI);
});

// Clean up the database and close the connection after all tests
afterAll(async () => {

    await mongoose.connection.db.dropDatabase();
    await closeDB();
});

describe('Student API Routes', () => {

    // Sample test data
    let testUser;
    let testStudent;
    let testCourse;
    let testStudentCourse;
    let testFacultyCourse;


    beforeEach(async () => {

        // Create test data
        // 1. Create a test user
        testUser = new User({
            name: 'Test Student',
            email: 'teststudent@example.com',
            role: 'student',
            password: 'hashedpassword123',
            refreshToken: 'refreshToken'
        });
        await testUser.save();

        // 2. Create a test student
        testStudent = new Student({
            userId: testUser._id,
            email: 'teststudent@example.com',
            rollNo: 'B20CS001',
            fatherName: 'Test Father',
            motherName: 'Test Mother',
            department: 'Computer Science',
            semester: 3,
            batch: '2020-2024',
            program: 'BTech',
            status: 'active',
            hostel: 'Brahmaputra',
            roomNo: 'A-101',
            documentAccess: {
                transcript: true,
                idCard: true,
                feeReceipt: true
            }
        });
        await testStudent.save();

        // 3. Create a test course
        testCourse = new Course({
            courseCode: 'CS101',
            courseName: 'Introduction to Computer Science',
            department: 'Computer Science',
            slot: 'A',
            credits: 4,
            maxIntake: 100,
            announcements: [
                {
                    title: 'Welcome to CS101',
                    content: 'Welcome to the course!',
                    importance: 'Medium',
                    postedBy: 'Prof. Smith'
                }
            ]
        });
        await testCourse.save();

        // 4. Create a test student course
        testStudentCourse = new StudentCourse({
            rollNo: testStudent.rollNo,
            courseId: testCourse.courseCode,
            creditOrAudit: 'Credit',
            semester: 'Winter Semester 2025',
            status: 'Approved',
            grade: null,
            isCompleted: false
        });
        await testStudentCourse.save();

        // 5. Create a test faculty course
        testFacultyCourse = new FacultyCourse({
            facultyId: 'FACULTY001',
            courseCode: testCourse.courseCode,
            year: 2025,
            session: 'Winter Semester',
            status: 'Ongoing'
        });
        await testFacultyCourse.save();
    })

    afterEach(async () => {
        await FacultyCourse.deleteMany({})
        await StudentCourse.deleteMany({})
        await User.deleteMany({})
        await Course.deleteMany({})
        await Student.deleteMany({})

    })
    // Test for getting student details
    describe('GET /api/student/:id', () => {
        it('should fetch student details successfully', async () => {
            const response = await agent
                .get(`/api/student/${testUser._id}`);

            expect(response.status).toBe(200);
            expect(response.body.rollNo).toBe(testStudent.rollNo);
            expect(response.body.email).toBe(testStudent.email);
            expect(response.body.department).toBe(testStudent.department);
            expect(response.body.program).toBe(testStudent.program);
        });

        it('should return 404 for non-existent student', async () => {
            const nonExistentId = new mongoose.Types.ObjectId();
            const response = await agent
                .get(`/api/student/${nonExistentId}`);

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Student not found');
        });
    });

    // Test for getting student courses
    describe('GET /api/student/:id/courses', () => {
        // it('should fetch student courses successfully', async () => {
        //   const response = await agent
        //     .get(`/api/student/${testUser._id}/courses`);

        //   expect(response.status).toBe(200);
        //   expect(response.body).toHaveProperty('courses');
        //   expect(Array.isArray(response.body.courses)).toBe(true);

        //   // Should have one course
        //   expect(response.body.courses.length).toBe(1);

        //   // Verify course details
        //   const course = response.body.courses[0];
        //   expect(course.id).toBe(testCourse.courseCode);
        //   expect(course.name).toBe(testCourse.courseName);
        //   expect(course.credits).toBe(testCourse.credits);
        //   expect(course.announcements).toBe(testCourse.announcements.length);
        // });

        it('should return empty array for student with no courses', async () => {
            // Create a new student with no courses
            const newUser = new User({
                name: 'New Student',
                email: 'newstudent@example.com',
                role: 'student',
                password: 'hashedpassword456',
                refreshToken: 'refreshToken',
            });
            await newUser.save();

            const newStudent = new Student({
                userId: newUser._id,
                email: 'newstudent@example.com',
                rollNo: 'B20CS002',
                fatherName: 'New Father',
                motherName: 'New Mother',
                department: 'Computer Science',
                semester: 1,
                batch: '2020-2024',
                program: 'BTech',
                status: 'active',
                hostel: 'Lohit',
                roomNo: 'B-102'
            });
            await newStudent.save();

            const response = await agent
                .get(`/api/student/${newUser._id}/courses`);

            expect(response.status).toBe(200);
            expect(response.body.courses).toEqual([]);
            expect(response.body.feedbackOpen).toBe(false);
        });

        it('should return 404 for non-existent student', async () => {
            const nonExistentId = new mongoose.Types.ObjectId();
            const response = await agent
                .get(`/api/student/${nonExistentId}/courses`);

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Student not found');
        });
    });

    // Test for getting completed courses
    describe('GET /api/student/:id/completed-courses', () => {
        it('should fetch completed courses successfully', async () => {
            // First, create a completed course
             const completedCourse = new Course({
                courseCode: 'CS100',
                courseName: 'Computer Programming',
                department: 'Computer Science',
                slot:'A',
                credits: 3,
                maxIntake: 80
            });
            await completedCourse.save();

            const completedStudentCourse = new StudentCourse({
                rollNo: testStudent.rollNo,
                courseId: completedCourse.courseCode,
                creditOrAudit: 'Credit',
                semester: 'Spring Semester 2024',
                status: 'Approved',
                grade: 'A',
                isCompleted: true
            });
            await completedStudentCourse.save();

            // Now test the API
            const response = await agent
                .get(`/api/student/${testUser._id}/completed-courses`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('courses');
            expect(Array.isArray(response.body.courses)).toBe(true);

            // Should have one completed course
            expect(response.body.courses.length).toBe(1);

            // Verify course details
            const course = response.body.courses[0];
            expect(course.courseCode).toBe(completedCourse.courseCode);
            expect(course.courseName).toBe(completedCourse.courseName);
            expect(course.credits).toBe(completedCourse.credits);
            expect(course.grade).toBe(completedStudentCourse.grade);
            expect(course.semester).toBe(completedStudentCourse.semester);
        });

        it('should return empty array for student with no completed courses', async () => {
            // Create a new student with no completed courses
            const newUser = new User({
                name: 'Another Student',
                email: 'anotherstudent@example.com',
                role: 'student',
                password: 'hashedpassword789',
                refreshToken: 'refreshToken'
            });
            await newUser.save();

            const newStudent = new Student({
                userId: newUser._id,
                email: 'anotherstudent@example.com',
                rollNo: 'B20CS003',
                fatherName: 'Another Father',
                motherName: 'Another Mother',
                department: 'Computer Science',
                semester: 1,
                batch: '2020-2024',
                program: 'BTech',
                status: 'active',
                hostel: 'Disang',
                roomNo: 'C-103'
            });
            await newStudent.save();

            const response = await agent
                .get(`/api/student/${newUser._id}/completed-courses`);

            expect(response.status).toBe(200);
            expect(response.body.courses).toEqual([]);
        });

        it('should return 404 for non-existent student', async () => {
            const nonExistentId = new mongoose.Types.ObjectId();
            const response = await agent
                .get(`/api/student/${nonExistentId}/completed-courses`);

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Student not found');
        });
    });
});




// Additional tests for Student API Routes
describe('Student API Routes - Additional Tests', () => {

    // Test for getting course announcements
    describe('GET /api/student/courses/:courseId', () => {
        let announcementCourse;
        let testFacultyUser;
        let testFaculty;

        beforeEach(async () => {
            // Create test faculty user
            testFacultyUser = new User({
                name: 'Professor Johnson',
                email: 'johnson@example.com',
                role: 'faculty',
                password: 'hashedpassword123',
                refreshToken: 'refreshToken'
            });
            await testFacultyUser.save();

            // Create test faculty
            testFaculty = new Faculty({
                userId: testFacultyUser._id,
                email: 'johnson@example.com',
                department: 'Computer Science',
                designation: 'Associate Professor',
                yearOfJoining: 2020,
                specialization: 'Databases',
                status: 'active'
            });
            await testFaculty.save();

            // Create test course with announcements
            announcementCourse = new Course({
                courseCode: 'CS301',
                courseName: 'Database Systems',
                department: 'Computer Science',
                slot: 'D',
                credits: 4,
                maxIntake: 90,
                announcements: [
                    {
                        title: 'Midterm Exam Date',
                        content: 'The midterm exam will be held on Oct 15, 2025',
                        importance: 'High',
                        postedBy: testFaculty._id.toString(), // Using faculty._id instead of facultyId
                        date: new Date('2025-09-30')
                    },
                    {
                        title: 'Assignment Deadline Extended',
                        content: 'Assignment 2 deadline has been extended to Oct 10, 2025',
                        importance: 'Medium',
                        postedBy: testFaculty._id.toString(), // Using faculty._id instead of facultyId
                        date: new Date('2025-10-01')
                    }
                ]
            });
            await announcementCourse.save();
        });

        afterEach(async () => {
            // Create test faculty user

            await User.deleteMany({})
            await Course.deleteMany({})
            await Faculty.deleteMany({})

        });

        it('should fetch course announcements successfully', async () => {
            const response = await request(app)
                .get(`/api/student/courses/${announcementCourse.courseCode}`);

            expect(response.status).toBe(200);
            expect(response.body.courseCode).toBe(announcementCourse.courseCode);
            expect(response.body.courseName).toBe(announcementCourse.courseName);

            // Check announcements
            expect(Array.isArray(response.body.announcements)).toBe(true);
            expect(response.body.announcements.length).toBe(2);

            // Verify announcements are sorted by date (most recent first)
            expect(response.body.announcements[0].title).toBe('Assignment Deadline Extended');
            expect(response.body.announcements[1].title).toBe('Midterm Exam Date');

        });

        it('should return course with empty announcements if none exist', async () => {
            // Create a course without announcements
            const emptyAnnouncementCourse = new Course({
                courseCode: 'CS305',
                courseName: 'Software Engineering',
                department: 'Computer Science',
                slot: 'E',
                credits: 3,
                maxIntake: 80
            });
            await emptyAnnouncementCourse.save();

            const response = await request(app)
                .get(`/api/student/courses/${emptyAnnouncementCourse.courseCode}`);

            expect(response.status).toBe(200);
            expect(response.body.courseCode).toBe(emptyAnnouncementCourse.courseCode);

            // Should have announcements property as empty array
            expect(response.body.announcements).toBeDefined();
            expect(Array.isArray(response.body.announcements)).toBe(true);
            expect(response.body.announcements.length).toBe(0);
        });

        it('should return 404 for non-existent course', async () => {
            const response = await request(app)
                .get('/api/student/courses/CS999');

            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Course not found');
        });
    });

});

describe('Course Drop Request API Integration Tests', () => {
    let testUser;
    let testStudent;
    let testCourse;
    let testStudentCourse;

    beforeEach(async () => {
        // Create test data
        // 1. Create a test user
        testUser = new User({
            name: 'Test Student',
            email: 'teststudent@example.com',
            role: 'student',
            password: 'hashedpassword123',
            refreshToken: 'refreshToken'
        });
        await testUser.save();

        // 2. Create a test student
        testStudent = new Student({
            userId: testUser._id,
            email: 'teststudent@example.com',
            rollNo: 'B20CS001',
            fatherName: 'Test Father',
            motherName: 'Test Mother',
            department: 'Computer Science',
            semester: 3,
            batch: '2020-2024',
            program: 'BTech',
            status: 'active',
            hostel: 'Brahmaputra',
            roomNo: 'A-101',
            documentAccess: {
                transcript: true,
                idCard: true,
                feeReceipt: true
            }
        });
        await testStudent.save();

        // 3. Create a test course
        testCourse = new Course({
            courseCode: 'CS101',
            courseName: 'Introduction to Computer Science',
            department: 'Computer Science',
            slot: 'A',
            credits: 4,
            maxIntake: 100,
            announcements: [
                {
                    title: 'Welcome to CS101',
                    content: 'Welcome to the course!',
                    importance: 'Medium',
                    postedBy: 'Prof. Smith'
                }
            ]
        });
        await testCourse.save();

        // 4. Create a test student course
        testStudentCourse = new StudentCourse({
            rollNo: testStudent.rollNo,
            courseId: testCourse.courseCode,
            creditOrAudit: 'Credit',
            semester: 'Winter Semester 2025',
            status: 'Approved',
            grade: null,
            isCompleted: false
        });
        await testStudentCourse.save();
    });

    afterEach(async () => {
        await CourseDropRequest.deleteMany({});
        await StudentCourse.deleteMany({});
        await Course.deleteMany({});
        await Student.deleteMany({});
        await User.deleteMany({});
    });

    describe('POST /api/student/:id/drop-requests', () => {
        it('should create a course drop request successfully', async () => {
            const response = await agent
                .post(`/api/student/${testUser._id}/drop-requests`)
                .send({ courseId: testCourse.courseCode });

            expect(response.status).toBe(201);
            expect(response.body.message).toBe('Course drop request submitted successfully');
            expect(response.body).toHaveProperty('requestId');

            // Verify that the request was actually created in the database
            const savedRequest = await CourseDropRequest.findById(response.body.requestId);
            expect(savedRequest).toBeTruthy();
            expect(savedRequest.studentId).toBe(testUser._id.toString());
            expect(savedRequest.rollNo).toBe(testStudent.rollNo);
            expect(savedRequest.courseId).toBe(testCourse.courseCode);
            expect(savedRequest.courseName).toBe(testCourse.courseName);
            expect(savedRequest.status).toBe('Pending');
        });

        it('should return 404 if student is not found', async () => {
            const nonExistentId = new mongoose.Types.ObjectId();
            const response = await agent
                .post(`/api/student/${nonExistentId}/drop-requests`)
                .send({ courseId: testCourse.courseCode });

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Student not found');
        });

        it('should return 404 if student is not enrolled in the course', async () => {
            const response = await agent
                .post(`/api/student/${testUser._id}/drop-requests`)
                .send({ courseId: 'CS999' }); // Non-existent course

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Student is not enrolled in this course');
        });

        it('should return 400 if there is already a pending drop request', async () => {
            // First, create a pending drop request
            const existingRequest = new CourseDropRequest({
                studentId: testUser._id,
                rollNo: testStudent.rollNo,
                courseId: testCourse.courseCode,
                courseName: testCourse.courseName,
                semester: 'Winter Semester 2025',
                status: 'Pending'
            });
            await existingRequest.save();

            // Then try to create another one
            const response = await agent
                .post(`/api/student/${testUser._id}/drop-requests`)
                .send({ courseId: testCourse.courseCode });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('A drop request for this course is already pending');
        });

        it('should allow creating a new request if previous one was not pending', async () => {
            // First, create a completed drop request
            const existingRequest = new CourseDropRequest({
                studentId: testUser._id,
                rollNo: testStudent.rollNo,
                courseId: testCourse.courseCode,
                courseName: testCourse.courseName,
                semester: 'Winter Semester 2025',
                status: 'Approved' // Not Pending
            });
            await existingRequest.save();

            // Then try to create another one
            const response = await agent
                .post(`/api/student/${testUser._id}/drop-requests`)
                .send({ courseId: testCourse.courseCode });

            expect(response.status).toBe(201);
            expect(response.body.message).toBe('Course drop request submitted successfully');
        });

        it('should handle invalid courseId format', async () => {
            const response = await agent
                .post(`/api/student/${testUser._id}/drop-requests`)
                .send({ courseId: '' }); // Empty course ID

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Student is not enrolled in this course');
        });
    });
});



describe('Student Course Drop Requests API Integration Tests', () => {
    let testUser;
    let testStudent;
    let testCourse1;
    let testCourse2;
    let testStudentCourse1;
    let testStudentCourse2;
    let testDropRequest1;
    let testDropRequest2;

    beforeEach(async () => {
        // Create test data
        // 1. Create a test user
        testUser = new User({
            name: 'Test Student',
            email: 'teststudent@example.com',
            role: 'student',
            password: 'hashedpassword123',
            refreshToken: 'refreshToken'
        });
        await testUser.save();

        // 2. Create a test student
        testStudent = new Student({
            userId: testUser._id,
            email: 'teststudent@example.com',
            rollNo: 'B20CS001',
            fatherName: 'Test Father',
            motherName: 'Test Mother',
            department: 'Computer Science',
            semester: 3,
            batch: '2020-2024',
            program: 'BTech',
            status: 'active',
            hostel: 'Brahmaputra',
            roomNo: 'A-101',
            documentAccess: {
                transcript: true,
                idCard: true,
                feeReceipt: true
            }
        });
        await testStudent.save();

        // Create another user for authorization tests
        const otherUser = new User({
            name: 'Other Student',
            email: 'otherstudent@example.com',
            role: 'student',
            password: 'hashedpassword456',
            refreshToken: 'otherRefreshToken'
        });
        await otherUser.save();

        const otherStudent = new Student({
            userId: otherUser._id,
            email: 'otherstudent@example.com',
            rollNo: 'B20CS002',
            fatherName: 'Other Father',
            motherName: 'Other Mother',
            department: 'Computer Science',
            semester: 3,
            batch: '2020-2024',
            program: 'BTech',
            status: 'active',
            hostel: 'Brahmaputra',
            roomNo: 'A-102'
        });
        await otherStudent.save();

        // 3. Create test courses
        testCourse1 = new Course({
            courseCode: 'CS101',
            courseName: 'Introduction to Computer Science',
            department: 'Computer Science',
            slot: 'A',
            credits: 4,
            maxIntake: 100
        });
        await testCourse1.save();

        testCourse2 = new Course({
            courseCode: 'CS102',
            courseName: 'Data Structures',
            department: 'Computer Science',
            slot: 'B',
            credits: 4,
            maxIntake: 100
        });
        await testCourse2.save();

        // 4. Create test student courses
        testStudentCourse1 = new StudentCourse({
            rollNo: testStudent.rollNo,
            courseId: testCourse1.courseCode,
            creditOrAudit: 'Credit',
            semester: 'Winter Semester 2025',
            status: 'Approved',
            grade: null,
            isCompleted: false
        });
        await testStudentCourse1.save();

        testStudentCourse2 = new StudentCourse({
            rollNo: testStudent.rollNo,
            courseId: testCourse2.courseCode,
            creditOrAudit: 'Credit',
            semester: 'Winter Semester 2025',
            status: 'Approved',
            grade: null,
            isCompleted: false
        });
        await testStudentCourse2.save();

        // 5. Create test drop requests
        testDropRequest1 = new CourseDropRequest({
            studentId: testUser._id,
            rollNo: testStudent.rollNo,
            courseId: testCourse1.courseCode,
            courseName: testCourse1.courseName,
            semester: 'Winter Semester 2025',
            status: 'Pending',
            requestDate: new Date('2025-01-10')
        });
        await testDropRequest1.save();

        testDropRequest2 = new CourseDropRequest({
            studentId: testUser._id,
            rollNo: testStudent.rollNo,
            courseId: testCourse2.courseCode,
            courseName: testCourse2.courseName,
            semester: 'Winter Semester 2025',
            status: 'Approved',
            requestDate: new Date('2025-01-05')
        });
        await testDropRequest2.save();
    });

    afterEach(async () => {
        await CourseDropRequest.deleteMany({});
        await StudentCourse.deleteMany({});
        await Course.deleteMany({});
        await Student.deleteMany({});
        await User.deleteMany({});
    });

    // Tests for getStudentDropRequests
    describe('GET /api/student/:id/drop-requests', () => {
        it('should fetch all drop requests for a student successfully', async () => {
            const response = await agent
                .get(`/api/student/${testUser._id}/drop-requests`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(2);

            // Verify the requests are returned in descending order of creation date
            expect(response.body[0]._id).toBe(testDropRequest2._id.toString());
            expect(response.body[1]._id).toBe(testDropRequest1._id.toString());

            // Verify the details of returned drop requests
            const firstRequest = response.body[1];
            expect(firstRequest.courseId).toBe(testCourse1.courseCode);
            expect(firstRequest.courseName).toBe(testCourse1.courseName);
            expect(firstRequest.status).toBe('Pending');

            const secondRequest = response.body[0];
            expect(secondRequest.courseId).toBe(testCourse2.courseCode);
            expect(secondRequest.courseName).toBe(testCourse2.courseName);
            expect(secondRequest.status).toBe('Approved');
        });

        it('should return empty array for student with no drop requests', async () => {
            // Create a new student with no drop requests
            const newUser = new User({
                name: 'New Student',
                email: 'newstudent@example.com',
                role: 'student',
                password: 'hashedpassword789',
                refreshToken: 'newRefreshToken'
            });
            await newUser.save();

            const newStudent = new Student({
                userId: newUser._id,
                email: 'newstudent@example.com',
                rollNo: 'B20CS003',
                fatherName: 'New Father',
                motherName: 'New Mother',
                department: 'Computer Science',
                semester: 1,
                batch: '2020-2024',
                program: 'BTech',
                status: 'active',
                hostel: 'Lohit',
                roomNo: 'B-102'
            });
            await newStudent.save();

            const response = await agent
                .get(`/api/student/${newUser._id}/drop-requests`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(0);
        });

        it('should return 404 for non-existent student', async () => {
            const nonExistentId = new mongoose.Types.ObjectId();
            const response = await agent
                .get(`/api/student/${nonExistentId}/drop-requests`);

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Student not found');
        });
    });

    // Tests for cancelDropRequest
    describe('DELETE /api/student/:id/drop-requests/:requestId', () => {
        it('should cancel a pending drop request successfully', async () => {
            const response = await agent
                .delete(`/api/student/${testUser._id}/drop-requests/${testDropRequest1._id}`);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Course drop request cancelled successfully');

            // Verify that the request was actually deleted from the database
            const deletedRequest = await CourseDropRequest.findById(testDropRequest1._id);
            expect(deletedRequest).toBeNull();

            // Verify that other requests remain intact
            const remainingRequest = await CourseDropRequest.findById(testDropRequest2._id);
            expect(remainingRequest).toBeTruthy();
        });

        it('should return 404 if student is not found', async () => {
            const nonExistentId = new mongoose.Types.ObjectId();
            const response = await agent
                .delete(`/api/student/${nonExistentId}/drop-requests/${testDropRequest1._id}`);

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Student not found');

            // Verify that the request wasn't deleted
            const request = await CourseDropRequest.findById(testDropRequest1._id);
            expect(request).toBeTruthy();
        });

        it('should return 404 if drop request is not found', async () => {
            const nonExistentRequestId = new mongoose.Types.ObjectId();
            const response = await agent
                .delete(`/api/student/${testUser._id}/drop-requests/${nonExistentRequestId}`);

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Drop request not found');
        });

        it('should return 403 if drop request belongs to a different student', async () => {
            // Create another student
            const otherUser = await User.findOne({ email: 'otherstudent@example.com' });

            const response = await agent
                .delete(`/api/student/${otherUser._id}/drop-requests/${testDropRequest1._id}`);

            expect(response.status).toBe(403);
            expect(response.body.message).toBe('Unauthorized to cancel this request');

            // Verify that the request wasn't deleted
            const request = await CourseDropRequest.findById(testDropRequest1._id);
            expect(request).toBeTruthy();
        });

        it('should return 400 if drop request is not in pending status', async () => {
            // Try to cancel an already approved request
            const response = await agent
                .delete(`/api/student/${testUser._id}/drop-requests/${testDropRequest2._id}`);

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Cannot cancel a request that is already approved');

            // Verify that the request wasn't deleted
            const request = await CourseDropRequest.findById(testDropRequest2._id);
            expect(request).toBeTruthy();
        });
    });
});


describe('Student Bonafide API Integration Tests', () => {
    let testUser;
    let testStudent;
    let testApplication;
    let testBonafide;

    beforeEach(async () => {
        // 1. Create a test user with dateOfBirth
        testUser = new User({
            name: 'Test Student',
            email: 'teststudent@example.com',
            role: 'student',
            password: 'hashedpassword123',
            refreshToken: 'refreshToken',
            dateOfBirth: new Date('2000-01-15') // Added dateOfBirth
        });
        await testUser.save();

        // 2. Create a test student
        testStudent = new Student({
            userId: testUser._id,
            email: 'teststudent@example.com',
            rollNo: 'B20CS001',
            fatherName: 'Test Father',
            motherName: 'Test Mother',
            department: 'Computer Science',
            semester: 3,
            batch: '2020-2024',
            program: 'BTech',
            status: 'active',
            hostel: 'Brahmaputra',
            roomNo: 'A-101',
            documentAccess: {
                transcript: true,
                idCard: true,
                feeReceipt: true
            }
        });
        await testStudent.save();

        // 3. Create a test application document
        testApplication = new ApplicationDocument({
            studentId: testStudent._id,
            documentType: 'Bonafide',
            status: 'Pending',
            approvalDetails: {
                remarks: ['Awaiting verification']
            },
            createdAt: new Date('2025-01-10'),
            updatedAt: new Date('2025-01-10')
        });
        await testApplication.save();

        // 4. Create a test bonafide document
        testBonafide = new Bonafide({
            applicationId: testApplication._id,
            currentSemester: 3,
            purpose: 'Education Loan',
            otherDetails: 'For SBI Bank'
        });
        await testBonafide.save();
    });

    afterEach(async () => {
        await Bonafide.deleteMany({});
        await ApplicationDocument.deleteMany({});
        await Student.deleteMany({});
        await User.deleteMany({});
    });

    // Tests for getStudentBonafideDetails
    describe('GET /api/student/:id/bonafide/', () => {
        it('should fetch student bonafide details successfully', async () => {

            console.log(testUser._id)
            const response = await agent
                .get(`/api/student/${testUser._id}/bonafide/`);

            console.log("the response is ", response.body)
            expect(response.status).toBe(200);

            // Verify student details
            expect(response.body.name).toBe(testUser.name);
            expect(response.body.rollNo).toBe(testStudent.rollNo);
            expect(response.body.fatherName).toBe(testStudent.fatherName);
            expect(new Date(response.body.dateOfBirth).toISOString()).toBe(testUser.dateOfBirth.toISOString());
            expect(response.body.program).toBe(testStudent.program);
            expect(response.body.department).toBe(testStudent.department);
            expect(response.body.hostel).toBe(testStudent.hostel);
            expect(response.body.roomNo).toBe(testStudent.roomNo);
            expect(response.body.semester).toBe(testStudent.semester);
            expect(response.body.batch).toBe(testStudent.batch);
            expect(response.body.enrolledYear).toBe(testStudent.batch);
        });

        it('should return 404 for non-existent student', async () => {
            const nonExistentId = new mongoose.Types.ObjectId();
            const response = await agent
                .get(`/api/student/${nonExistentId}/bonafide/`);

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Student not found');
        });

        it('should handle server errors gracefully', async () => {
            // Create invalid ObjectId to trigger a server error
            const invalidId = 'invalid-id';
            const response = await agent
                .get(`/api/student/${invalidId}/bonafide/`);

            expect(response.status).toBe(500);
            expect(response.body.message).toBe('Error fetching student details');
        });
    });

    // Tests for createBonafideApplication
    describe('POST /api/student/:id/bonafide/apply', () => {
        it('should create a bonafide application successfully with standard purpose', async () => {
            const applicationData = {
                currentSemester: 3,
                certificateFor: 'Passport Application'
            };

            const response = await agent
                .post(`/api/student/${testUser._id}/bonafide/apply`)
                .send(applicationData);

            expect(response.status).toBe(201);
            expect(response.body.message).toBe('Bonafide application submitted successfully');
            expect(response.body).toHaveProperty('applicationId');

            // Verify application was created in database
            const applicationId = response.body.applicationId;
            const savedApplication = await ApplicationDocument.findById(applicationId);
            expect(savedApplication).toBeTruthy();
            expect(savedApplication.documentType).toBe('Bonafide');
            expect(savedApplication.status).toBe('Pending');

            // Verify bonafide details were saved
            const savedBonafide = await Bonafide.findOne({ applicationId });
            expect(savedBonafide).toBeTruthy();
            expect(savedBonafide.currentSemester).toBe(applicationData.currentSemester);
            expect(savedBonafide.purpose).toBe(applicationData.certificateFor);
            expect(savedBonafide.otherReason).toBeUndefined();
        });

        it('should create a bonafide application successfully with "Other" purpose and reason', async () => {
            const applicationData = {
                currentSemester: 3,
                certificateFor: 'Other',
                otherReason: 'Internship Verification'
            };

            const response = await agent
                .post(`/api/student/${testUser._id}/bonafide/apply`)
                .send(applicationData);

            expect(response.status).toBe(201);

            // Verify bonafide details were saved with other reason
            const applicationId = response.body.applicationId;
            const savedBonafide = await Bonafide.findOne({ applicationId });
            expect(savedBonafide).toBeTruthy();
            expect(savedBonafide.purpose).toBe('Other');
            expect(savedBonafide.otherReason).toBe(applicationData.otherReason);
        });

        it('should return 404 for non-existent student', async () => {
            const nonExistentId = new mongoose.Types.ObjectId();
            const applicationData = {
                currentSemester: 3,
                certificateFor: 'Visa Application'
            };

            const response = await agent
                .post(`/api/student/${nonExistentId}/bonafide/apply`)
                .send(applicationData);

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Student not found');

            // Verify no documents were created
            const applicationCount = await ApplicationDocument.countDocuments();
            const bonafideCount = await Bonafide.countDocuments();
            expect(applicationCount).toBe(1); // Only the one created in beforeEach
            expect(bonafideCount).toBe(1); // Only the one created in beforeEach
        });

        it('should handle validation errors for missing required fields', async () => {
            // Missing currentSemester
            const invalidData = {
                certificateFor: 'Visa Application'
            };

            const response = await agent
                .post(`/api/student/${testUser._id}/bonafide/apply`)
                .send(invalidData);

            expect(response.status).toBe(500); // Validation errors are caught in the catch block
        });

        it('should require otherReason when purpose is Other', async () => {
            // Missing otherReason when purpose is 'Other'
            const invalidData = {
                currentSemester: 3,
                certificateFor: 'Other'
                // otherReason is missing
            };

            const response = await agent
                .post(`/api/student/${testUser._id}/bonafide/apply`)
                .send(invalidData);

            expect(response.status).toBe(500); // Validation error caught in the catch block
        });
    });

    // Tests for getBonafideApplications
    describe('GET /api/student/:id/bonafide/applications', () => {
        it('should fetch all bonafide applications for a student successfully', async () => {
            // Add another approved application
            const approvedApplication = new ApplicationDocument({
                studentId: testStudent._id,
                documentType: 'Bonafide',
                status: 'Approved',
                approvalDetails: {
                    approvedBy: new mongoose.Types.ObjectId(),
                    approvalDate: new Date('2025-01-15'),
                    remarks: ['Approved', 'Ready for collection']
                },
                createdAt: new Date('2025-01-05'),
                updatedAt: new Date('2025-01-15')
            });
            await approvedApplication.save();

            const approvedBonafide = new Bonafide({
                applicationId: approvedApplication._id,
                currentSemester: 3,
                purpose: 'Bank Account Opening'
            });
            await approvedBonafide.save();

            const response = await agent
                .get(`/api/student/${testUser._id}/bonafide/applications`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(2);

            // Verify applications are returned in descending order by createdAt
            // The first application should be the one created in beforeEach (2025-01-10)
            // The second application should be the one created in this test (2025-01-05)
            const [firstApp, secondApp] = response.body;

            // First application (newest)
            expect(new Date(firstApp.applicationDate)).toEqual(new Date(testApplication.createdAt));
            expect(firstApp.certificateFor).toBe(testBonafide.purpose);
            expect(firstApp.currentSemester).toBe(testBonafide.currentSemester);
            expect(firstApp.documentStatus).toBe('Documents Under Review');
            expect(firstApp.currentStatus).toBe('Pending');

            // Second application (older)
            expect(new Date(secondApp.applicationDate)).toEqual(new Date(approvedApplication.createdAt));
            expect(secondApp.certificateFor).toBe(approvedBonafide.purpose);
            expect(secondApp.currentSemester).toBe(approvedBonafide.currentSemester);
            expect(secondApp.documentStatus).toBe('Documents Verified');
            expect(secondApp.currentStatus).toBe('Approved');
        });

        it('should handle applications with "Other" purpose correctly', async () => {
            // Create an application with "Other" purpose
            const otherApplication = new ApplicationDocument({
                studentId: testStudent._id,
                documentType: 'Bonafide',
                status: 'Pending',
                createdAt: new Date()
            });
            await otherApplication.save();

            const otherBonafide = new Bonafide({
                applicationId: otherApplication._id,
                currentSemester: 3,
                purpose: 'Other',
                otherReason: 'Driving License'
            });
            await otherBonafide.save();

            const response = await agent
                .get(`/api/student/${testUser._id}/bonafide/applications`);

            const otherApp = response.body.find(app => app.certificateFor === 'Driving License');
            expect(otherApp).toBeTruthy();
            expect(otherApp.currentStatus).toBe('Pending');
        });

        it('should return empty array for student with no bonafide applications', async () => {
            // Create a new student with no applications
            const newUser = new User({
                name: 'New Student',
                email: 'newstudent@example.com',
                role: 'student',
                password: 'hashedpassword456',
                refreshToken: 'newRefreshToken',
                dateOfBirth: new Date('2001-05-20')
            });
            await newUser.save();

            const newStudent = new Student({
                userId: newUser._id,
                email: 'newstudent@example.com',
                rollNo: 'B20CS002',
                fatherName: 'New Father',
                motherName: 'New Mother',
                department: 'Computer Science',
                semester: 1,
                batch: '2020-2024',
                program: 'BTech',
                status: 'active',
                hostel: 'Lohit',
                roomNo: 'B-102'
            });
            await newStudent.save();

            const response = await agent
                .get(`/api/student/${newUser._id}/bonafide/applications`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(0);
        });

        it('should return 404 for non-existent student', async () => {
            const nonExistentId = new mongoose.Types.ObjectId();
            const response = await agent
                .get(`/api/student/${nonExistentId}/bonafide/applications`);

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Student not found');
        });

        it('should filter out invalid applications (missing bonafide details)', async () => {
            // Create an application document with no corresponding bonafide
            const orphanedApplication = new ApplicationDocument({
                studentId: testStudent._id,
                documentType: 'Bonafide',
                status: 'Pending',
                createdAt: new Date()
            });
            await orphanedApplication.save();

            const response = await agent
                .get(`/api/student/${testUser._id}/bonafide/applications`);

            // Should only return the valid application created in beforeEach
            expect(response.body.length).toBe(1);
            expect(new Date(response.body[0].applicationDate)).toEqual(new Date(testApplication.createdAt));
        });
    });
});
