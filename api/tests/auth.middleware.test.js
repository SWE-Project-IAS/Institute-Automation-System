import mongoose, { Error } from 'mongoose';
import jwt from 'jsonwebtoken';
import { findUserByEmail, verifyRefreshTokenInDB, validateAccessToken, validateRefreshToken } from '../middleware/auth.middleware';
import { User } from '../models/user.model';

jest.mock('../models/user.model');


describe('Authentication Middleware', () => {
  // Common setup before each test
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

    // Reset mocks and environment
    jest.clearAllMocks();
    process.env.ACCESS_TOKEN_SECRET = 'test_access_secret';
    process.env.REFRESH_TOKEN_SECRET = 'test_refresh_secret';
  });

  describe('validateRefreshToken', () => {
    test('should reject request without refresh token', () => {
      // Simulate no refresh token in cookies
      mockReq.cookies = {};

      validateRefreshToken(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Refresh token not provided"
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should reject invalid refresh token', () => {
      // Simulate refresh token in cookies
      mockReq.cookies['refreshToken'] = 'invalid_refresh_token';

      // Mock jwt.verify to throw an error
      jest.spyOn(jwt, 'verify').mockImplementation((token, secret, callback) => {
        callback(new SyntaxError);
      });

      validateRefreshToken(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "invalid token,login again"
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should reject expired refresh token', () => {
      // Simulate refresh token in cookies
      mockReq.cookies['refreshToken'] = 'expired_refresh_token';

      // Mock jwt.verify to throw an expiration error
      jest.spyOn(jwt, 'verify').mockImplementation((token, secret, callback) => {
        callback(new jwt.TokenExpiredError('Token expired', new Date()), null);
      });

      validateRefreshToken(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "expired refresh token,please login again"
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should successfully validate and pass valid refresh token', () => {
      // Prepare a mock valid token
      const mockDecodedUser = {
        user: {
          email: 'test@example.com',
          role: 'student'
        }
      };

      // Simulate refresh token in cookies
      mockReq.cookies['refreshToken'] = 'valid_refresh_token';

      // Mock jwt.verify to succeed
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
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findUserByEmail', () => {
    // Mock Express request, response, and next function
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
      // Create a mock user
      const mockUser = {
        email: 'test@example.com',
        _id: new mongoose.Types.ObjectId(),
      };

      // Mock User.findOne to return the mock user
      User.findOne.mockResolvedValue(mockUser);

      // Call the middleware
      await findUserByEmail(mockReq, mockRes, mockNext);

      // Assertions
      expect(User.findOne).toHaveBeenCalledWith({
        email: 'test@example.com'
      });
      expect(mockReq.foundUser).toEqual(mockUser);
      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should return 404 when user is not found', async () => {
      // Mock User.findOne to return null
      User.findOne.mockResolvedValue(null);

      // Call the middleware
      await findUserByEmail(mockReq, mockRes, mockNext);

      // Assertions
      expect(User.findOne).toHaveBeenCalledWith({
        email: 'test@example.com'
      });
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "User not found"
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle errors and return 500 status', async () => {
      // Mock User.findOne to throw an error
      const mockError = new Error('Database connection failed');
      User.findOne.mockRejectedValue(mockError);

      // Spy on console.error
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      // Call the middleware
      await findUserByEmail(mockReq, mockRes, mockNext);

      // Assertions
      expect(User.findOne).toHaveBeenCalledWith({
        email: 'test@example.com'
      });
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error finding user:",
        mockError
      );
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.send).toHaveBeenCalledWith(
        "Internal server error"
      );
      expect(mockNext).not.toHaveBeenCalled();

      // Restore console.error
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

      // Call the middleware
      verifyRefreshTokenInDB(mockReq, mockRes, mockNext);

      // Assertions
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

      // Call the middleware
      verifyRefreshTokenInDB(mockReq, mockRes, mockNext);

      // Assertions
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Invalid refresh token"
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});