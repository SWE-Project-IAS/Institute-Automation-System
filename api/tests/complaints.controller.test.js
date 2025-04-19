import mongoose, { Error } from 'mongoose';
import jwt from 'jsonwebtoken';
import { findUserByEmail, verifyRefreshTokenInDB, validateAccessToken, validateRefreshToken } from '../middleware/auth.middleware';
import { User } from '../models/user.model';

jest.mock('../models/user.model');

describe('Authentication Middleware', () => {
    let mockReq, mockRes, mockNext;

    beforeEach(() => {
        mockReq = {
            header: jest.fn(),
            cookies: {}
        };

        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        mockNext = jest.fn();

        jest.clearAllMocks();
        process.env.ACCESS_TOKEN_SECRET = 'test_access_secret';
        process.env.REFRESH_TOKEN_SECRET = 'test_refresh_secret';
    });

    describe('validateRefreshToken', () => {
        test('should reject request without refresh token', () => {
            mockReq.cookies = {};
            validateRefreshToken(mockReq, mockRes, mockNext);
            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith({ message: "Refresh token not provided" });
            expect(mockNext).not.toHaveBeenCalled();
        });

        test('should reject invalid refresh token', () => {
            mockReq.cookies['refreshToken'] = 'invalid_refresh_token';
            jest.spyOn(jwt, 'verify').mockImplementation((token, secret, callback) => {
                callback(new SyntaxError);
            });
            validateRefreshToken(mockReq, mockRes, mockNext);
            expect(mockRes.status).toHaveBeenCalledWith(403);
            expect(mockRes.json).toHaveBeenCalledWith({ message: "invalid token,login again" });
            expect(mockNext).not.toHaveBeenCalled();
        });

        test('should reject expired refresh token', () => {
            mockReq.cookies['refreshToken'] = 'expired_refresh_token';
            jest.spyOn(jwt, 'verify').mockImplementation((token, secret, callback) => {
                callback(new jwt.TokenExpiredError('Token expired', new Date()), null);
            });
            validateRefreshToken(mockReq, mockRes, mockNext);
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({ message: "expired refresh token,please login again" });
            expect(mockNext).not.toHaveBeenCalled();
        });

        test('should successfully validate and pass valid refresh token', () => {
            const mockDecodedUser = { user: { email: 'test@example.com', role: 'student' } };
            mockReq.cookies['refreshToken'] = 'valid_refresh_token';
            jest.spyOn(jwt, 'verify').mockImplementation((token, secret, callback) => {
                callback(null, mockDecodedUser);
            });
            validateRefreshToken(mockReq, mockRes, mockNext);
            expect(mockReq.user).toEqual(mockDecodedUser.user);
            expect(mockReq.refreshToken).toBe('valid_refresh_token');
            expect(mockNext).toHaveBeenCalled();
            expect(mockRes.status).not.toHaveBeenCalled();
        });
    });
});

describe('User Middleware', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('findUserByEmail', () => {
        const mockReq = {
            user: { email: 'test@example.com' },
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn(),
        };
        const mockNext = jest.fn();

        it('should find user and call next when user exists', async () => {
            const mockUser = {
                email: 'test@example.com',
                _id: new mongoose.Types.ObjectId(),
            };
            User.findOne.mockResolvedValue(mockUser);
            await findUserByEmail(mockReq, mockRes, mockNext);
            expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
            expect(mockReq.foundUser).toEqual(mockUser);
            expect(mockNext).toHaveBeenCalled();
            expect(mockRes.status).not.toHaveBeenCalled();
        });

        it('should return 404 when user is not found', async () => {
            User.findOne.mockResolvedValue(null);
            await findUserByEmail(mockReq, mockRes, mockNext);
            expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({ message: "User not found" });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should handle errors and return 500 status', async () => {
            const mockError = new Error('Database connection failed');
            User.findOne.mockRejectedValue(mockError);
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
            await findUserByEmail(mockReq, mockRes, mockNext);
            expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
            expect(consoleErrorSpy).toHaveBeenCalledWith("Error finding user:", mockError);
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.send).toHaveBeenCalledWith("Internal server error");
            expect(mockNext).not.toHaveBeenCalled();
            consoleErrorSpy.mockRestore();
        });
    });

    describe('verifyRefreshTokenInDB', () => {
        const mockNext = jest.fn();

        it('should call next when refresh tokens match', () => {
            const mockReq = {
                foundUser: { refreshToken: 'validToken123' },
                refreshToken: 'validToken123'
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            verifyRefreshTokenInDB(mockReq, mockRes, mockNext);
            expect(mockNext).toHaveBeenCalled();
            expect(mockRes.status).not.toHaveBeenCalled();
        });

        it('should return 401 when refresh tokens do not match', () => {
            const mockReq = {
                foundUser: { refreshToken: 'validToken123' },
                refreshToken: 'invalidToken456'
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            verifyRefreshTokenInDB(mockReq, mockRes, mockNext);
            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith({ message: "Invalid refresh token" });
            expect(mockNext).not.toHaveBeenCalled();
        });
    });
});
