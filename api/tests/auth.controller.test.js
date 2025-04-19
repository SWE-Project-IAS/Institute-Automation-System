import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { login, refresh, logout } from '../controllers/auth.controller';

// Mock all required models and middleware
jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../models/user.model', () => ({
    User: {
        findOne: jest.fn(),
    }
}));
jest.mock('../models/student.model', () => ({
    Student: {
        findOne: jest.fn(),
    }
}));
jest.mock('../models/faculty.model', () => ({
    Faculty: {
        findOne: jest.fn(),
    }
}));
jest.mock('../models/acadAdmin.model', () => ({
    AcadAdmin: {
        findOne: jest.fn(),
    }
}));
jest.mock('../models/hostelAdmin.model', () => ({
    HostelAdmin: {
        findOne: jest.fn(),
    }
}));
jest.mock('../middleware/auth.middleware', () => ({
    validateAccessToken: jest.fn(),
    validateRefreshToken: jest.fn(),
    findUserByEmail: jest.fn(),
    verifyRefreshTokenInDB: jest.fn(),
}));

describe('Authentication Controller', () => {
    // Common setup before each test
    let mockReq, mockRes, mockNext;

    beforeEach(() => {
        // Setup environment variables
        process.env.ACCESS_TOKEN_SECRET = 'test-access-secret';
        process.env.REFRESH_TOKEN_SECRET = 'test-refresh-secret';

        // Reset request and response mocks
        mockReq = {
            body: {},
            user: {},
            foundUser: {},
            cookies: {}
        };

        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
            header: jest.fn().mockReturnThis(),
            cookie: jest.fn().mockReturnThis(),
            clearCookie: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis()
        };

        mockNext = jest.fn();

        // Clear all mocks
        jest.clearAllMocks();
    });

    // Login Tests
    describe('Login Function', () => {
        test('should return 400 if email is missing', async () => {
            mockReq.body = { password: 'password123', role: 'student' };
            await login(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Email, password, and role are required'
            });
        });

        test('should return 400 if password is missing', async () => {
            mockReq.body = { email: 'test@example.com', role: 'student' };
            await login(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Email, password, and role are required'
            });
        });

        test('should return 400 if role is missing', async () => {
            mockReq.body = { email: 'test@example.com', password: 'password123' };
            await login(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Email, password, and role are required'
            });
        });

        test('should return 401 if user not found', async () => {
            mockReq.body = {
                email: 'nonexistent@example.com',
                password: 'password123',
                role: 'student'
            };

            // Mock User.findOne to return null (user not found)
            const { User } = require('../models/user.model');
            User.findOne.mockResolvedValue(null);

            await login(mockReq, mockRes);

            expect(User.findOne).toHaveBeenCalledWith({ email: 'nonexistent@example.com' });
            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Invalid credentials'
            });
        });

        test('should return 401 if password is incorrect', async () => {
            const mockUser = {
                _id: 'user123',
                email: 'test@example.com',
                password: 'hashedpassword'
            };

            mockReq.body = {
                email: 'test@example.com',
                password: 'wrongpassword',
                role: 'student'
            };

            // Mock dependencies
            const { User } = require('../models/user.model');
            User.findOne.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(false);

            await login(mockReq, mockRes);

            expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
            expect(bcrypt.compare).toHaveBeenCalledWith('wrongpassword', 'hashedpassword');
            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Invalid credentials'
            });
        });

        test('should return 401 if student role not found', async () => {
            const mockUser = {
                _id: 'user123',
                email: 'test@example.com',
                password: 'hashedpassword'
            };

            mockReq.body = {
                email: 'test@example.com',
                password: 'correctpassword',
                role: 'student'
            };

            // Mock dependencies
            const { User } = require('../models/user.model');
            const { Student } = require('../models/student.model');
            User.findOne.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(true);
            Student.findOne.mockResolvedValue(null);

            await login(mockReq, mockRes);

            expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
            expect(bcrypt.compare).toHaveBeenCalledWith('correctpassword', 'hashedpassword');
            expect(Student.findOne).toHaveBeenCalledWith({ userId: 'user123' });
            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Invalid role'
            });
        });

        test('should return 401 if faculty role not found', async () => {
            const mockUser = {
                _id: 'user123',
                email: 'faculty@example.com',
                password: 'hashedpassword'
            };

            mockReq.body = {
                email: 'faculty@example.com',
                password: 'correctpassword',
                role: 'faculty'
            };

            // Mock dependencies
            const { User } = require('../models/user.model');
            const { Faculty } = require('../models/faculty.model');
            User.findOne.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(true);
            Faculty.findOne.mockResolvedValue(null);

            await login(mockReq, mockRes);

            expect(User.findOne).toHaveBeenCalledWith({ email: 'faculty@example.com' });
            expect(bcrypt.compare).toHaveBeenCalledWith('correctpassword', 'hashedpassword');
            expect(Faculty.findOne).toHaveBeenCalledWith({ userId: 'user123' });
            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Invalid role'
            });
        });

        test('should return 401 if acadAdmin role not found', async () => {
            const mockUser = {
                _id: 'user123',
                email: 'admin@example.com',
                password: 'hashedpassword'
            };

            mockReq.body = {
                email: 'admin@example.com',
                password: 'correctpassword',
                role: 'acadAdmin'
            };

            // Mock dependencies
            const { User } = require('../models/user.model');
            const { AcadAdmin } = require('../models/acadAdmin.model');
            User.findOne.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(true);
            AcadAdmin.findOne.mockResolvedValue(null);

            await login(mockReq, mockRes);

            expect(User.findOne).toHaveBeenCalledWith({ email: 'admin@example.com' });
            expect(bcrypt.compare).toHaveBeenCalledWith('correctpassword', 'hashedpassword');
            expect(AcadAdmin.findOne).toHaveBeenCalledWith({ userId: 'user123' });
            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Invalid role'
            });
        });

        test('should return 401 if hostelAdmin role not found', async () => {
            const mockUser = {
                _id: 'user123',
                email: 'hostel@example.com',
                password: 'hashedpassword'
            };

            mockReq.body = {
                email: 'hostel@example.com',
                password: 'correctpassword',
                role: 'nonAcadAdmin'
            };

            // Mock dependencies
            const { User } = require('../models/user.model');
            const { HostelAdmin } = require('../models/hostelAdmin.model');
            User.findOne.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(true);
            HostelAdmin.findOne.mockResolvedValue(null);

            await login(mockReq, mockRes);

            expect(User.findOne).toHaveBeenCalledWith({ email: 'hostel@example.com' });
            expect(bcrypt.compare).toHaveBeenCalledWith('correctpassword', 'hashedpassword');
            expect(HostelAdmin.findOne).toHaveBeenCalledWith({ userId: 'user123' });
            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Invalid role'
            });
        });

        test('should return 400 if role is invalid', async () => {
            const mockUser = {
                _id: 'user123',
                email: 'test@example.com',
                password: 'hashedpassword'
            };

            mockReq.body = {
                email: 'test@example.com',
                password: 'correctpassword',
                role: 'invalidRole'
            };

            // Mock dependencies
            const { User } = require('../models/user.model');
            User.findOne.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(true);

            await login(mockReq, mockRes);

            expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
            expect(bcrypt.compare).toHaveBeenCalledWith('correctpassword', 'hashedpassword');
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Invalid role'
            });
        });

        test('should successfully login as student and return tokens', async () => {
            const mockUser = {
                _id: 'user123',
                email: 'student@example.com',
                password: 'hashedpassword',
                save: jest.fn().mockResolvedValue(true)
            };

            const mockStudent = {
                userId: 'user123',
                email: 'student@example.com'
            };

            mockReq.body = {
                email: 'student@example.com',
                password: 'correctpassword',
                role: 'student'
            };

            // Mock dependencies
            const { User } = require('../models/user.model');
            const { Student } = require('../models/student.model');
            User.findOne.mockResolvedValue(mockUser);
            Student.findOne.mockResolvedValue(mockStudent);
            bcrypt.compare.mockResolvedValue(true);

            jwt.sign
                .mockReturnValueOnce('mockAccessToken')  // First call for access token
                .mockReturnValueOnce('mockRefreshToken'); // Second call for refresh token

            await login(mockReq, mockRes);

            expect(User.findOne).toHaveBeenCalledWith({ email: 'student@example.com' });
            expect(bcrypt.compare).toHaveBeenCalledWith('correctpassword', 'hashedpassword');
            expect(Student.findOne).toHaveBeenCalledWith({ userId: 'user123' });

            // Verify JWT token creation
            expect(jwt.sign).toHaveBeenCalledTimes(2);
            expect(jwt.sign).toHaveBeenNthCalledWith(
                1,
                { user: { email: 'student@example.com', role: 'student' } },
                'test-access-secret',
                { expiresIn: '1h' }
            );
            expect(jwt.sign).toHaveBeenNthCalledWith(
                2,
                { user: { email: 'student@example.com', role: 'student' } },
                'test-refresh-secret',
                { expiresIn: '1d' }
            );

            // Verify refresh token is saved
            expect(mockUser.refreshToken).toBe('mockRefreshToken');
            expect(mockUser.save).toHaveBeenCalled();

            // Verify response
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.cookie).toHaveBeenCalledTimes(3);
            expect(mockRes.cookie).toHaveBeenCalledWith(
                'user',
                JSON.stringify({ email: 'student@example.com', userId: 'user123', role: 'student' }),
                expect.objectContaining({
                    httpOnly: false,
                    sameSite: 'none',
                    maxAge: 86400000,
                    secure: true
                })
            );
            expect(mockRes.cookie).toHaveBeenCalledWith(
                'refreshToken',
                'mockRefreshToken',
                expect.objectContaining({
                    httpOnly: false,
                    sameSite: 'none',
                    maxAge: 86400000,
                    secure: true
                })
            );
            expect(mockRes.cookie).toHaveBeenCalledWith(
                'accessToken',
                'mockAccessToken',
                expect.objectContaining({
                    httpOnly: false,
                    sameSite: 'none',
                    maxAge: 86400000,
                    secure: true
                })
            );
            expect(mockRes.header).toHaveBeenCalledWith('Authorization', 'mockAccessToken');
            expect(mockRes.json).toHaveBeenCalledWith({
                user: {
                    email: 'student@example.com',
                    userId: 'user123'
                }
            });
        });

        test('should successfully login as faculty and return tokens', async () => {
            const mockUser = {
                _id: 'user456',
                email: 'faculty@example.com',
                password: 'hashedpassword',
                save: jest.fn().mockResolvedValue(true)
            };

            const mockFaculty = {
                userId: 'user456',
                email: 'faculty@example.com'
            };

            mockReq.body = {
                email: 'faculty@example.com',
                password: 'correctpassword',
                role: 'faculty'
            };

            // Mock dependencies
            const { User } = require('../models/user.model');
            const { Faculty } = require('../models/faculty.model');
            User.findOne.mockResolvedValue(mockUser);
            Faculty.findOne.mockResolvedValue(mockFaculty);
            bcrypt.compare.mockResolvedValue(true);

            jwt.sign
                .mockReturnValueOnce('mockAccessToken')
                .mockReturnValueOnce('mockRefreshToken');

            await login(mockReq, mockRes);

            expect(User.findOne).toHaveBeenCalledWith({ email: 'faculty@example.com' });
            expect(Faculty.findOne).toHaveBeenCalledWith({ userId: 'user456' });
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                user: {
                    email: 'faculty@example.com',
                    userId: 'user456'
                }
            });
        });

        test('should handle database errors gracefully', async () => {
            mockReq.body = {
                email: 'test@example.com',
                password: 'password123',
                role: 'student'
            };

            // Mock User.findOne to throw an error
            const { User } = require('../models/user.model');
            User.findOne.mockRejectedValue(new Error('Database connection error'));

            await login(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.send).toHaveBeenCalledWith('Something went wrong!');
        });
    });

    // Refresh Token Tests
    describe('Refresh Token Function', () => {
        test('should refresh access token when valid refresh token is provided', async () => {
            // This test would need to mock the middleware chain
            // Since refresh is an array of middleware functions, we'd need to test the last function
            const refreshHandler = refresh[3]; // The actual handler is the last middleware

            mockReq.foundUser = {
                email: 'test@example.com',
                role: 'student'
            };

            jwt.sign.mockReturnValue('newAccessToken');

            await refreshHandler(mockReq, mockRes);

            expect(jwt.sign).toHaveBeenCalledWith(
                { user: { email: 'test@example.com', role: 'student' } },
                'test-access-secret',
                { expiresIn: '1h' }
            );
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.header).toHaveBeenCalledWith('Authorization', 'newAccessToken');
            expect(mockRes.json).toHaveBeenCalledWith({
                user: { email: 'test@example.com', role: 'student' }
            });
        });

        test('should handle errors during token refresh', async () => {
            const refreshHandler = refresh[3];

            mockReq.foundUser = {
                email: 'test@example.com',
                role: 'student'
            };

            jwt.sign.mockImplementation(() => {
                throw new Error('JWT signing error');
            });

            await refreshHandler(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.send).toHaveBeenCalledWith('Internal server error');
        });
    });

    // Logout Tests
    describe('Logout Function', () => {
        test('should successfully logout user and clear cookies', async () => {
            const logoutHandler = logout[1]; // The actual handler is the second middleware

            await logoutHandler(mockReq, mockRes);

            expect(mockRes.clearCookie).toHaveBeenCalledTimes(3);
            expect(mockRes.clearCookie).toHaveBeenCalledWith('refreshToken', { httpOnly: false, sameSite: 'strict' });
            expect(mockRes.clearCookie).toHaveBeenCalledWith('accessToken', { httpOnly: false, sameSite: 'strict' });
            expect(mockRes.clearCookie).toHaveBeenCalledWith('user', { httpOnly: false, sameSite: 'strict' });
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({ message: 'Logout successful' });
        });

        test('should handle errors during logout', async () => {
            const logoutHandler = logout[1];

            mockRes.clearCookie.mockImplementation(() => {
                throw new Error('Cookie clearing error');
            });

            await logoutHandler(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.send).toHaveBeenCalledWith('Something went wrong!');
        });
    });
});