import { Student } from '../models/student.model';
import { Bonafide,ApplicationDocument, } from '../models/documents.models';
import { getStudent, getBonafideApplications, getStudentBonafideDetails,createBonafideApplication } from "../controllers/student.controller";

jest.mock('../models/student.model');
jest.mock('../models/documents.models');

// Mock console methods to prevent test output clutter
console.log = jest.fn();
console.error = jest.fn();

describe('getStudent Function', () => {
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

    Student.findOne = jest.fn().mockReturnThis();
    Student.populate = jest.fn();

    // Default successful student lookup mock
    Student.findOne.mockImplementation(() => ({
      populate: jest.fn().mockResolvedValue({
        _id: 'student123',
        userId: {
          _id: 'user123',
          name: 'John Doe',
          email: 'john@example.com'
        },
        rollNo: 'S12345',
        name: 'John Doe',
        email: 'john@example.com',
        department: 'Computer Science'
      })
    }));
  });

  test('should successfully return student info for a valid ID', async () => {
    await getStudent(req, res);

    expect(Student.findOne).toHaveBeenCalledWith({ userId: 'user123' });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      _id: 'student123',
      rollNo: 'S12345',
      userId: expect.objectContaining({
        _id: 'user123',
        name: 'John Doe'
      })
    }));
    expect(console.log).toHaveBeenCalledWith(
      "Student details fetched successfully",
      expect.any(Object)
    );
  });

  test('should return 404 if student is not found', async () => {
    // Mock student not found
    Student.findOne.mockImplementation(() => ({
      populate: jest.fn().mockResolvedValue(null)
    }));

    await getStudent(req, res);

    expect(Student.findOne).toHaveBeenCalledWith({ userId: 'user123' });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Student not found' });
    // Success log should not be called
    expect(console.log).not.toHaveBeenCalledWith(
      "Student details fetched successfully",
      expect.any(Object)
    );
  });

  test('should handle database error properly with 500 response', async () => {
    // Mock database error
    Student.findOne.mockImplementation(() => {
      throw new Error('Database error');
    });

    await getStudent(req, res);

    expect(Student.findOne).toHaveBeenCalledWith({ userId: 'user123' });
    expect(console.error).toHaveBeenCalledWith("Error in getStudent:", expect.any(Error));
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
  });

  test('should handle missing ID parameter', async () => {
    // Remove ID from request params
    req.params = {};

    await getStudent(req, res);

    expect(Student.findOne).toHaveBeenCalledWith({ userId: undefined });
    // This will likely return null since the ID is undefined
    expect(res.status).toHaveBeenCalled();
  });

  test('should verify that populate is called with correct parameter', async () => {
    const populateMock = jest.fn().mockResolvedValue({
      _id: 'student123',
      userId: {
        _id: 'user123',
        name: 'John Doe'
      },
      rollNo: 'S12345'
    });

    Student.findOne.mockImplementation(() => ({
      populate: populateMock
    }));

    await getStudent(req, res);

    expect(Student.findOne).toHaveBeenCalledWith({ userId: 'user123' });
    expect(populateMock).toHaveBeenCalledWith('userId');
    expect(res.status).toHaveBeenCalledWith(200);
  });
});

