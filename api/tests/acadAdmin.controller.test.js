import { getAllApplications, filterApplications, getApplicationById, updateApplicationStatus, addComment, addFeeStructure } from '../controllers/acadAdmin.controller.js';
import { ApplicationDocument, Bonafide, Passport } from '../models/documents.models.js';
import { Student } from '../models/student.model.js';
import { FeeBreakdown } from '../models/fees.model.js';

// Mock the models
jest.mock('../models/documents.models.js');
jest.mock('../models/student.model.js');
jest.mock('../models/user.model.js');
jest.mock('../models/fees.model.js');

describe('Document Controller Functions', () => {
  let req;
  let res;
  let consoleErrorSpy;
  let consoleLogSpy;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Mock console methods
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

    // Mock response object with status and json functions
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // Reset request object
    req = { query: {}, params: {}, body: {} };
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    consoleLogSpy.mockRestore();
  });

  describe('getAllApplications Function', () => {
    beforeEach(() => {
      // Default request
      req.query = { page: 1, limit: 10 };

      // Default mocks
      ApplicationDocument.find = jest.fn().mockReturnThis();
      ApplicationDocument.populate = jest.fn().mockReturnThis();
      ApplicationDocument.sort = jest.fn().mockReturnThis();
      ApplicationDocument.limit = jest.fn().mockReturnThis();
      ApplicationDocument.skip = jest.fn().mockReturnThis();
      ApplicationDocument.lean = jest.fn().mockResolvedValue([
        {
          _id: 'app1',
          documentType: 'Bonafide',
          status: 'Pending',
          studentId: {
            _id: 'student1',
            rollNo: 'BT101',
            department: 'CSE',
            program: 'BTech',
            userId: {
              _id: 'user1',
              name: 'John Doe'
            }
          }
        }
      ]);

      ApplicationDocument.countDocuments = jest.fn().mockResolvedValue(15);
    });

    test('should successfully get all applications with pagination', async () => {
      await getAllApplications(req, res);

      expect(ApplicationDocument.find).toHaveBeenCalled();
      expect(ApplicationDocument.sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(ApplicationDocument.limit).toHaveBeenCalledWith(10);
      expect(ApplicationDocument.skip).toHaveBeenCalledWith(0);
      expect(ApplicationDocument.countDocuments).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        applications: [
          {
            _id: 'app1',
            documentType: 'Bonafide',
            status: 'Pending',
            studentId: {
              _id: 'student1',
              rollNo: 'BT101',
              department: 'CSE',
              program: 'BTech',
              name: 'John Doe',
              userId: {
                "_id": "user1",
                "name": "John Doe",
              },
            }
          }
        ],
        totalPages: 2,
        currentPage: 1
      });
    });

    test('should handle default pagination parameters', async () => {
      req.query = {}; // No page or limit provided

      await getAllApplications(req, res);

      expect(ApplicationDocument.limit).toHaveBeenCalledWith(10);
      expect(ApplicationDocument.skip).toHaveBeenCalledWith(0);
    });

    // test('should handle error when retrieving applications', async () => {
    //   const error = new Error('Database error');

    //   // Use that same error in the mock
    //   ApplicationDocument.find = jest.fn().mockRejectedValue(error);

    //   await getAllApplications(req, res);

    //   expect(res.status).toHaveBeenCalledWith(500);
    //   expect(res.json).toHaveBeenCalledWith({ message: error.message });
    // });
  });

  describe('filterApplications Function', () => {
    beforeEach(() => {
      // Default request
      req.query = {
        rollNo: 'BT101',
        type: 'Bonafide',
        status: 'pending'
      };

      // Mock Student.findOne
      Student.findOne = jest.fn().mockResolvedValue({
        _id: 'student1',
        rollNo: 'BT101',
        department: 'CSE'
      });

      // Mock ApplicationDocument.find
      ApplicationDocument.find = jest.fn().mockReturnThis();
      ApplicationDocument.populate = jest.fn().mockReturnThis();
      ApplicationDocument.sort = jest.fn().mockReturnThis();
      ApplicationDocument.lean = jest.fn().mockResolvedValue([
        {
          _id: 'app1',
          documentType: 'Bonafide',
          status: 'Pending',
          studentId: {
            _id: 'student1',
            rollNo: 'BT101',
            department: 'CSE',
            program: 'BTech',
            userId: {
              _id: 'user1',
              name: 'John Doe'
            }
          }
        }
      ]);

      // Mock Bonafide.findOne
      Bonafide.findOne = jest.fn().mockResolvedValue({
        _id: 'bonafide1',
        applicationId: 'app1',
        currentSemester: 3,
        purpose: 'Bank Account Opening'
      });

      // Mock Passport.findOne
      Passport.findOne = jest.fn().mockResolvedValue(null);
    });

    test('should filter applications based on rollNo, type and status', async () => {
      await filterApplications(req, res);

      expect(Student.findOne).toHaveBeenCalledWith({
        rollNo: { $regex: '^BT101', $options: 'i' }
      });

      expect(ApplicationDocument.find).toHaveBeenCalledWith({
        studentId: 'student1',
        documentType: 'Bonafide',
        status: 'Pending'
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();
    });

    test('should return empty array when no student found', async () => {
      Student.findOne = jest.fn().mockResolvedValue(null);

      await filterApplications(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([]);
    });

    test('should handle "all" type and status', async () => {
      req.query = {
        rollNo: 'BT101',
        type: 'all',
        status: 'all'
      };

      await filterApplications(req, res);

      expect(ApplicationDocument.find).toHaveBeenCalledWith({
        studentId: 'student1'
      });
    });

    test('should handle error when filtering applications', async () => {
      const error = new Error('Filter error');
      Student.findOne = jest.fn().mockRejectedValue(new Error('Filter error'));

      await filterApplications(req, res);

      expect(consoleErrorSpy).toHaveBeenCalledWith('Filter Applications Error:', error);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: error.message });
    });
  });

  describe('getApplicationById Function', () => {
    beforeEach(() => {
      // Default request
      req.params = { id: 'app1' };

      // Mock ApplicationDocument.findById
      ApplicationDocument.findById = jest.fn().mockReturnThis();
      ApplicationDocument.populate = jest.fn().mockReturnThis();
      ApplicationDocument.lean = jest.fn().mockResolvedValue({
        _id: 'app1',
        documentType: 'Bonafide',
        status: 'Pending',
        updatedAt: new Date(),
        studentId: {
          _id: 'student1',
          rollNo: 'BT101',
          department: 'CSE',
          program: 'BTech',
          semester: 3,
          hostel: 'Brahmaputra',
          roomNo: 'A101',
          batch: '2021',
          fatherName: 'John Doe Sr',
          motherName: 'Jane Doe',
          userId: {
            _id: 'user1',
            name: 'John Doe',
            dateOfBirth: new Date('2000-01-01'),
            email: 'john@example.com',
            contactNo: '9876543210'
          }
        },
        approvalDetails: {
          remarks: ['Good application']
        }
      });

      // Mock Bonafide.findOne
      Bonafide.findOne = jest.fn().mockResolvedValue({
        _id: 'bonafide1',
        applicationId: 'app1',
        currentSemester: 3,
        purpose: 'Bank Account Opening'
      });
    });

    test('should get application by ID with detailed information', async () => {
      await getApplicationById(req, res);

      expect(ApplicationDocument.findById).toHaveBeenCalledWith('app1');
      expect(Bonafide.findOne).toHaveBeenCalledWith({ applicationId: 'app1' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();
      expect(res.json.mock.calls[0][0]).toHaveProperty('studentDetails');
      expect(res.json.mock.calls[0][0]).toHaveProperty('details');
    });

    test('should handle passport document type', async () => {
      // Mock a passport application
      ApplicationDocument.lean = jest.fn().mockResolvedValue({
        _id: 'app2',
        documentType: 'Passport',
        studentId: {
          _id: 'student1',
          userId: {
            name: 'John Doe'
          }
        }
      });

      Passport.findOne = jest.fn().mockResolvedValue({
        _id: 'passport1',
        applicationId: 'app2',
        applicationType: 'fresh'
      });

      await getApplicationById(req, res);

      expect(Passport.findOne).toHaveBeenCalledWith({ applicationId: 'app2' });
    });

    test('should handle application not found', async () => {
      ApplicationDocument.findById = jest.fn().mockReturnThis();
      ApplicationDocument.populate = jest.fn().mockReturnThis();
      ApplicationDocument.lean = jest.fn().mockResolvedValue(null);

      await getApplicationById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Application not found' });
    });

    // test('should handle error when retrieving application', async () => {
    //   // const error = new Error('Database error');
    //   ApplicationDocument.findById = jest.fn().mockRejectedValue(Error('Database error'));

    //   await getApplicationById(req, res);

    //   expect(res.status).toHaveBeenCalledWith(500);
    //   expect(res.json).toHaveBeenCalledWith({ message: error.message });
    // });
  });

  describe('updateApplicationStatus Function', () => {
    beforeEach(() => {
      // Default request
      req.params = { id: 'app1' };
      req.body = {
        status: 'approved',
        remarks: 'Application approved'
      };

      // Mock ApplicationDocument.findById
      ApplicationDocument.findById = jest.fn().mockResolvedValue({
        _id: 'app1',
        status: 'Pending',
        approvalDetails: {
          remarks: []
        },
        save: jest.fn().mockResolvedValue({
          populate: jest.fn().mockResolvedValue({
            _id: 'app1',
            status: 'Approved',
            approvalDetails: {
              remarks: ['Application approved']
            },
            studentId: {
              _id: 'student1',
              rollNo: 'BT101',
              department: 'CSE',
              program: 'BTech',
              userId: {
                _id: 'user1',
                name: 'John Doe'
              },
              toObject: jest.fn().mockReturnValue({
                _id: 'student1',
                rollNo: 'BT101',
                department: 'CSE',
                program: 'BTech',
                userId: {
                  _id: 'user1',
                  name: 'John Doe'
                }
              })
            },
            toObject: jest.fn().mockReturnValue({
              _id: 'app1',
              status: 'Approved',
              approvalDetails: {
                remarks: ['Application approved']
              },
              studentId: {
                _id: 'student1',
                rollNo: 'BT101',
                department: 'CSE',
                program: 'BTech',
                userId: {
                  _id: 'user1',
                  name: 'John Doe'
                }
              }
            })
          })
        })
      });
    });

    // test('should update application status and add remarks', async () => {
    //   await updateApplicationStatus(req, res);

    //   const mockApplication = await ApplicationDocument.findById('app1');
    //   expect(mockApplication.status).toBe('Approved');
    //   expect(mockApplication.save).toHaveBeenCalled();
    //   expect(res.status).toHaveBeenCalledWith(200);
    // });

    test('should handle missing required fields', async () => {
      req.body = {}; // No status provided

      await updateApplicationStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Missing required fields' });
    });

    test('should handle application not found', async () => {
      ApplicationDocument.findById = jest.fn().mockResolvedValue(null);

      await updateApplicationStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Application not found' });
    });

    test('should initialize approvalDetails if not present', async () => {
      ApplicationDocument.findById = jest.fn().mockResolvedValue({
        _id: 'app1',
        status: 'Pending',
        approvalDetails: null,
        save: jest.fn().mockResolvedValue({
          populate: jest.fn().mockResolvedValue({
            toObject: jest.fn().mockReturnValue({})
          })
        })
      });

      await updateApplicationStatus(req, res);

      const mockApplication = await ApplicationDocument.findById('app1');
      expect(mockApplication.approvalDetails).toHaveProperty('remarks');
      expect(mockApplication.approvalDetails).toHaveProperty('remarks');
    });

    test('should handle error when updating application', async () => {
      const error = new Error('Database error');
      ApplicationDocument.findById = jest.fn().mockRejectedValue(error);

      await updateApplicationStatus(req, res);

      expect(consoleErrorSpy).toHaveBeenCalledWith('Error updating application status:', error);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: error.message || 'Internal server error' });
    });
  });

  describe('addComment Function', () => {
    beforeEach(() => {
      // Default request
      req.params = { id: 'app1' };
      req.body = { comment: 'This is a comment' };

      // Mock ApplicationDocument.findByIdAndUpdate
      ApplicationDocument.findByIdAndUpdate = jest.fn().mockResolvedValue({
        _id: 'app1',
        status: 'Pending',
        approvalDetails: {
          remarks: ['This is a comment']
        }
      });
    });

    test('should add comment to application', async () => {
      await addComment(req, res);

      expect(ApplicationDocument.findByIdAndUpdate).toHaveBeenCalledWith(
        'app1',
        {
          $push: {
            'approvalDetails.remarks': 'This is a comment'
          },
          updatedAt: expect.any(Date)
        },
        { new: true }
      );
      expect(res.status).toHaveBeenCalledWith(200);
    });

    test('should handle application not found', async () => {
      ApplicationDocument.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

      await addComment(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Application not found' });
    });

    test('should handle error when adding comment', async () => {
      const error = new Error('Database error');
      ApplicationDocument.findByIdAndUpdate = jest.fn().mockRejectedValue(error);

      await addComment(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: error.message });
    });
  });

  describe('addFeeStructure Function', () => {
    beforeEach(() => {
      // Default request
      req.body = {
        semesterParity: '1',
        program: 'BTech',
        tuitionFees: 110000,
        examinationFees: 1000,
        registrationFee: 500,
        gymkhanaFee: 1500,
        medicalFee: 1000,
        hostelFund: 5000,
        hostelRent: 12500,
        elecAndWater: 2500,
        messAdvance: 24000,
        studentsBrotherhoodFund: 500,
        acadFacilitiesFee: 5000,
        hostelMaintenance: 2000,
        studentsTravelAssistance: 500
      };

      // Mock FeeBreakdown.findOne
      FeeBreakdown.findOne = jest.fn().mockResolvedValue(null);

      // Mock FeeBreakdown constructor and save
      FeeBreakdown.mockImplementation(() => ({
        ...req.body,
        semesterParity: parseInt(req.body.semesterParity),
        save: jest.fn().mockResolvedValue({
          _id: 'fee1',
          ...req.body,
          semesterParity: parseInt(req.body.semesterParity)
        })
      }));
    });

    test('should create new fee structure when none exists', async () => {
      await addFeeStructure(req, res);

      expect(FeeBreakdown.findOne).toHaveBeenCalledWith({
        program: 'BTech',
        semesterParity: 1
      });
      expect(FeeBreakdown).toHaveBeenCalledWith({
        ...req.body,
        semesterParity: 1
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Fee structure created successfully',
        success: true,
        data: expect.any(Object)
      });
    });

    test('should update existing fee structure', async () => {
      // Mock existing fee structure
      const existingStructure = {
        _id: 'fee1',
        program: 'BTech',
        semesterParity: 1
      };
      FeeBreakdown.findOne = jest.fn().mockResolvedValue(existingStructure);

      // Mock FeeBreakdown.findByIdAndUpdate
      FeeBreakdown.findByIdAndUpdate = jest.fn().mockResolvedValue({
        _id: 'fee1',
        ...req.body,
        semesterParity: 1
      });

      await addFeeStructure(req, res);

      expect(FeeBreakdown.findByIdAndUpdate).toHaveBeenCalledWith(
        'fee1',
        {
          ...req.body,
          semesterParity: 1,
          updatedAt: expect.any(Date)
        },
        { new: true }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Fee structure updated successfully',
        success: true,
        data: expect.any(Object)
      });
    });

    test('should handle errors when adding fee structure', async () => {
      const error = new Error('Database error');
      FeeBreakdown.findOne = jest.fn().mockRejectedValue(error);

      await addFeeStructure(req, res);

      expect(consoleErrorSpy).toHaveBeenCalledWith('Error managing fee structure:', error);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Failed to manage fee structure',
        success: false,
        error: error.message
      });
    });
  });
});
