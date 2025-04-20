import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../index.js';
import { closeDB, resetDBConnectionForTests } from '../database/mongoDb.js';
import { User } from '../models/user.model.js';
import { Faculty } from '../models/faculty.model.js';
import { Student } from '../models/student.model.js';
import { AcadAdmin } from '../models/acadAdmin.model.js';
import { HostelAdmin } from '../models/hostelAdmin.model.js';
import bcrypt from 'bcrypt';

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

describe('Auth API Tests', () => {
    let testUser;
    let testFaculty;

    // Setup before each test
    beforeEach(async () => {
        // Create test user
        testUser = new User({
            name: 'Test Faculty',
            email: 'testfaculty@example.com',
            password: await bcrypt.hash('testpassword123', 10),
            refreshToken: 'dummy-refresh-token'
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
    });

    // Cleanup after each test
    afterEach(async () => {
        await User.deleteMany({});
        await Faculty.deleteMany({});
        await Student.deleteMany({});
        await AcadAdmin.deleteMany({});
        await HostelAdmin.deleteMany({});
    });

    describe('POST /api/auth/login', () => {
        it('should login successfully with valid credentials', async () => {
            const loginData = {
                email: 'testfaculty@example.com',
                password: 'testpassword123',
                role: 'faculty'
            };

            const response = await agent
                .post('/api/auth/login')
                .send(loginData);

            expect(response.status).toBe(200);
            expect(response.body.user).toBeDefined();
            expect(response.body.user.email).toBe(loginData.email);
            expect(response.headers['set-cookie']).toBeDefined();
        });

        it('should handle invalid credentials', async () => {
            const loginData = {
                email: 'testfaculty@example.com',
                password: 'wrongpassword',
                role: 'faculty'
            };

            const response = await agent
                .post('/api/auth/login')
                .send(loginData);

            expect(response.status).toBe(401);
            expect(response.body.message).toBe('Invalid credentials');
        });

        it('should handle missing required fields', async () => {
            const loginData = {
                email: 'testfaculty@example.com'
                // missing password and role
            };

            const response = await agent
                .post('/api/auth/login')
                .send(loginData);

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Email, password, and role are required');
        });
    });

    describe('POST /api/auth/refresh', () => {
        it('should refresh token successfully', async () => {
            // First login to get refresh token
            const loginResponse = await agent
                .post('/api/auth/login')
                .send({
                    email: 'testfaculty@example.com',
                    password: 'testpassword123',
                    role: 'faculty'
                });

            const cookies = loginResponse.headers['set-cookie'];

            const response = await agent
                .post('/api/auth/refresh')
                .set('Cookie', cookies);

            expect(response.status).toBe(200);
            expect(response.body.user).toBeDefined();
            expect(response.headers.authorization).toBeDefined();
        });

        it('should handle invalid refresh token', async () => {
            const response = await agent
                .post('/api/auth/refresh')
                .set('Cookie', ['refreshToken=invalid_token']);

            expect(response.status).toBe(403);
            expect(response.body.message).toBe('invalid token,login again');
        });
    });

    describe('POST /api/auth/logout', () => {
        it('should logout successfully', async () => {
            // First login to get tokens
            const loginResponse = await agent
                .post('/api/auth/login')
                .send({
                    email: 'testfaculty@example.com',
                    password: 'testpassword123',
                    role: 'faculty'
                });

            const cookies = loginResponse.headers['set-cookie'];

            const response = await agent
                .post('/api/auth/logout')
                .set('Cookie', cookies);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Logout successful');
        });
    });
});
