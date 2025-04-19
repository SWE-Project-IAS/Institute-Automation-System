import { Student } from '../models/student.model';
import { HostelLeave } from '../models/hostel.model';
import { studentLeave, getStudentLeave, getAllLeaves, updateAnyLeave } from '../controllers/hostel.controller';

// Mock the models
jest.mock('../models/student.model');
jest.mock('../models/hostel.model');

describe('studentLeave Function', () => {
    // Setup request and response objects
    let req;
    let res;

    beforeEach(() => {
        // Reset mocks
        jest.clearAllMocks();

        // Mock response object with status and json functions
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        // Mock request object with default valid data
        req = {
            body: {
                studentId: 'S12345',
                email: 'student@example.com',
                startDate: new Date(Date.now() + 86400000), // Tomorrow
                endDate: new Date(Date.now() + 172800000), // Day after tomorrow
                reason: 'Family function'
            }
        };

        // Mock the current date for consistent testing
        jest.spyOn(global, 'Date').mockImplementation(() => ({
            getTime: () => 1649851200000, // Fixed timestamp
            valueOf: () => 1649851200000
        }));

        // Default successful student lookup mock
        Student.findOne.mockResolvedValue({
            rollNo: 'S12345',
            email: 'student@example.com',
            name: 'Test Student'
        });

        // Default successful HostelLeave creation mock
        HostelLeave.create.mockResolvedValue({
            rollNo: 'S12345',
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            reason: req.body.reason,
            status: 'Pending'
        });
    });

    afterEach(() => {
        // Restore Date mock
        jest.restoreAllMocks();
    });

    test('should successfully create a leave request with valid data', async () => {
        await studentLeave(req, res);

        expect(Student.findOne).toHaveBeenCalledWith({ email: 'student@example.com' });
        expect(HostelLeave.create).toHaveBeenCalledWith({
            rollNo: 'S12345',
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            reason: 'Family function',
            status: 'Pending'
        });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Leave request submitted successfully' });
    });

    test('should return 400 if required fields are missing', async () => {
        // Test with missing studentId
        req.body.studentId = null;
        await studentLeave(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'All fields are required' });

        // Reset and test with missing startDate
        req.body.studentId = 'S12345';
        req.body.startDate = null;
        await studentLeave(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'All fields are required' });

        // Reset and test with missing endDate
        req.body.endDate = null;
        await studentLeave(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'All fields are required' });
    });

    test('should return 400 if end date is not after start date', async () => {
        // Set end date same as start date
        req.body.endDate = req.body.startDate;
        await studentLeave(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'End date must be after start date' });

        // Set end date before start date
        req.body.endDate = new Date(req.body.startDate.getTime() - 86400000);
        await studentLeave(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'End date must be after start date' });
    });

    test('should return 404 if student is not found', async () => {
        // Mock student not found
        Student.findOne.mockResolvedValue(null);
        await studentLeave(req, res);

        expect(Student.findOne).toHaveBeenCalledWith({ email: 'student@example.com' });
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Student not found' });
    });

    test('should return 400 if student ID does not match email', async () => {
        // Mock student with different rollNo than provided in request
        Student.findOne.mockResolvedValue({
            rollNo: 'S67890', // Different from the requested studentId
            email: 'student@example.com',
            name: 'Test Student'
        });

        await studentLeave(req, res);

        expect(Student.findOne).toHaveBeenCalledWith({ email: 'student@example.com' });
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Student ID does not match email' });
    });

    test('should return 500 if database operation fails', async () => {
        // Mock database error
        Student.findOne.mockImplementation(() => {
            throw new Error('Database error');
        });

        await studentLeave(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });

    test('should handle database error during leave creation', async () => {
        // Mock successful student lookup but failed leave creation
        HostelLeave.create.mockImplementation(() => {
            throw new Error('Database error');
        });

        await studentLeave(req, res);

        expect(Student.findOne).toHaveBeenCalledWith({ email: 'student@example.com' });
        expect(HostelLeave.create).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
});

describe('getStudentLeave Function', () => {
    // Setup request and response objects
    let req;
    let res;

    beforeEach(() => {
        // Reset mocks
        jest.clearAllMocks();

        // Mock response object with status and json functions
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        // Mock request object with default valid data
        req = {
            params: {
                id: 'user123'
            }
        };

        // Default successful student lookup mock
        Student.findOne.mockResolvedValue({
            _id: 'student123',
            userId: 'user123',
            rollNo: 'S12345',
            name: 'Test Student',
            email: 'student@example.com'
        });

        // Default successful leaves lookup mock
        HostelLeave.find.mockResolvedValue([
            {
                _id: 'leave1',
                rollNo: 'S12345',
                startDate: new Date('2023-05-01'),
                endDate: new Date('2023-05-05'),
                reason: 'Family function',
                status: 'Approved'
            },
            {
                _id: 'leave2',
                rollNo: 'S12345',
                startDate: new Date('2023-06-10'),
                endDate: new Date('2023-06-15'),
                reason: 'Medical emergency',
                status: 'Pending'
            }
        ]);
    });

    afterEach(() => {
        // Restore Date mock
        jest.restoreAllMocks();
    });

    test('should successfully return leaves for a valid student', async () => {
        await getStudentLeave(req, res);

        expect(Student.findOne).toHaveBeenCalledWith({ userId: 'user123' });
        expect(HostelLeave.find).toHaveBeenCalledWith({ rollNo: 'S12345' });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([
            expect.objectContaining({
                _id: 'leave1',
                rollNo: 'S12345',
                status: 'Approved'
            }),
            expect.objectContaining({
                _id: 'leave2',
                rollNo: 'S12345',
                status: 'Pending'
            })
        ]));
    });

    test('should return 404 if student is not found', async () => {
        // Mock student not found
        Student.findOne.mockResolvedValue(null);

        await getStudentLeave(req, res);

        expect(Student.findOne).toHaveBeenCalledWith({ userId: 'user123' });
        expect(HostelLeave.find).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Student not found' });
    });

    test('should return 404 if no leaves are found for the student', async () => {
        // Mock no leaves found
        HostelLeave.find.mockResolvedValue([]);

        await getStudentLeave(req, res);

        expect(Student.findOne).toHaveBeenCalledWith({ userId: 'user123' });
        expect(HostelLeave.find).toHaveBeenCalledWith({ rollNo: 'S12345' });
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'No leaves found for this student' });
    });

    test('should return 404 if leaves is null', async () => {
        // Mock leaves as null
        HostelLeave.find.mockResolvedValue(null);

        await getStudentLeave(req, res);

        expect(Student.findOne).toHaveBeenCalledWith({ userId: 'user123' });
        expect(HostelLeave.find).toHaveBeenCalledWith({ rollNo: 'S12345' });
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'No leaves found for this student' });
    });

    test('should return 500 if Student.findOne throws an error', async () => {
        // Mock database error in Student.findOne
        Student.findOne.mockImplementation(() => {
            throw new Error('Database error');
        });

        await getStudentLeave(req, res);

        expect(Student.findOne).toHaveBeenCalledWith({ userId: 'user123' });
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });

    test('should return 500 if HostelLeave.find throws an error', async () => {
        // Mock database error in HostelLeave.find
        HostelLeave.find.mockImplementation(() => {
            throw new Error('Database error');
        });

        await getStudentLeave(req, res);

        expect(Student.findOne).toHaveBeenCalledWith({ userId: 'user123' });
        expect(HostelLeave.find).toHaveBeenCalledWith({ rollNo: 'S12345' });
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });

    test('should handle undefined id in req.params', async () => {
        // Set id to undefined
        req.params.id = null;

        // This should trigger a database error or student not found
        await getStudentLeave(req, res);

        expect(Student.findOne).toHaveBeenCalledWith({ userId: null });
        // Assuming the controller handles this as an error
        expect(res.status).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalled();
    });
});

