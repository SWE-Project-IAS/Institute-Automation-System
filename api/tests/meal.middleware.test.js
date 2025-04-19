import { validateMealAccess, isStudent, isMealAdmin } from "../middleware/meal.middleware.js";
import { User } from "../models/user.model.js";
import { Student } from "../models/student.model.js";

jest.mock("../models/user.model.js");
jest.mock("../models/student.model.js");

describe("Meal Middleware", () => {
    let mockReq, mockRes, mockNext;

    beforeEach(() => {
        mockReq = {
            cookies: {},
        };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        mockNext = jest.fn();
        jest.clearAllMocks();
    });

    describe("validateMealAccess", () => {
        test("should return 401 if no cookies", async () => {
            await validateMealAccess(mockReq, mockRes, mockNext);
            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith({ message: "Authentication required" });
        });

        test("should return 401 if cookie is invalid JSON", async () => {
            mockReq.cookies.user = "{invalid_json";
            await validateMealAccess(mockReq, mockRes, mockNext);
            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith({ message: "Invalid authentication data" });
        });

        test("should return 401 if required fields are missing", async () => {
            mockReq.cookies.user = JSON.stringify({ email: "test@example.com" }); // Missing userId
            await validateMealAccess(mockReq, mockRes, mockNext);
            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith({ message: "Invalid authentication data" });
        });

    });

    describe("isStudent", () => {
        test("should return 401 if user is missing", async () => {
            mockReq.user = null;
            await isStudent(mockReq, mockRes, mockNext);
            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith({ message: "Authentication required" });
        });

        test("should return 403 if role is not student", async () => {
            mockReq.user = { _id: "123", role: "nonAcadAdmin" };
            await isStudent(mockReq, mockRes, mockNext);
            expect(mockRes.status).toHaveBeenCalledWith(403);
            expect(mockRes.json).toHaveBeenCalledWith({ message: "Access denied. Student role required." });
        });

        test("should return 403 if student record not found", async () => {
            mockReq.user = { _id: "123", role: "student" };
            Student.findOne.mockResolvedValue(null);
            await isStudent(mockReq, mockRes, mockNext);
            expect(mockRes.status).toHaveBeenCalledWith(403);
            expect(mockRes.json).toHaveBeenCalledWith({ message: "Student record not found." });
        });

        test("should attach student and call next if valid", async () => {
            mockReq.user = { _id: "123", role: "student" };
            const mockStudent = { name: "Test Student", userId: "123" };
            Student.findOne.mockResolvedValue(mockStudent);

            await isStudent(mockReq, mockRes, mockNext);
            expect(mockReq.student).toEqual(mockStudent);
            expect(mockNext).toHaveBeenCalled();
        });
    });

    describe("isMealAdmin", () => {
        test("should return 401 if user is missing", async () => {
            mockReq.user = null;
            await isMealAdmin(mockReq, mockRes, mockNext);
            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith({ message: "Authentication required" });
        });

        test("should return 403 if role is not nonAcadAdmin", async () => {
            mockReq.user = { role: "student" };
            await isMealAdmin(mockReq, mockRes, mockNext);
            expect(mockRes.status).toHaveBeenCalledWith(403);
            expect(mockRes.json).toHaveBeenCalledWith({ message: "Access denied. Admin role required." });
        });

        test("should call next if user is nonAcadAdmin", async () => {
            mockReq.user = { role: "nonAcadAdmin" };
            await isMealAdmin(mockReq, mockRes, mockNext);
            expect(mockNext).toHaveBeenCalled();
        });
    });
});