describe('getStudentBonafideDetails Function', () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Mock Express response object
    mockRes = {
      status: jest.fn().mockReturnThis(), // Enable chaining .status().json()
      json: jest.fn(),
    };

    // Mock Express request object with default params
    mockReq = {
      params: { id: 'validStudentUserId' },
    };


  });

  test('should return 200 and student details when a valid student ID is provided', async () => {
    const mockStudentData = {
      userId: { // Populated user data
        _id: 'validStudentUserId',
        name: 'Alice Wonderland',
        dateOfBirth: new Date('2001-05-15T00:00:00.000Z'),
      },
      rollNo: 'CS2021005',
      fatherName: 'Charles Wonderland',
      program: 'M.Sc',
      department: 'Physics',
      hostel: 'B Block',
      roomNo: '202',
      semester: 4,
      batch: 2021,
    };

    // Configure Student.findOne to return an object with a populate method that resolves
    Student.findOne.mockImplementation(() => ({
      // This mock function simulates the populate call
      populate: jest.fn().mockResolvedValue(mockStudentData)
    }));

    const expectedJsonOutput = {
      name: 'Alice Wonderland',
      rollNo: 'CS2021005',
      fatherName: 'Charles Wonderland',
      dateOfBirth: mockStudentData.userId.dateOfBirth,
      program: 'M.Sc',
      department: 'Physics',
      hostel: 'B Block',
      roomNo: '202',
      semester: 4,
      batch: 2021,
      enrolledYear: 2021, // Assuming enrolledYear is same as batch
    };

    await getStudentBonafideDetails(mockReq, mockRes);

    expect(Student.findOne).toHaveBeenCalledTimes(1);
    expect(Student.findOne).toHaveBeenCalledWith({ userId: 'validStudentUserId' });
    // Note: We implicitly test populate by checking the final result
    expect(mockRes.status).toHaveBeenCalledTimes(1);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledTimes(1);
    expect(mockRes.json).toHaveBeenCalledWith(expectedJsonOutput);
  });

  test('should return 404 when student is not found', async () => {
    // Configure Student.findOne -> populate to resolve with null
    Student.findOne.mockImplementation(() => ({
      populate: jest.fn().mockResolvedValue(null) // Simulate student not found after populate
    }));

    await getStudentBonafideDetails(mockReq, mockRes);

    expect(Student.findOne).toHaveBeenCalledTimes(1);
    expect(Student.findOne).toHaveBeenCalledWith({ userId: 'validStudentUserId' });
    expect(mockRes.status).toHaveBeenCalledTimes(1);
    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledTimes(1);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Student not found' });
  });

  test('should return 500 when a database error occurs', async () => {
    const dbError = new Error('Database connection failed');
    // Configure Student.findOne -> populate to reject with an error
    Student.findOne.mockImplementation(() => ({
      populate: jest.fn().mockRejectedValue(dbError) // Simulate error during the async populate step
    }));

    await getStudentBonafideDetails(mockReq, mockRes);

    expect(Student.findOne).toHaveBeenCalledTimes(1);
    expect(Student.findOne).toHaveBeenCalledWith({ userId: 'validStudentUserId' });
    expect(console.error).toHaveBeenCalledTimes(1)
    expect(mockRes.status).toHaveBeenCalledTimes(1);
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledTimes(1);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Error fetching student details' });
  });

  test('should return 200 and handle missing fields gracefully', async () => {
    const mockIncompleteStudentData = {
      userId: {
        _id: 'validStudentUserId',
        name: 'Bob The Builder',
        // dateOfBirth missing
      },
      rollNo: 'ME2022010',
      // fatherName missing
      program: 'B.Eng',
      department: 'Mechanical',
      batch: 2022,
      // other fields missing
    };

    // Configure Student.findOne -> populate to resolve with incomplete data
    Student.findOne.mockImplementation(() => ({
      populate: jest.fn().mockResolvedValue(mockIncompleteStudentData)
    }));

    const expectedJsonOutput = {
      name: 'Bob The Builder',
      rollNo: 'ME2022010',
      fatherName: undefined,
      dateOfBirth: undefined,
      program: 'B.Eng',
      department: 'Mechanical',
      hostel: undefined,
      roomNo: undefined,
      semester: undefined,
      batch: 2022,
      enrolledYear: 2022,
    };

    await getStudentBonafideDetails(mockReq, mockRes);

    expect(Student.findOne).toHaveBeenCalledTimes(1);
    expect(mockRes.status).toHaveBeenCalledTimes(1);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledTimes(1);
    expect(mockRes.json).toHaveBeenCalledWith(expectedJsonOutput);
  });

  test('should return 200 and handle unexpected data structure from populate', async () => {
    const mockWeirdStudentData = {
      userId: 'just-an-id-string', // Not an object as controller expects for name/dob
      rollNo: 'EE2023099',
      fatherName: 'Mr. Strange',
      program: 'Ph.D',
      department: 'Electrical',
      batch: 2023,
      hostel: 'C Block',
      roomNo: '303',
      semester: 2,
    };

    Student.findOne.mockImplementation(() => ({
      populate: jest.fn().mockResolvedValue(mockWeirdStudentData)
    }));

    const expectedJsonOutput = {
      name: undefined, // Controller expects student.userId.name
      rollNo: 'EE2023099',
      fatherName: 'Mr. Strange',
      dateOfBirth: undefined, // Controller expects student.userId.dateOfBirth
      program: 'Ph.D',
      department: 'Electrical',
      hostel: 'C Block',
      roomNo: '303',
      semester: 2,
      batch: 2023,
      enrolledYear: 2023,
    };

    await getStudentBonafideDetails(mockReq, mockRes);

    expect(Student.findOne).toHaveBeenCalledTimes(1);
    expect(mockRes.status).toHaveBeenCalledTimes(1);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledTimes(1);
    expect(mockRes.json).toHaveBeenCalledWith(expectedJsonOutput);
  });

});

