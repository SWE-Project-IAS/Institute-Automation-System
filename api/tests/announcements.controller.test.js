import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';

// Mock the models before importing the controller
jest.mock('../models/course.model.js', () => ({
    Course: {
        findOne: jest.fn(),
    },
    StudentCourse: {}, // Just a mock placeholder
}));

jest.mock('../models/faculty.model.js', () => ({
    Faculty: {
        find: jest.fn(),
    }
}));

jest.mock('../models/student.model.js', () => ({
    Student: {}
}));

jest.mock('../models/user.model.js', () => ({
    User: {}
}));

// Import controller after mocks are set up
import {
    getCourseAnnouncements,
    addCourseAnnouncement,
    updateCourseAnnouncement,
    deleteCourseAnnouncement,
} from '../controllers/announcements.controller.js';

// Get access to the mocked models
import { Course } from '../models/course.model.js';
import { Faculty } from '../models/faculty.model.js';

// Setup express app for testing
const app = express();
app.use(bodyParser.json());

// Define routes
app.get('/api/courses/:courseId/announcements', getCourseAnnouncements);
app.post('/api/courses/:courseId/announcements', addCourseAnnouncement);
app.put('/api/courses/:courseId/announcements/:announcementId', updateCourseAnnouncement);
app.delete('/api/courses/:courseId/announcements/:announcementId', deleteCourseAnnouncement);