describe('getAllLeaves Function', () => {
    // Setup request object
    let req;
    let res;

    beforeEach(() => {
        // Reset mocks
        jest.clearAllMocks();

        // Mock response object with status and json functions
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        req = {}; // Empty request object as getAllLeaves doesn't use request parameters

        // Default mock for HostelLeave.find
        HostelLeave.find.mockResolvedValue([
            {
                _id: 'leave1',
                rollNo: 'S12345',
                startDate: new Date('2023-05-01'),
                endDate: new Date('2023-05-05'),
                reason: 'Family function',
                status: 'Approved'
            },
            {
                _id: 'leave2',
                rollNo: 'S67890',
                startDate: new Date('2023-06-10'),
                endDate: new Date('2023-06-15'),
                reason: 'Medical emergency',
                status: 'Pending'
            }
        ]);
    });

    test('should successfully return all leaves', async () => {
        await getAllLeaves(req, res);

        expect(HostelLeave.find).toHaveBeenCalledWith({});
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([
            expect.objectContaining({
                _id: 'leave1',
                rollNo: 'S12345',
                status: 'Approved'
            }),
            expect.objectContaining({
                _id: 'leave2',
                rollNo: 'S67890',
                status: 'Pending'
            })
        ]));
    });

    test('should return 404 if no leaves are found', async () => {
        // Mock empty leaves array
        HostelLeave.find.mockResolvedValue([]);

        await getAllLeaves(req, res);

        expect(HostelLeave.find).toHaveBeenCalledWith({});
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'No leaves found' });
    });

    test('should return 404 if leaves is null', async () => {
        // Mock null leaves response
        HostelLeave.find.mockResolvedValue(null);

        await getAllLeaves(req, res);

        expect(HostelLeave.find).toHaveBeenCalledWith({});
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'No leaves found' });
    });

    test('should return 500 if database operation fails', async () => {
        // Mock database error
        HostelLeave.find.mockImplementation(() => {
            throw new Error('Database error');
        });

        await getAllLeaves(req, res);

        expect(HostelLeave.find).toHaveBeenCalledWith({});
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
});

