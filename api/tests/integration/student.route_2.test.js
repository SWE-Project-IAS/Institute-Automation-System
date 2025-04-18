import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../index.js'; // Import your express app
import { closeDB, resetDBConnectionForTests } from '../../database/mongoDb.js'; // Import your db connection functions
import { Student } from '../../models/student.model.js';
import { User } from '../../models/user.model.js';
import { CourseApprovalRequest } from '../../models/course.model.js';
import { Passport, ApplicationDocument } from '../../models/documents.models.js';
const TEST_DB_URI = 'mongodb+srv://kevintj916:VvLxpm85TJLuxr0B@institutionautomationcl.bn7xvyp.mongodb.net/?retryWrites=true&w=majority&appName=institutionAutomationclu';
const agent = request(app);

beforeAll(async () => {
    await resetDBConnectionForTests(TEST_DB_URI);
});

// Clean up the database and close the connection after all tests
afterAll(async () => {

    await mongoose.connection.db.dropDatabase();
    await closeDB();
});



describe('Student API submitCourseApprovalRequest getPendingRequests Routes', () => {

    let testUser;
    let testStudent;
    let testCourseApprovalRequest;

    beforeEach(async () => {
        // 1. Create a test user
        testUser = new User({
            name: 'Test Student',
            email: 'teststudent@example.com',
            role: 'student',
            password: 'hashedpassword123',
            refreshToken: 'refreshToken',
            dateOfBirth: new Date('2000-01-15')
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

        // 3. Create a test course approval request (for getPendingRequests test)
        testCourseApprovalRequest = new CourseApprovalRequest({
            studentId: testUser._id,
            courseCode: 'CS301',
            courseType: 'Elective',
            status: 'Pending',
            createdAt: new Date('2025-01-10')
        });
        await testCourseApprovalRequest.save();
    });

    afterEach(async () => {
        await CourseApprovalRequest.deleteMany({});
        await Student.deleteMany({});
        await User.deleteMany({});
    });

    // Tests for submitCourseApprovalRequest
    describe('POST /api/student/:id/course-approval', () => {
        it('should submit a course approval request successfully', async () => {
            const requestBody = {
                courseCode: 'CS401',
                courseType: 'Core'
            };

            const response = await agent
                .post(`/api/student/${testUser._id}/course-approval`)
                .send(requestBody);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Course approval request submitted successfully.');

            // Verify the request was saved in the database
            const savedRequest = await CourseApprovalRequest.findOne({
                studentId: testUser._id,
                courseCode: 'CS401'
            });

            expect(savedRequest).not.toBeNull();
            expect(savedRequest.courseCode).toBe('CS401');
            expect(savedRequest.courseType).toBe('Core');
            expect(savedRequest.status).toBe('Pending');
        });

        it('should return 200 for duplicate pending course request', async () => {
            // First create a request
            const requestBody = {
                courseCode: 'CS501',
                courseType: 'Elective'
            };

            await agent
                .post(`/api/student/${testUser._id}/course-approval`)
                .send(requestBody);

            // Submit the same request again
            const duplicateResponse = await agent
                .post(`/api/student/${testUser._id}/course-approval`)
                .send(requestBody);

            expect(duplicateResponse.status).toBe(200);
            expect(duplicateResponse.body.message).toBe('A request for this course is already pending.');

            // Verify only one request exists
            const requests = await CourseApprovalRequest.find({
                studentId: testUser._id,
                courseCode: 'CS501'
            });

            expect(requests.length).toBe(1);
        });

        it('should return 404 for non-existent student', async () => {
            const nonExistentId = new mongoose.Types.ObjectId();
            const requestBody = {
                courseCode: 'CS601',
                courseType: 'Audit'
            };

            const response = await agent
                .post(`/api/student/${nonExistentId}/course-approval`)
                .send(requestBody);

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Student not found');
        });

        it('should handle server errors gracefully', async () => {
            // Create invalid ObjectId to trigger a server error
            const invalidId = 'invalid-id';
            const requestBody = {
                courseCode: 'CS701',
                courseType: 'Core'
            };

            const response = await agent
                .post(`/api/student/${invalidId}/course-approval`)
                .send(requestBody);

            expect(response.status).toBe(500);
            expect(response.body.message).toBe('Failed to submit course approval request.');
        });
    });

    // Tests for getPendingRequests
    describe('GET /api/student/:id/pending-requests', () => {
        it('should fetch pending requests successfully', async () => {
            const response = await agent
                .get(`/api/student/${testUser._id}/pending-requests`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(1);
            expect(response.body[0].courseCode).toBe('CS301');
            expect(response.body[0].courseType).toBe('Elective');
            expect(response.body[0].status).toBe('Pending');
        });

        it('should return empty array when no pending requests exist', async () => {
            // Delete all course approval requests first
            await CourseApprovalRequest.deleteMany({});

            const response = await agent
                .get(`/api/student/${testUser._id}/pending-requests`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(0);
        });

        it('should handle server errors gracefully', async () => {
            // Create invalid ObjectId to trigger a server error
            const invalidId = 'invalid-id';

            const response = await agent
                .get(`/api/student/${invalidId}/pending-requests`);

            expect(response.status).toBe(500);
            expect(response.body.message).toBe('Failed to fetch pending requests.');
        });
    });
});


describe('Student API Passport Routes', () => {
    let testUser;
    let testStudent;
    let testApplicationDoc;
    let testPassport;

    beforeEach(async () => {
        // 1. Create a test user
        testUser = new User({
            name: 'Test Student',
            email: 'teststudent@example.com',
            role: 'student',
            password: 'hashedpassword123',
            refreshToken: 'refreshToken',
            dateOfBirth: new Date('2000-01-15'),
            contactNo: '9876543210'
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

        // 3. Create a test application document for passport
        testApplicationDoc = new ApplicationDocument({
            studentId: testStudent._id,
            documentType: 'Passport',
            status: 'Pending',
            approvalDetails: {
                remarks: ['Awaiting verification']
            },
            createdAt: new Date('2025-01-10'),
            updatedAt: new Date('2025-01-10')
        });
        await testApplicationDoc.save();

        // 4. Create a test passport document
        testPassport = new Passport({
            applicationId: testApplicationDoc._id,
            applicationType: 'fresh',
            placeOfBirth: 'Delhi',
            semester: 3,
            mode: 'normal',
            travelPlans: 'no',
            travelDetails: '',
        });
        await testPassport.save();
    });

    afterEach(async () => {
        await Passport.deleteMany({});
        await ApplicationDocument.deleteMany({});
        await Student.deleteMany({});
        await User.deleteMany({});
    });

    // Tests for getStudentPassportDetails
    describe('GET /api/student/:id/passport', () => {
        it('should fetch student passport details successfully', async () => {
            const response = await agent
                .get(`/api/student/${testUser._id}/passport`);

            expect(response.status).toBe(200);

            // Verify student details
            expect(response.body.name).toBe(testUser.name);
            expect(response.body.rollNo).toBe(testStudent.rollNo);
            expect(response.body.department).toBe(testStudent.department);
            expect(response.body.programme).toBe(testStudent.program);
            expect(new Date(response.body.dateOfBirth).toISOString()).toBe(testUser.dateOfBirth.toISOString());
            expect(response.body.email).toBe(testUser.email);
            expect(response.body.hostelName).toBe(testStudent.hostel);
            expect(response.body.roomNo).toBe(testStudent.roomNo);
            expect(response.body.fathersName).toBe(testStudent.fatherName);
            expect(response.body.mothersName).toBe(testStudent.motherName);
        });

        it('should return 404 for non-existent student', async () => {
            const nonExistentId = new mongoose.Types.ObjectId();
            const response = await agent
                .get(`/api/student/${nonExistentId}/passport`);

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Student not found');
        });

        it('should handle server errors gracefully', async () => {
            // Create invalid ObjectId to trigger a server error
            const invalidId = 'invalid-id';
            const response = await agent
                .get(`/api/student/${invalidId}/passport`);

            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty('message');
        });
    });

    // Tests for submitPassportApplication
    describe('POST /api/student/:id/passport/apply', () => {
        it('should submit a fresh passport application with no travel plans successfully', async () => {
            const passportData = {
                applicationType: 'fresh',
                placeOfBirth: 'Mumbai',
                semester: 3,
                mode: 'normal',
                travelPlans: 'no',
                travelDetails: ''
            };

            const response = await agent
                .post(`/api/student/${testUser._id}/passport/apply`)
                .send(passportData);

            expect(response.status).toBe(201);
            expect(response.body.message).toBe('Passport application submitted successfully');
            expect(response.body).toHaveProperty('applicationId');

            // Verify application was created
            const application = await ApplicationDocument.findById(response.body.applicationId);
            expect(application).not.toBeNull();
            expect(application.documentType).toBe('Passport');
            expect(application.status).toBe('Pending');

            // Verify passport document was created
            const passport = await Passport.findOne({ applicationId: response.body.applicationId });
            expect(passport).not.toBeNull();
            expect(passport.applicationType).toBe('fresh');
            expect(passport.placeOfBirth).toBe('Mumbai');
            expect(passport.mode).toBe('normal');
            expect(passport.travelPlans).toBe('no');
        });

        it('should submit a tatkal passport application with travel plans successfully', async () => {
            const passportData = {
                applicationType: 'renewal',
                placeOfBirth: 'Bangalore',
                semester: 4,
                mode: 'tatkal',
                tatkalReason: 'Emergency travel required',
                travelPlans: 'yes',
                travelDetails: 'Conference attendance',
                fromDate: '2025-03-15',
                toDate: '2025-03-25'
            };

            const response = await agent
                .post(`/api/student/${testUser._id}/passport/apply`)
                .send(passportData);

            expect(response.status).toBe(201);

            // Verify passport document details for tatkal with travel
            const application = await ApplicationDocument.findById(response.body.applicationId);
            const passport = await Passport.findOne({ applicationId: application._id });

            expect(passport.mode).toBe('tatkal');
            expect(passport.tatkalReason).toBe('Emergency travel required');
            expect(passport.travelPlans).toBe('yes');
            expect(passport.travelDetails).toBe('Conference attendance');
            expect(new Date(passport.fromDate).toISOString().split('T')[0]).toBe('2025-03-15');
            expect(new Date(passport.toDate).toISOString().split('T')[0]).toBe('2025-03-25');
        });

        it('should return 404 for non-existent student', async () => {
            const nonExistentId = new mongoose.Types.ObjectId();
            const passportData = {
                applicationType: 'fresh',
                placeOfBirth: 'Delhi',
                semester: 3,
                mode: 'normal',
                travelPlans: 'no',
                travelDetails: ''
            };

            const response = await agent
                .post(`/api/student/${nonExistentId}/passport/apply`)
                .send(passportData);

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Student not found');
        });

        it('should handle server errors gracefully', async () => {
            // Create invalid ObjectId to trigger a server error
            const invalidId = 'invalid-id';
            const passportData = {
                applicationType: 'fresh',
                placeOfBirth: 'Delhi',
                semester: 3,
                mode: 'normal',
                travelPlans: 'no',
                travelDetails: ''
            };

            const response = await agent
                .post(`/api/student/${invalidId}/passport/apply`)
                .send(passportData);

            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty('message');
        });
    });

    // Tests for getPassportApplications
    describe('GET /api/student/:id/passport/applications', () => {
        it('should fetch passport applications history successfully', async () => {
            const response = await agent
                .get(`/api/student/${testUser._id}/passport/applications`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(1);

            const application = response.body[0];
            expect(application).toHaveProperty('applicationDate');
            expect(application.applicationType).toBe('fresh');
            expect(application.mode).toBe('normal');
            expect(application).toHaveProperty('remarks');
            expect(application.otherDetails).toBe('Regular Application');
            expect(application.documentStatus).toBe('Documents Under Review');
            expect(application.currentStatus).toBe('Pending');
        });

        it('should return an empty array when no applications exist', async () => {
            // Delete existing applications first
            await Passport.deleteMany({});
            await ApplicationDocument.deleteMany({});

            const response = await agent
                .get(`/api/student/${testUser._id}/passport/applications`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(0);
        });

        it('should return 404 for non-existent student', async () => {
            const nonExistentId = new mongoose.Types.ObjectId();
            const response = await agent
                .get(`/api/student/${nonExistentId}/passport/applications`);

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Student not found');
        });

        it('should handle server errors gracefully', async () => {
            // Create invalid ObjectId to trigger a server error
            const invalidId = 'invalid-id';
            const response = await agent
                .get(`/api/student/${invalidId}/passport/applications`);

            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty('message');
        });
    });
});