describe('createBonafideApplication Controller', () => {
    let mockReq;
    let mockRes;

    // Define reusable mock IDs
    const mockStudentId = "1231fjdnid7sf";
    const mockUserId = 'user-' + mockStudentId.toString();
    const mockAppDocId = "csDCADsSA1231fjdnid7sf";

    beforeEach(() => {
        jest.clearAllMocks(); // Clear all mocks before each test

        // Basic mock response object
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        // Basic mock request object (customize body in tests)
        mockReq = {
            params: { id: mockUserId },
            body: {
                currentSemester: 5,
                certificateFor: 'Bank Loan',
                otherReason: '',
            },
        };

    });

    // --- Test Case 1: Success - Standard Purpose ---
    test('should create application and bonafide docs and return 201 for standard purpose', async () => {
        mockReq.body.certificateFor = 'Passport Application';
        const mockStudent = { _id: mockStudentId, userId: mockUserId, name: 'Test Student' };

        Student.findOne.mockResolvedValue(mockStudent); // Student found

        const mockAppDocSave = jest.fn().mockResolvedValue(null); // Mock successful save
        ApplicationDocument.mockImplementation(() => ({
            _id: mockAppDocId, // Provide the mock ID
            save: mockAppDocSave, // Attach the mock save method
        }));

        // Mock Bonafide constructor and its save method for success
        const mockBonafideSave = jest.fn().mockResolvedValue(null); // Mock successful save
        Bonafide.mockImplementation(() => ({
            save: mockBonafideSave, // Attach the mock save method
        }));

        await createBonafideApplication(mockReq, mockRes);

        expect(Student.findOne).toHaveBeenCalledWith({ userId: mockUserId });
        expect(ApplicationDocument).toHaveBeenCalledWith({ studentId: mockStudentId, documentType: 'Bonafide', status: 'Pending' });
        expect(mockAppDocSave).toHaveBeenCalledTimes(1); // Check the instance's save was called
        expect(Bonafide).toHaveBeenCalledWith({ applicationId: mockAppDocId, currentSemester: 5, purpose: 'Passport Application', otherReason: undefined });
        expect(mockBonafideSave).toHaveBeenCalledTimes(1); // Check the instance's save was called
        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.json).toHaveBeenCalledWith({ message: 'Bonafide application submitted successfully', applicationId: mockAppDocId });
    });

    test('should create docs with otherReason and return 201 for "Other" purpose', async () => {

        mockReq.body.certificateFor = 'Other';
        mockReq.body.otherReason = 'Scholarship Application XYZ';
        const mockStudent = { _id: mockStudentId, userId: mockUserId, name: 'Test Student' };

        Student.findOne.mockResolvedValue(mockStudent);

        const mockAppDocSave = jest.fn().mockResolvedValue(null);
        ApplicationDocument.mockImplementation(() => ({ _id: mockAppDocId, save: mockAppDocSave }));

        const mockBonafideSave = jest.fn().mockResolvedValue(null);
        Bonafide.mockImplementation(() => ({ save: mockBonafideSave }));

        await createBonafideApplication(mockReq, mockRes);

        expect(Student.findOne).toHaveBeenCalledTimes(1);
        expect(mockAppDocSave).toHaveBeenCalledTimes(1);
        // Focus check on Bonafide constructor arguments for 'Other' case
        expect(Bonafide).toHaveBeenCalledWith({ applicationId: mockAppDocId, currentSemester: 5, purpose: 'Other', otherReason: 'Scholarship Application XYZ' });
        expect(mockBonafideSave).toHaveBeenCalledTimes(1);
        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.json).toHaveBeenCalledWith({ message: 'Bonafide application submitted successfully', applicationId: mockAppDocId });
    });

    test('should return 404 if student is not found', async () => {
        Student.findOne.mockResolvedValue(null); // Simulate student not found

        // Mocks for constructors/save are not strictly needed here as they shouldn't be called,
        // but defining empty mocks prevents potential 'not a function' errors if code paths change.
        ApplicationDocument.mockImplementation(() => ({ save: jest.fn() }));
        Bonafide.mockImplementation(() => ({ save: jest.fn() }));

        await createBonafideApplication(mockReq, mockRes);

        expect(Student.findOne).toHaveBeenCalledWith({ userId: mockUserId });
        expect(ApplicationDocument).not.toHaveBeenCalled(); // Ensure constructor wasn't called
        expect(Bonafide).not.toHaveBeenCalled();          // Ensure constructor wasn't called
        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({ message: 'Student not found' });
        // Also implicitly checks that save methods weren't called
    });

    test('should return 500 if Student.findOne fails', async () => {
        const dbError = new Error('Failed to connect to student DB');
        Student.findOne.mockRejectedValue(dbError); // Simulate findOne error

        ApplicationDocument.mockImplementation(() => ({ save: jest.fn() }));
        Bonafide.mockImplementation(() => ({ save: jest.fn() }));

        await createBonafideApplication(mockReq, mockRes);

        expect(Student.findOne).toHaveBeenCalledTimes(1);
        expect(ApplicationDocument).not.toHaveBeenCalled();
        expect(Bonafide).not.toHaveBeenCalled();
        expect(console.error).toHaveBeenCalled()
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ message: dbError.message });
    });

    test('should return 500 if ApplicationDocument save fails', async () => {
        // 1. Arrange
        const dbError = new Error('Failed to save AppDoc');
        const mockStudent = { _id: mockStudentId, userId: mockUserId, name: 'Test Student' };

        Student.findOne.mockResolvedValue(mockStudent);

        // Mock AppDoc constructor with a save method that REJECTS
        const mockAppDocSave = jest.fn().mockRejectedValue(dbError);
        ApplicationDocument.mockImplementation(() => ({
            _id: mockAppDocId,
            save: mockAppDocSave, // Attach the failing save method
        }));

        // Mock Bonafide just in case (shouldn't be called)
        Bonafide.mockImplementation(() => ({ save: jest.fn() }));

        // 2. Act
        await createBonafideApplication(mockReq, mockRes);

        // 3. Assert
        expect(Student.findOne).toHaveBeenCalledTimes(1);
        expect(ApplicationDocument).toHaveBeenCalledTimes(1); // Constructor was called
        expect(mockAppDocSave).toHaveBeenCalledTimes(1);     // Save was attempted
        expect(Bonafide).not.toHaveBeenCalled();             // Bonafide constructor should not be called
        expect(console.error).toHaveBeenCalled()
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ message: dbError.message });
    });

    // --- Test Case 6: Database Error (During Bonafide Save) ---
    test('should return 500 if Bonafide save fails', async () => {
        // 1. Arrange
        const dbError = new Error('Failed to save Bonafide');
        const mockStudent = { _id: mockStudentId, userId: mockUserId, name: 'Test Student' };

        Student.findOne.mockResolvedValue(mockStudent);

        // Mock AppDoc to succeed
        const mockAppDocSave = jest.fn().mockResolvedValue(undefined);
        ApplicationDocument.mockImplementation(() => ({
            _id: mockAppDocId,
            save: mockAppDocSave,
        }));

        // Mock Bonafide constructor with a save method that REJECTS
        const mockBonafideSave = jest.fn().mockRejectedValue(dbError);
        Bonafide.mockImplementation(() => ({
            save: mockBonafideSave, // Attach the failing save method
        }));

        // 2. Act
        await createBonafideApplication(mockReq, mockRes);

        // 3. Assert
        expect(Student.findOne).toHaveBeenCalledTimes(1);
        expect(ApplicationDocument).toHaveBeenCalledTimes(1);
        expect(mockAppDocSave).toHaveBeenCalledTimes(1);     // AppDoc save succeeded
        expect(Bonafide).toHaveBeenCalledTimes(1);          // Bonafide constructor was called
        expect(mockBonafideSave).toHaveBeenCalledTimes(1);  // Bonafide save was attempted
        expect(console.error).toHaveBeenCalled()
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ message: dbError.message });
    });
});