describe('updateAnyLeave Function', () => {
    // Setup request object
    let req;
    let res;
    beforeEach(() => {

        jest.clearAllMocks();

        // Mock response object with status and json functions
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        req = {
            params: {
                id: 'leave123'
            },
            body: {
                status: 'Approved'
            }
        };

        // Default mock for HostelLeave.findByIdAndUpdate
        HostelLeave.findByIdAndUpdate.mockResolvedValue({
            _id: 'leave123',
            rollNo: 'S12345',
            startDate: new Date('2023-05-01'),
            endDate: new Date('2023-05-05'),
            reason: 'Family function',
            status: 'Approved' // Updated status
        });
    });

    test('should successfully update leave status', async () => {
        await updateAnyLeave(req, res);

        expect(HostelLeave.findByIdAndUpdate).toHaveBeenCalledWith(
            'leave123',
            { status: 'Approved' },
            { new: true }
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Leave request updated successfully',
            leave: expect.objectContaining({
                _id: 'leave123',
                status: 'Approved'
            })
        });
    });

    test('should return 404 if leave is not found', async () => {
        // Mock leave not found
        HostelLeave.findByIdAndUpdate.mockResolvedValue(null);

        await updateAnyLeave(req, res);

        expect(HostelLeave.findByIdAndUpdate).toHaveBeenCalledWith(
            'leave123',
            { status: 'Approved' },
            { new: true }
        );
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Leave request not found' });
    });

    test('should return 500 if database operation fails', async () => {
        // Mock database error
        HostelLeave.findByIdAndUpdate.mockImplementation(() => {
            throw new Error('Database error');
        });

        await updateAnyLeave(req, res);

        expect(HostelLeave.findByIdAndUpdate).toHaveBeenCalledWith(
            'leave123',
            { status: 'Approved' },
            { new: true }
        );
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });

    test('should handle missing status in request body', async () => {
        // Remove status from request body
        req.body = {};

        await updateAnyLeave(req, res);

        expect(HostelLeave.findByIdAndUpdate).toHaveBeenCalledWith(
            'leave123',
            { status: undefined },
            { new: true }
        );
        // The controller doesn't specifically validate the status field,
        // so we just verify it attempts the update operation
        expect(res.status).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalled();
    });

    test('should handle missing or invalid leave ID', async () => {
        // Remove ID from request params
        req.params = {};

        await updateAnyLeave(req, res);

        expect(HostelLeave.findByIdAndUpdate).toHaveBeenCalledWith(
            undefined,
            { status: 'Approved' },
            { new: true }
        );
        // This would likely result in a database error
        expect(res.status).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalled();
    });
});