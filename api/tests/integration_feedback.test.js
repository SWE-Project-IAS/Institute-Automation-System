import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../index.js';
import { closeDB, resetDBConnectionForTests } from '../database/mongoDb.js';
import { Course } from '../models/course.model.js';
import { Faculty } from '../models/faculty.model.js';
import { Student } from '../models/student.model.js';
import { User } from '../models/user.model.js';
import { Feedback, GlobalFeedbackConfig } from '../models/feedback.model.js';

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

describe('Feedback API Integration Tests', () => {
    let testUser;
    let testFaculty;
    let testFacultyUser;
    let testStudent;
    let testStudentUser;
    let testCourse;

    // Setup before each test
    beforeEach(async () => {
        // Create a faculty user
        testFacultyUser = new User({
            name: 'Test Faculty',
            email: 'testfaculty@example.com',
            role: 'faculty',
            password: 'hashedpassword123',
            refreshToken: 'refreshToken'
        });
        await testFacultyUser.save();

        // Create a faculty
        testFaculty = new Faculty({
            userId: testFacultyUser._id,
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

        // Create a global feedback config
        await GlobalFeedbackConfig.create({
            isActive: true
        });
    });

    // Cleanup after each test
    afterEach(async () => {
        await Course.deleteMany({});
        await Faculty.deleteMany({});
        await Student.deleteMany({});
        await User.deleteMany({});
        await Feedback.deleteMany({});
        await GlobalFeedbackConfig.deleteMany({});
    });

    // Test for checking feedback status
    describe('GET /api/feedback/status/:userId/:courseCode/:facultyId', () => {
        it('should return no feedback submitted when student has not submitted feedback', async () => {
            const response = await agent
                .get(`/api/feedback/status/${testStudent._id}/${testCourse.courseCode}/${testFacultyUser._id}`);
            
            expect(response.status).toBe(200);
            expect(response.body.feedbackSubmitted).toBe(false);
            expect(response.body.lastSubmitted).toBeUndefined();
        });

        it('should return feedback submitted status when student has submitted feedback', async () => {
            // Create a feedback record first
            const feedback = new Feedback({
                student: testStudent._id,
                faculty: testFaculty._id,
                course: testCourse._id,
                ratings: [
                    { questionId: 'teaching_quality', rating: 4 },
                    { questionId: 'course_content', rating: 5 }
                ],
                comments: 'Great course!'
            });
            await feedback.save();

            const response = await agent
                .get(`/api/feedback/status/${testStudent._id}/${testCourse.courseCode}/${testFacultyUser._id}`);
            
            expect(response.status).toBe(200);
            expect(response.body.feedbackSubmitted).toBe(true);
            expect(response.body.lastSubmitted).toBeTruthy();
        });

        it('should handle course not found error', async () => {
            const response = await agent
                .get(`/api/feedback/status/${testStudent._id}/INVALID/${testFacultyUser._id}`);
            
            expect(response.status).toBe(404);
            expect(response.body.error).toBe('Course not found');
        });

        it('should handle faculty not found error', async () => {
            const invalidFacultyId = new mongoose.Types.ObjectId();
            const response = await agent
                .get(`/api/feedback/status/${testStudent._id}/${testCourse.courseCode}/${invalidFacultyId}`);
            
            expect(response.status).toBe(404);
            expect(response.body.error).toBe('Faculty not found');
        });
    });

    // Test for submitting feedback
    describe('POST /api/feedback/submit', () => {
        it('should submit new feedback successfully', async () => {
            const feedbackData = {
                student: testStudent.userId,
                faculty: testFaculty.userId,
                course: testCourse.courseCode,
                ratings: [
                    { questionId: 'teaching_quality', rating: 5 },
                    { questionId: 'faculty_knowledge', rating: 4 },
                    { questionId: 'course_content', rating: 5 },
                    { questionId: 'course_materials', rating: 4 },
                    { questionId: 'course_organization', rating: 4 },
                    { questionId: 'faculty_availability', rating: 3 },
                    { questionId: 'assessment_fairness', rating: 4 },
                    { questionId: 'feedback_quality', rating: 5 }
                ],
                comments: 'This was an excellent course with well-prepared materials.'
            };

            const response = await agent
                .post('/api/feedback/submit')
                .send(feedbackData);

            expect(response.status).toBe(201);
            expect(response.body.message).toBe('Feedback submitted successfully');
            expect(response.body.feedback).toHaveProperty('id');
            expect(response.body.feedback).toHaveProperty('updatedAt');

            // Verify feedback was saved
            const savedFeedback = await Feedback.findById(response.body.feedback.id);
            expect(savedFeedback).toBeTruthy();
            expect(savedFeedback.comments).toBe(feedbackData.comments);
            expect(savedFeedback.ratings.length).toBe(8);
        });

        it('should update existing feedback', async () => {
            // First submit feedback
            const initialFeedback = new Feedback({
                student: testStudent._id,
                faculty: testFaculty._id,
                course: testCourse._id,
                ratings: [
                    { questionId: 'teaching_quality', rating: 3 },
                    { questionId: 'course_content', rating: 3 }
                ],
                comments: 'Initial feedback'
            });
            await initialFeedback.save();

            // Update the feedback
            const updatedFeedbackData = {
                student: testStudent.userId,
                faculty: testFaculty.userId,
                course: testCourse.courseCode,
                ratings: [
                    { questionId: 'teaching_quality', rating: 5 },
                    { questionId: 'course_content', rating: 4 }
                ],
                comments: 'Updated feedback'
            };

            const response = await agent
                .post('/api/feedback/submit')
                .send(updatedFeedbackData);

            expect(response.status).toBe(201);
            
            // Verify feedback was updated
            const updatedFeedback = await Feedback.findById(initialFeedback._id);
            expect(updatedFeedback.comments).toBe('Updated feedback');
            expect(updatedFeedback.ratings[0].rating).toBe(5);
        });

        it('should handle invalid rating values', async () => {
            const invalidFeedbackData = {
                student: testStudent.userId,
                faculty: testFaculty.userId,
                course: testCourse.courseCode,
                ratings: [
                    { questionId: 'teaching_quality', rating: 10 }, // Invalid rating
                    { questionId: 'course_content', rating: 4 }
                ],
                comments: 'Test feedback'
            };

            const response = await agent
                .post('/api/feedback/submit')
                .send(invalidFeedbackData);

            expect(response.status).toBe(201); // Should still succeed as rating is clamped
            
            // Verify rating was clamped to max value
            const savedFeedback = await Feedback.findOne({ 
                student: testStudent._id,
                course: testCourse._id
            });
            
            const teachingQualityRating = savedFeedback.ratings.find(
                r => r.questionId === 'teaching_quality'
            );
            expect(teachingQualityRating.rating).toBe(5); // Should be clamped to 5
        });
    });

    // Test for getting feedback data
    describe('GET /api/feedback/faculty/:facultyId/:courseCode', () => {
        beforeEach(async () => {
            // Create feedback from multiple students
            const feedback1 = new Feedback({
                student: testStudent._id,
                faculty: testFaculty._id,
                course: testCourse._id,
                ratings: [
                    { questionId: 'teaching_quality', rating: 5 },
                    { questionId: 'faculty_knowledge', rating: 5 },
                    { questionId: 'course_content', rating: 4 },
                    { questionId: 'course_materials', rating: 3 },
                    { questionId: 'course_organization', rating: 4 },
                    { questionId: 'faculty_availability', rating: 3 },
                    { questionId: 'assessment_fairness', rating: 5 },
                    { questionId: 'feedback_quality', rating: 4 }
                ],
                comments: 'Student 1 feedback'
            });
            await feedback1.save();

            // Create second student
            const student2User = new User({
                name: 'Student 2',
                email: 'student2@example.com',
                role: 'student',
                password: 'hashedpassword789',
                refreshToken: 'refreshToken'
            });
            await student2User.save();

            const student2 = new Student({
                userId: student2User._id,
                email: 'student2@example.com',
                rollNo: 'CS20B002',
                fatherName: 'Father 2',
                motherName: 'Mother 2',
                department: 'Computer Science',
                semester: 5,
                batch: '2020',
                program: 'BTech',
                status: 'active',
                hostel: 'Brahmaputra',
                roomNo: 'A-102'
            });
            await student2.save();

            const feedback2 = new Feedback({
                student: student2._id,
                faculty: testFaculty._id,
                course: testCourse._id,
                ratings: [
                    { questionId: 'teaching_quality', rating: 4 },
                    { questionId: 'faculty_knowledge', rating: 5 },
                    { questionId: 'course_content', rating: 5 },
                    { questionId: 'course_materials', rating: 4 },
                    { questionId: 'course_organization', rating: 3 },
                    { questionId: 'faculty_availability', rating: 4 },
                    { questionId: 'assessment_fairness', rating: 3 },
                    { questionId: 'feedback_quality', rating: 4 }
                ],
                comments: 'Student 2 feedback'
            });
            await feedback2.save();
        });

        it('should get feedback statistics for faculty and course', async () => {
            const response = await agent
                .get(`/api/feedback/faculty/${testFacultyUser._id}/${testCourse.courseCode}`);
            
            expect(response.status).toBe(200);
            expect(response.body.statistics.totalFeedbacks).toBe(2);
            
            // Check the structure of statistics
            expect(response.body.statistics).toHaveProperty('sections');
            expect(response.body.statistics.sections.length).toBe(3); // Three sections
            
            // Verify calculated averages
            const facultyEvalSection = response.body.statistics.sections.find(
                s => s.id === 'faculty_evaluation_section'
            );
            
            expect(facultyEvalSection.questions).toHaveProperty('teaching_quality');
            expect(facultyEvalSection.questions.teaching_quality.average).toBe(4.5); // (5+4)/2 = 4.5
            expect(facultyEvalSection.questions.teaching_quality.totalResponses).toBe(2);
            
            // Verify feedback comments are included
            expect(response.body.feedback.length).toBe(2);
            expect(response.body.feedback[0]).toHaveProperty('comments');
        });

        it('should handle course not found error', async () => {
            const response = await agent
                .get(`/api/feedback/faculty/${testFacultyUser._id}/INVALID`);
            
            expect(response.status).toBe(404);
            expect(response.body.error).toBe('Course not found');
        });

        it('should handle faculty not found error', async () => {
            const invalidFacultyId = new mongoose.Types.ObjectId();
            const response = await agent
                .get(`/api/feedback/faculty/${invalidFacultyId}/${testCourse.courseCode}`);
            
            expect(response.status).toBe(404);
            expect(response.body.error).toBe('Faculty not found');
        });
    });

    // Test for course details endpoint
    describe('GET /api/feedback/course/:courseCode/details', () => {
        it('should get course details successfully', async () => {
            const response = await agent
                .get(`/api/feedback/course/${testCourse.courseCode}/details`);
            
            expect(response.status).toBe(200);
            expect(response.body.courseCode).toBe(testCourse.courseCode);
            expect(response.body.courseName).toBe(testCourse.courseName);
            expect(response.body.department).toBe(testCourse.department);
            expect(response.body.credits).toBe(testCourse.credits);
        });

        it('should handle course not found error', async () => {
            const response = await agent
                .get('/api/feedback/course/INVALID/details');
            
            expect(response.status).toBe(404);
            expect(response.body.error).toBe('Course not found');
        });
    });

    // Test for global feedback status
    describe('Global Feedback Status APIs', () => {
        it('should get global feedback status', async () => {
            const response = await agent
                .get('/api/feedback/admin/status');
            
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('isActive', true);
        });

        it('should update global feedback status', async () => {
            const response = await agent
                .post('/api/feedback/admin/set')
                .send({ active: false });
            
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Feedback status updated');
            expect(response.body.isActive).toBe(false);
            
            // Verify it was updated in the database
            const config = await GlobalFeedbackConfig.findOne();
            expect(config.isActive).toBe(false);
        });

        it('should handle invalid input for global status update', async () => {
            const response = await agent
                .post('/api/feedback/admin/set')
                .send({ active: 'not-a-boolean' });
            
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Invalid request: active must be a boolean');
        });
    });
});