describe('Course Announcements API', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/courses/:courseId/announcements', () => {
        it('should return announcements for a valid course with faculty details', async () => {
            // Mock announcement with toObject method
            const mockAnnouncement = {
                _id: '1',
                title: 'Test Announcement',
                content: 'Hello World',
                postedBy: 'F123',
                date: new Date('2025-01-01'),
                toObject: function () {
                    return {
                        _id: this._id,
                        title: this.title,
                        content: this.content,
                        postedBy: this.postedBy,
                        date: this.date
                    };
                }
            };

            // Mock course with announcements
            const mockCourse = {
                courseCode: 'CS101',
                announcements: [mockAnnouncement],
                toObject: function () {
                    return {
                        courseCode: this.courseCode,
                        announcements: this.announcements.map(a => a.toObject())
                    };
                }
            };

            // Mock faculty data
            const mockFaculty = [
                {
                    facultyId: 'F123',
                    name: 'John Doe',
                    email: 'john@example.com',
                    department: 'CS',
                    designation: 'Professor'
                }
            ];

            // Set up the mock returns
            Course.findOne.mockResolvedValue(mockCourse);
            Faculty.find.mockResolvedValue(mockFaculty);

            // Make request
            const res = await request(app).get('/api/courses/CS101/announcements');

            // Assertions
            expect(res.status).toBe(200);
            expect(res.body.announcements).toHaveLength(1);
            expect(res.body.announcements[0].faculty).toEqual({
                name: 'John Doe',
                email: 'john@example.com',
                department: 'CS',
                designation: 'Professor'
            });
        });

        it('should return 404 if course not found', async () => {
            // Set up mock to return null (course not found)
            Course.findOne.mockResolvedValue(null);

            // Make request
            const res = await request(app).get('/api/courses/INVALID/announcements');

            // Assertions
            expect(res.status).toBe(404);
            expect(res.body.message).toBe('Course not found');
        });


        it('should handle server errors', async () => {
            // Set up mock to throw an error
            Course.findOne.mockRejectedValue(new Error('Database error'));

            // Make request
            const res = await request(app).get('/api/courses/CS101/announcements');

            // Assertions
            expect(res.status).toBe(500);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Failed to fetch course announcements');
        });
    });

    describe('POST /api/courses/:courseId/announcements', () => {
        it('should add a new announcement successfully', async () => {
            // Mock course with an empty announcements array and save method
            const mockCourse = {
                courseCode: 'CS101',
                announcements: [],
                save: jest.fn().mockResolvedValue(true)
            };

            Course.findOne.mockResolvedValue(mockCourse);

            // Request body
            const announcementData = {
                title: 'New Announcement',
                content: 'Announcement content details',
                importance: 'High',
                postedBy: 'F123'
            };

            // Make request
            const res = await request(app)
                .post('/api/courses/CS101/announcements')
                .send(announcementData);

            // Assertions
            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.announcement.title).toBe('New Announcement');
            expect(res.body.announcement.importance).toBe('High');
            expect(mockCourse.save).toHaveBeenCalled();
        });

        it('should return 400 for missing required fields', async () => {
            // Request with missing fields
            const res = await request(app)
                .post('/api/courses/CS101/announcements')
                .send({ title: 'Test', content: '' }); // Missing postedBy

            // Assertions
            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });

        it('should return 404 if course not found', async () => {
            Course.findOne.mockResolvedValue(null);

            const res = await request(app)
                .post('/api/courses/INVALID/announcements')
                .send({ title: 'Test', content: 'Content', postedBy: 'F123' });

            expect(res.status).toBe(404);
            expect(res.body.message).toBe('Course not found');
        });

        it('should handle server errors', async () => {
            Course.findOne.mockRejectedValue(new Error('Database error'));

            const res = await request(app)
                .post('/api/courses/CS101/announcements')
                .send({ title: 'Test', content: 'Content', postedBy: 'F123' });

            expect(res.status).toBe(500);
            expect(res.body.success).toBe(false);
        });
    });

    describe('PUT /api/courses/:courseId/announcements/:announcementId', () => {
        it('should update an existing announcement', async () => {
            // Mock announcement with an ID that matches the request
            const mockAnnouncement = {
                id: '123',
                title: 'Old Title',
                content: 'Old Content',
                importance: 'Low',
                attachments: []
            };

            // Mock course with the announcement and save method
            const mockCourse = {
                courseCode: 'CS101',
                announcements: [mockAnnouncement],
                save: jest.fn().mockResolvedValue(true)
            };

            Course.findOne.mockResolvedValue(mockCourse);

            // Update data
            const updateData = {
                title: 'Updated Title',
                content: 'Updated Content',
                importance: 'High'
            };

            // Make request
            const res = await request(app)
                .put('/api/courses/CS101/announcements/123')
                .send(updateData);

            // Assertions
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.announcement.title).toBe('Updated Title');
            expect(res.body.announcement.importance).toBe('High');
            expect(mockCourse.save).toHaveBeenCalled();
        });

        it('should return 400 for missing required fields', async () => {
            const res = await request(app)
                .put('/api/courses/CS101/announcements/123')
                .send({ title: '', content: '' }); // Empty fields

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });

        it('should return 404 if announcement not found', async () => {
            // Mock course without the requested announcement
            const mockCourse = {
                courseCode: 'CS101',
                announcements: [{ id: '456' }], // Different ID
                save: jest.fn()
            };

            Course.findOne.mockResolvedValue(mockCourse);

            const res = await request(app)
                .put('/api/courses/CS101/announcements/123')
                .send({ title: 'Updated', content: 'Content' });

            expect(res.status).toBe(404);
            expect(res.body.message).toBe('Announcement not found');
        });
    });

    describe('DELETE /api/courses/:courseId/announcements/:announcementId', () => {
        it('should delete an announcement successfully', async () => {
            // Mock announcement with matching ID
            const mockAnnouncement = { id: '123' };

            // Mock course with the announcement and save method
            const mockCourse = {
                courseCode: 'CS101',
                announcements: [mockAnnouncement],
                save: jest.fn().mockResolvedValue(true)
            };

            Course.findOne.mockResolvedValue(mockCourse);

            // Make request
            const res = await request(app)
                .delete('/api/courses/CS101/announcements/123');

            // Assertions
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe('Announcement deleted successfully');
            expect(mockCourse.announcements).toHaveLength(0);
            expect(mockCourse.save).toHaveBeenCalled();
        });

        it('should return 404 if course not found', async () => {
            Course.findOne.mockResolvedValue(null);

            const res = await request(app)
                .delete('/api/courses/INVALID/announcements/123');

            expect(res.status).toBe(404);
            expect(res.body.message).toBe('Course not found');
        });

        it('should return 404 if announcement not found', async () => {
            // Mock course without the requested announcement
            const mockCourse = {
                courseCode: 'CS101',
                announcements: [{ id: '456' }], // Different ID
                save: jest.fn()
            };

            Course.findOne.mockResolvedValue(mockCourse);

            const res = await request(app)
                .delete('/api/courses/CS101/announcements/123');

            expect(res.status).toBe(404);
            expect(res.body.message).toBe('Announcement not found');
        });

        it('should handle server errors', async () => {
            Course.findOne.mockRejectedValue(new Error('Database error'));

            const res = await request(app)
                .delete('/api/courses/CS101/announcements/123');

            expect(res.status).toBe(500);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Failed to delete announcement');
        });
    });
});