describe('getBonafideApplications Controller', () => {
    let mockReq;
    let mockRes;

    // Define reusable mock IDs
    const mockStudentObjectId = "adnsi524nasid432ansi";
    const mockUserId = 'user-' + mockStudentObjectId.toString();
    const mockAppDocId1 = "783uycsdbsauy76t";
    const mockAppDocId2 = "cuzhns987767gcbuyx";

    beforeEach(() => {
        jest.clearAllMocks(); // Clear all mocks

        // Basic mock response object
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        // Basic mock request object
        mockReq = {
            params: { id: mockUserId },
        };

    });

  

    test('should return 200 and formatted applications when found', async () => {
        const mockStudent = { _id: mockStudentObjectId, userId: mockUserId, name: 'Test Student' };
        const mockAppDocs = [
            { _id: mockAppDocId1, studentId: mockStudentObjectId, documentType: 'Bonafide', createdAt: new Date('2025-04-10T10:00:00Z'), status: 'Approved', approvalDetails: { remarks: 'Approved remarks' } },
            { _id: mockAppDocId2, studentId: mockStudentObjectId, documentType: 'Bonafide', createdAt: new Date('2025-04-09T09:00:00Z'), status: 'Pending' /* no approvalDetails */ },
        ];
        const mockBonafideDocs = [
            { _id: "mockId776m", applicationId: mockAppDocId1, purpose: 'Bank Loan', currentSemester: 5 },
            { _id: "mockId776m879", applicationId: mockAppDocId2, purpose: 'Other', otherReason: 'Custom Reason XYZ', currentSemester: 5 },
        ];

        Student.findOne.mockResolvedValue(mockStudent);

        const mockSort = jest.fn().mockResolvedValue(mockAppDocs);
        ApplicationDocument.find.mockReturnValue({ sort: mockSort });

        Bonafide.findOne.mockImplementation(query => {
            const appIdString = query.applicationId.toString();
            if (appIdString === mockAppDocId1.toString()) return Promise.resolve(mockBonafideDocs[0]);
            if (appIdString === mockAppDocId2.toString()) return Promise.resolve(mockBonafideDocs[1]);
            return Promise.resolve(null);
        });

        const expectedJsonOutput = [
            { applicationDate: mockAppDocs[0].createdAt, certificateFor: 'Bank Loan', currentStatus: 'Approved', remarks: 'Approved remarks', otherDetails: undefined },
            { applicationDate: mockAppDocs[1].createdAt, certificateFor: 'Custom Reason XYZ', currentStatus: 'Pending', remarks: 'No remarks', otherDetails: undefined },
        ];

        await getBonafideApplications(mockReq, mockRes);

        expect(Student.findOne).toHaveBeenCalledWith({ userId: mockUserId });
        expect(ApplicationDocument.find).toHaveBeenCalledWith({ studentId: mockStudentObjectId, documentType: 'Bonafide' });
        expect(mockSort).toHaveBeenCalledWith({ createdAt: -1 });
        expect(Bonafide.findOne).toHaveBeenCalledTimes(mockAppDocs.length); // Called for each app doc
        expect(Bonafide.findOne).toHaveBeenCalledWith({ applicationId: mockAppDocId1 });
        expect(Bonafide.findOne).toHaveBeenCalledWith({ applicationId: mockAppDocId2 });
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(expectedJsonOutput);
        // Check console.log call inside controller
        expect(console.log).toHaveBeenCalled()
    });

    test('should return 200 and an empty array if no applications found', async () => {
        const mockStudent = { _id: mockStudentObjectId, userId: mockUserId, name: 'Test Student' };
        Student.findOne.mockResolvedValue(mockStudent);

        // Mock find().sort() to return empty array
        const mockSort = jest.fn().mockResolvedValue([]); // No applications found
        ApplicationDocument.find.mockReturnValue({ sort: mockSort });

        // Bonafide.findOne shouldn't be called, but mock it just in case
        Bonafide.findOne.mockResolvedValue(null);

        await getBonafideApplications(mockReq, mockRes);

        expect(Student.findOne).toHaveBeenCalledTimes(1);
        expect(ApplicationDocument.find).toHaveBeenCalledTimes(1);
        expect(mockSort).toHaveBeenCalledTimes(1);
        expect(Bonafide.findOne).not.toHaveBeenCalled(); // IMPORTANT check
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith([]); // Expect empty array
        expect(console.log).toHaveBeenCalled()
    });

    test('should return 404 if student is not found', async () => {
        Student.findOne.mockResolvedValue(null); // Simulate student not found

        const mockSort = jest.fn();
        ApplicationDocument.find.mockReturnValue({ sort: mockSort });
        Bonafide.findOne.mockResolvedValue(null);

        await getBonafideApplications(mockReq, mockRes);

        // 3. Assert
        expect(Student.findOne).toHaveBeenCalledWith({ userId: mockUserId });
        expect(ApplicationDocument.find).not.toHaveBeenCalled(); // Should not be called
        expect(mockSort).not.toHaveBeenCalled();                 // Should not be called
        expect(Bonafide.findOne).not.toHaveBeenCalled();        // Should not be called
        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({ message: 'Student not found' });
    });

    test('should return 200 and filter out applications where Bonafide doc is missing', async () => {
         const mockStudent = { _id: mockStudentObjectId, userId: mockUserId, name: 'Test Student' };
        const mockAppDocs = [
            { _id: mockAppDocId1, studentId: mockStudentObjectId, documentType: 'Bonafide', createdAt: new Date('2025-04-10T10:00:00Z'), status: 'Approved' },
            { _id: mockAppDocId2, studentId: mockStudentObjectId, documentType: 'Bonafide', createdAt: new Date('2025-04-09T09:00:00Z'), status: 'Pending' },
        ];
        const mockBonafideDoc1 = { _id:"mockId776m", applicationId: mockAppDocId1, purpose: 'Bank Loan', currentSemester: 5 };

        Student.findOne.mockResolvedValue(mockStudent);

        const mockSort = jest.fn().mockResolvedValue(mockAppDocs);
        ApplicationDocument.find.mockReturnValue({ sort: mockSort });

        Bonafide.findOne.mockImplementation(query => {
            const appIdString = query.applicationId.toString();
            if (appIdString === mockAppDocId1.toString()) return Promise.resolve(mockBonafideDoc1);
            if (appIdString === mockAppDocId2.toString()) return Promise.resolve(null); // Bonafide missing for app2
            return Promise.resolve(null);
        });

        const expectedJsonOutput = [
            { applicationDate: mockAppDocs[0].createdAt, certificateFor: 'Bank Loan', currentStatus: 'Approved', remarks: 'No remarks', otherDetails: undefined },
        ];

        await getBonafideApplications(mockReq, mockRes);

        expect(Student.findOne).toHaveBeenCalledTimes(1);
        expect(ApplicationDocument.find).toHaveBeenCalledTimes(1);
        expect(mockSort).toHaveBeenCalledTimes(1);
        expect(Bonafide.findOne).toHaveBeenCalledTimes(mockAppDocs.length);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(expectedJsonOutput); // Only valid app details included
        expect(console.log).toHaveBeenCalled()
    });

    test('should return 500 if Student.findOne fails', async () => {
        const dbError = new Error('Student DB connection error');
        Student.findOne.mockRejectedValue(dbError);

        await getBonafideApplications(mockReq, mockRes);

        expect(Student.findOne).toHaveBeenCalledTimes(1);
        expect(ApplicationDocument.find).not.toHaveBeenCalled();
        expect(Bonafide.findOne).not.toHaveBeenCalled();
        expect(console.error).toHaveBeenCalledTimes(1)
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ message: 'Error fetching applications' });
    });

    test('should return 500 if ApplicationDocument find/sort fails', async () => {
        const dbError = new Error('AppDoc DB query error');
        const mockStudent = { _id: mockStudentObjectId, userId: mockUserId };
        Student.findOne.mockResolvedValue(mockStudent);

        const mockSort = jest.fn().mockRejectedValue(dbError);
        ApplicationDocument.find.mockReturnValue({ sort: mockSort });

        await getBonafideApplications(mockReq, mockRes);

        expect(Student.findOne).toHaveBeenCalledTimes(1);
        expect(ApplicationDocument.find).toHaveBeenCalledTimes(1);
        expect(mockSort).toHaveBeenCalledTimes(1); // sort was called
        expect(Bonafide.findOne).not.toHaveBeenCalled();
        expect(console.error).toHaveBeenCalledTimes(1)
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ message: 'Error fetching applications' });
    });

    test('should return 500 if any Bonafide.findOne fails', async () => {
        const dbError = new Error('Bonafide DB query error');
        const mockStudent = { _id: mockStudentObjectId, userId: mockUserId };
        const mockAppDocs = [ // Need at least one app doc to trigger Bonafide lookup
            { _id: mockAppDocId1, studentId: mockStudentObjectId, documentType: 'Bonafide', createdAt: new Date(), status: 'Pending' }
        ];

        Student.findOne.mockResolvedValue(mockStudent);

        const mockSort = jest.fn().mockResolvedValue(mockAppDocs);
        ApplicationDocument.find.mockReturnValue({ sort: mockSort });

        // Mock Bonafide.findOne to reject
        Bonafide.findOne.mockRejectedValue(dbError);

        await getBonafideApplications(mockReq, mockRes);

        expect(Student.findOne).toHaveBeenCalledTimes(1);
        expect(ApplicationDocument.find).toHaveBeenCalledTimes(1);
        expect(mockSort).toHaveBeenCalledTimes(1);
        expect(Bonafide.findOne).toHaveBeenCalledTimes(1); // Attempted lookup
        expect(console.error).toHaveBeenCalledTimes(1)
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ message: 'Error fetching applications' });
    });
});