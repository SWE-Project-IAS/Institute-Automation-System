import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../index.js';
import { closeDB, resetDBConnectionForTests } from '../database/mongoDb.js';
import { User } from '../models/user.model.js';
import { AcadAdmin } from '../models/acadAdmin.model.js';
import bcrypt from 'bcrypt';
import { ApplicationDocument, Bonafide, Passport } from '../models/documents.models.js';
import {Complaint} from '../models/complaint.model.js';
import { Faculty } from "../models/faculty.model.js";
import { Student } from "../models/student.model.js";
import { after } from 'node:test';


const TEST_DB_URI = 'mongodb+srv://kevintj916:VvLxpm85TJLuxr0B@institutionautomationcl.bn7xvyp.mongodb.net/?retryWrites=true&w=majority&appName=institutionAutomationclu';
const agent = request(app);

beforeAll(async () => {
    await resetDBConnectionForTests(TEST_DB_URI);
});

afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await closeDB();
});

describe('POST /api/acadadmin/faculty/add-faculty - Add Faculty', () => {
    afterEach(async () => {
      await User.deleteMany({});
          await Faculty.deleteMany({});
          await Student.deleteMany({});
    });
  
    const validFacultyData = {
      name: "Dr. SitaRaman",
      email: "sitaraman@example.com",
      contactNo: "9876543210",
      address: "Bangalore, India",
      dateOfBirth: "1980-01-01",
      bloodGroup: "O+",
      department: "CSE",
      designation: "Professor",
      yearOfJoining: 2005,
      specialization: "Machine Learning",
      qualifications: ["PhD in CS", "MTech"],
      experience: "18 years",
      publications: ["Paper A", "Paper B"],
      achievements: ["Best Teacher Award"],
      conferences: []
    };
  
    it('should add a new faculty and create a linked user', async () => {
      const response = await request(app)
        .post('/api/acadadmin/faculty/add-faculty')
        .send(validFacultyData)
        .expect(201);
  
      expect(response.body.message).toBe("Faculty added successfully.");
  
      const user = await User.findOne({ email: validFacultyData.email });
      expect(user).not.toBeNull();
      expect(user.name).toBe(validFacultyData.name);
  
      const faculty = await Faculty.findOne({ email: validFacultyData.email });
      expect(faculty).not.toBeNull();
      expect(faculty.department).toBe(validFacultyData.department);
    });
  
    it('should not allow duplicate email for faculty user', async () => {
      // First insert
      await request(app).post('/api/acadadmin/faculty/add-faculty').send(validFacultyData);
  
      // Second insert with same email
      const response = await request(app)
        .post('/acadadmin/faculty/add-faculty')
        .send(validFacultyData)
        .expect(404);
    });
  });

describe('POST /api/acadadmin/students/add-students - Add Bulk Students', () => {
  afterEach(async () => {
    await User.deleteMany({});
    await Student.deleteMany({});
  });

  const validStudents = [
    {
      name: "Alice Johnson",
      email: "alice@example.com",
      contactNo: "1234567890",
      address: "Hyderabad",
      dateOfBirth: "2000-01-01",
      bloodGroup: "A+",
      rollNo: "CSE001",
      fatherName: "Mr. Johnson",
      motherName: "Mrs. Johnson",
      department: "CSE",
      semester: 4,
      batch: "2022",
      program: "BTech",
      hostel: "Lohit",
      roomNo: "101"
    },
    {
      name: "Bob Smith",
      email: "bob@example.com",
      contactNo: "9876543210",
      address: "Chennai",
      dateOfBirth: "2001-05-21",
      bloodGroup: "B+",
      rollNo: "CSE002",
      fatherName: "Mr. Smith",
      motherName: "Mrs. Smith",
      department: "CSE",
      semester: 4,
      batch: "2022",
      program: "BTech",
      hostel: "Lohit",
      roomNo: "102"
    }
  ];

  it('should add valid students and return 201 with message', async () => {
    const response = await agent
      .post('/api/acadadmin/students/add-students')
      .send(validStudents)
      .expect(201);

    expect(response.body.message).toBe("2 students added successfully");
    expect(response.body.data.length).toBe(2);

    const student1 = await Student.findOne({ email: "alice@example.com" });
    const student2 = await Student.findOne({ email: "bob@example.com" });

    expect(student1).not.toBeNull();
    expect(student2).not.toBeNull();
  });

  it('should skip incomplete student entries', async () => {
    const students = [...validStudents, {
      name: "Incomplete Student",
      email: "", // Missing required fields
      rollNo: "",
      fatherName: "",
      motherName: "",
      department: "",
      batch: "",
      program: "",
      hostel: "",
      roomNo: ""
    }];

    const response = await agent
      .post('/api/acadadmin/students/add-students')
      .send(students)
      .expect(201);

    expect(response.body.message).toBe("2 students added successfully");
    expect(response.body.data.length).toBe(2);
  });

  it('should skip duplicate student entries', async () => {
    // Insert one student first
    await agent.post('/api/acadadmin/students/add-students').send([validStudents[0]]);

    // Try inserting both again
    const response = await agent
      .post('/api/acadadmin/students/add-students')
      .send(validStudents)
      .expect(201);

    expect(response.body.message).toBe("1 students added successfully");
    expect(response.body.data.length).toBe(1);

    const studentCount = await Student.countDocuments();
    expect(studentCount).toBe(2); // One from first call + one new one
  });

  it('should return 400 if no data is provided', async () => {
    const response = await agent
      .post('/api/acadadmin/students/add-students')
      .send([])
      .expect(400);

    expect(response.body.message).toBe('No student data provided');
  });

  it('should return 500 on server error', async () => {
    // Temporarily break User.save
    const originalSave = User.prototype.save;
    User.prototype.save = () => {
      throw new Error("Simulated failure");
    };

    const response = await agent
      .post('/api/acadadmin/students/add-students')
      .send([validStudents[0]])
      .expect(500);

    expect(response.body.message).toBe('Internal server error');

    // Restore the original save method
    User.prototype.save = originalSave;
  });
});


describe('POST /api/acadadmin/documents/applications/:id/comment - Add Comment to Application', () => {
  let application;
  let testUser;
  let testStudent;
  
  beforeEach(async () => {
    testUser = new User({
      name: 'Test Student',
      email: 'teststudent@example.com',
      role: 'student',
      password: 'hashedpassword123',
      refreshToken: 'refreshToken',
      dateOfBirth: new Date('2000-01-15')
    });
    await testUser.save();

    testStudent = new Student({
      userId: testUser._id,
      email: 'teststudent@example.com',
      rollNo: 'B20CS001',
      fatherName: 'Test Father',
      motherName: 'Test Mother',
      department: 'Computer Science',
      semester: 3,
      batch: '2020-2024',
      program: 'BTech',
      status: 'active',
      hostel: 'Brahmaputra',
      roomNo: 'A-101',
      documentAccess: {
        transcript: true,
        idCard: true,
        feeReceipt: true
      }
    });
    await testStudent.save();
    
    application = await new ApplicationDocument({
      studentId: testStudent._id,
      documentType: 'Bonafide',
      approvalDetails: {
        remarks: [],
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    }).save();
  });
  
  afterEach(async () => {
    await User.deleteMany({});
    await Student.deleteMany({});
    await ApplicationDocument.deleteMany({});
  });

  it('should successfully add a comment to the application', async () => {
    const response = await agent
      .post(`/api/acadadmin/documents/applications/${application._id}/comment`)
      .send({ comment: 'Approved by HOD' })
      .expect(200);

    expect(response.body._id).toBe(application._id.toString());
    expect(response.body.approvalDetails.remarks).toContain('Approved by HOD');
  });

  it('should return 404 if application is not found', async () => {
    const fakeId = new mongoose.Types.ObjectId();

    const response = await agent
      .post(`/api/acadadmin/documents/applications/${fakeId}/comment`)
      .send({ comment: 'Test comment' })
      .expect(404);
  });

  it('should return error on server error', async () => {
    const original = ApplicationDocument.findByIdAndUpdate;
    ApplicationDocument.findByIdAndUpdate = () => {
      throw new Error('Simulated Error');
    };

    const response = await agent
      .post(`/api/acadadmin/documents/applications/${application._id}/comment`)
      .send({ comment: 'This should fail' })
      .expect(500);

    expect(response.body.message).toBe('Simulated Error');

    ApplicationDocument.findByIdAndUpdate = original;
  });
});
describe('GET /api/acadadmin/documents/applications - Get All Applications', () => {
  let testUser;
  let testStudent;
  let applicationOne;
  let applicationTwo;
  
  beforeEach(async () => {
    // Create test user and student
    testUser = new User({
      name: 'Test Student',
      email: 'teststudent@example.com',
      role: 'student',
      password: 'hashedpassword123',
      refreshToken: 'refreshToken',
      dateOfBirth: new Date('2000-01-15')
    });
    await testUser.save();

    testStudent = new Student({
      userId: testUser._id,
      email: 'teststudent@example.com',
      rollNo: 'B20CS001',
      fatherName: 'Test Father',
      motherName: 'Test Mother',
      department: 'Computer Science',
      semester: 3,
      batch: '2020-2024',
      program: 'BTech',
      status: 'active',
      hostel: 'Brahmaputra',
      roomNo: 'A-101',
      documentAccess: {
        transcript: true,
        idCard: true,
        feeReceipt: true
      }
    });
    await testStudent.save();
    
    // Create multiple test applications
    applicationOne = await new ApplicationDocument({
      studentId: testStudent._id,
      documentType: 'Bonafide',
      approvalDetails: {
        remarks: ['Initial review pending'],
      },
      createdAt: new Date('2023-05-10'),
      updatedAt: new Date('2023-05-10'),
    }).save();
    
    applicationTwo = await new ApplicationDocument({
      studentId: testStudent._id,
      documentType: 'Passport',
      approvalDetails: {
        remarks: ['Needs additional verification'],
      },
      createdAt: new Date('2023-05-15'),
      updatedAt: new Date('2023-05-15'),
    }).save();
    
    // Create Bonafide details for the first application
    await new Bonafide({
      applicationId: applicationOne._id,
      currentSemester: 3,
      purpose: 'Bank Account Opening',
      otherDetails: 'Need for scholarship'
    }).save();
    
    // Create Passport details with all required fields
    await new Passport({
      applicationId: applicationTwo._id,
      passportNumber: '',
      passportType: 'Regular',
      reason: 'Travel abroad for conference',
      // Add the missing required fields
      travelPlans: 'no',
      mode: 'normal',
      semester: 3,
      placeOfBirth: 'Mumbai',
      applicationType: 'fresh'
    }).save();
  });
  
  afterEach(async () => {
    await User.deleteMany({});
    await Student.deleteMany({});
    await ApplicationDocument.deleteMany({});
    await Bonafide.deleteMany({});
    await Passport.deleteMany({});
  });

  it('should retrieve all applications with pagination', async () => {
    const response = await agent
      .get('/api/acadadmin/documents/applications')
      .query({ page: 1, limit: 10 })
      .expect(200);

    expect(response.body.applications).toHaveLength(2);
    expect(response.body.totalPages).toBe(1);
    expect(response.body.currentPage).toBe('1');
    
    // Check that applications are sorted by createdAt in descending order
    // applicationTwo was created after applicationOne, so it should be first
    expect(response.body.applications[0]._id).toBe(applicationTwo._id.toString());
    expect(response.body.applications[1]._id).toBe(applicationOne._id.toString());
    
    // Verify student information is populated correctly
    expect(response.body.applications[0].studentId.name).toBe('Test Student');
    expect(response.body.applications[0].studentId.rollNo).toBe('B20CS001');
  });

  it('should respect pagination parameters', async () => {
    // Test with limit=1
    const response = await agent
      .get('/api/acadadmin/documents/applications')
      .query({ page: 1, limit: 1 })
      .expect(200);

    expect(response.body.applications).toHaveLength(1);
    expect(response.body.totalPages).toBe(2);
    expect(response.body.currentPage).toBe('1');
    
    // Get page 2
    const responsePage2 = await agent
      .get('/api/acadadmin/documents/applications')
      .query({ page: 2, limit: 1 })
      .expect(200);

    expect(responsePage2.body.applications).toHaveLength(1);
    expect(responsePage2.body.currentPage).toBe('2');
    
    // Ensure we got different applications
    expect(response.body.applications[0]._id).not.toBe(responsePage2.body.applications[0]._id);
  });

  it('should handle server errors gracefully', async () => {
    // Mock an error with the find method
    const originalFind = ApplicationDocument.find;
    ApplicationDocument.find = () => {
      throw new Error('Database connection failed');
    };

    const response = await agent
      .get('/api/acadadmin/documents/applications')
      .expect(500);

    expect(response.body.message).toBe('Database connection failed');
    
    // Restore the original method
    ApplicationDocument.find = originalFind;
  });
});

describe('GET /api/acadadmin/documents/applications/:id - Get Application By ID', () => {
  let testUser;
  let testStudent;
  let application;
  let bonafideDetails;
  
  beforeEach(async () => {
    // Create test user and student
    testUser = new User({
      name: 'Test Student',
      email: 'teststudent@example.com',
      role: 'student',
      password: 'hashedpassword123',
      refreshToken: 'refreshToken',
      dateOfBirth: new Date('2000-01-15'),
      contactNo: '9876543210'
    });
    await testUser.save();

    testStudent = new Student({
      userId: testUser._id,
      email: 'teststudent@example.com',
      rollNo: 'B20CS001',
      fatherName: 'Test Father',
      motherName: 'Test Mother',
      department: 'Computer Science',
      semester: 3,
      batch: '2020-2024',
      program: 'BTech',
      status: 'active',
      hostel: 'Brahmaputra',
      roomNo: 'A-101',
      documentAccess: {
        transcript: true,
        idCard: true,
        feeReceipt: true
      }
    });
    await testStudent.save();
    
    // Create a test application
    application = await new ApplicationDocument({
      studentId: testStudent._id,
      documentType: 'Bonafide',
      status: 'Pending',
      approvalDetails: {
        remarks: ['Initial submission'],
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    }).save();
    
    // Create Bonafide details for the application
    bonafideDetails = await new Bonafide({
      applicationId: application._id,
      currentSemester: 3,
      purpose: 'Bank Account Opening',
      otherDetails: 'Required for scholarship'
    }).save();
  });
  
  afterEach(async () => {
    await User.deleteMany({});
    await Student.deleteMany({});
    await ApplicationDocument.deleteMany({});
    await Bonafide.deleteMany({});
    await Passport.deleteMany({});
  });

  it('should retrieve a specific application with all details', async () => {
    const response = await agent
      .get(`/api/acadadmin/documents/applications/${application._id}`)
      .expect(200);
    
    // Verify application details
    expect(response.body._id).toBe(application._id.toString());
    expect(response.body.documentType).toBe('Bonafide');
    expect(response.body.status).toBe('Pending');
    
    // Verify student details are populated
    expect(response.body.studentDetails.name).toBe('Test Student');
    expect(response.body.studentDetails.rollNo).toBe('B20CS001');
    expect(response.body.studentDetails.dateOfBirth).toBeDefined();
    expect(response.body.studentDetails.email).toBe('teststudent@example.com');
    expect(response.body.studentDetails.contactNumber).toBe('9876543210');
    expect(response.body.studentDetails.hostelName).toBe('Brahmaputra');
    expect(response.body.studentDetails.roomNo).toBe('A-101');
    
    // Verify document-specific details are included
    expect(response.body.details).toBeDefined();
    expect(response.body.details.purpose).toBe('Bank Account Opening');
    expect(response.body.details.currentSemester).toBe(3);
    expect(response.body.details.otherDetails).toBe('Required for scholarship');
    
    // Verify approval details
    expect(response.body.approvalDetails).toBeDefined();
    expect(response.body.approvalDetails.remarks).toContain('Initial submission');
  });

  it('should return 404 if application is not found', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    
    const response = await agent
      .get(`/api/acadadmin/documents/applications/${fakeId}`)
      .expect(404);
    
    expect(response.body.message).toBe('Application not found');
  });

  it('should handle server errors gracefully', async () => {
    // Mock an error with the findById method
    const originalFindById = ApplicationDocument.findById;
    ApplicationDocument.findById = () => {
      throw new Error('Database query failed');
    };

    const response = await agent
      .get(`/api/acadadmin/documents/applications/${application._id}`)
      .expect(500);

    expect(response.body.message).toBe('Database query failed');
    
    ApplicationDocument.findById = originalFindById;
  });
  
  it('should handle different document types correctly', async () => {
    await ApplicationDocument.deleteMany({});
    await Bonafide.deleteMany({});
    
    const passportApp = await new ApplicationDocument({
      studentId: testStudent._id,
      documentType: 'Passport',
      status: 'Pending',
      approvalDetails: {
        remarks: ['Passport verification'],
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    }).save();
    
    const passportDetails = await new Passport({
      applicationId: passportApp._id,
      passportNumber: '',
      passportType: 'Regular',
      reason: 'Study abroad program',
      travelPlans: 'no',
      mode: 'normal',
      semester: 3,
      placeOfBirth: 'Delhi',
      applicationType: 'fresh'
    }).save();
    
    const response = await agent
      .get(`/api/acadadmin/documents/applications/${passportApp._id}`)
      .expect(200);
    
    expect(response.body.documentType).toBe('Passport');
    expect(response.body.details).toBeDefined();
    expect(response.body.details.travelPlans).toBe('no');
    expect(response.body.details.mode).toBe('normal');
  });
});

describe('PATCH /api/acadadmin/documents/applications/:id/status - Update Application Status', () => {
  let testUser;
  let testStudent;
  let application;
  
  beforeEach(async () => {
    // Create test user and student
    testUser = new User({
      name: 'Test Student',
      email: 'teststudent@example.com',
      role: 'student',
      password: 'hashedpassword123',
      refreshToken: 'refreshToken',
      dateOfBirth: new Date('2000-01-15'),
      contactNo: '9876543210'
    });
    await testUser.save();

    testStudent = new Student({
      userId: testUser._id,
      email: 'teststudent@example.com',
      rollNo: 'B20CS001',
      fatherName: 'Test Father',
      motherName: 'Test Mother',
      department: 'Computer Science',
      semester: 3,
      batch: '2020-2024',
      program: 'BTech',
      status: 'active',
      hostel: 'Brahmaputra',
      roomNo: 'A-101',
      documentAccess: {
        transcript: true,
        idCard: true,
        feeReceipt: true
      }
    });
    await testStudent.save();
    
    // Create a test application
    application = await new ApplicationDocument({
      studentId: testStudent._id,
      documentType: 'Bonafide',
      status: 'Pending',
      approvalDetails: {
        remarks: ['Initial submission'],
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    }).save();
    
    // Create Bonafide details for the application
    await new Bonafide({
      applicationId: application._id,
      currentSemester: 3,
      purpose: 'Bank Account Opening',
      otherDetails: 'Required for scholarship'
    }).save();
  });
  
  afterEach(async () => {
    await User.deleteMany({});
    await Student.deleteMany({});
    await ApplicationDocument.deleteMany({});
    await Bonafide.deleteMany({});
    await Passport.deleteMany({});
  });

  it('should successfully update application status', async () => {
    const response = await agent
      .patch(`/api/acadadmin/documents/applications/${application._id}/status`)
      .send({ status: 'approved' })
      .expect(200);
    
    expect(response.body._id).toBe(application._id.toString());
    expect(response.body.status).toBe('Approved'); // First letter uppercase
    
    // Verify the student details are populated
    expect(response.body.studentId.name).toBe('Test Student');
    expect(response.body.studentId.rollNo).toBe('B20CS001');
    
    // Check database directly to confirm update
    const updatedApp = await ApplicationDocument.findById(application._id);
    expect(updatedApp.status).toBe('Approved');
  });

  it('should successfully update status and add remarks', async () => {
    const response = await agent
      .patch(`/api/acadadmin/documents/applications/${application._id}/status`)
      .send({ 
        status: 'approved', 
        remarks: 'Approved after verification'
      })
      .expect(200);
    
    expect(response.body.status).toBe('Approved');
    expect(response.body.approvalDetails.remarks).toContain('Initial submission');
    expect(response.body.approvalDetails.remarks).toContain('Approved after verification');
    
    // Check database directly to confirm update
    const updatedApp = await ApplicationDocument.findById(application._id);
    expect(updatedApp.approvalDetails.remarks).toHaveLength(2);
    expect(updatedApp.approvalDetails.remarks[1]).toBe('Approved after verification');
  });

  it('should initialize approvalDetails if not present', async () => {
    // Create an application without approvalDetails
    await ApplicationDocument.deleteMany({});
    
    const noDetailsApp = await new ApplicationDocument({
      studentId: testStudent._id,
      documentType: 'Bonafide',
      status: 'Pending',
      // No approvalDetails provided
      createdAt: new Date(),
      updatedAt: new Date(),
    }).save();
    
    const response = await agent
      .patch(`/api/acadadmin/documents/applications/${noDetailsApp._id}/status`)
      .send({ 
        status: 'rejected', 
        remarks: 'Missing information' 
      })
      .expect(200);
    
    expect(response.body.status).toBe('Rejected');
    expect(response.body.approvalDetails.remarks).toHaveLength(1);
    expect(response.body.approvalDetails.remarks[0]).toBe('Missing information');
  });
  
  it('should return 400 if required fields are missing', async () => {
    // Missing status field
    const response = await agent
      .patch(`/api/acadadmin/documents/applications/${application._id}/status`)
      .send({ remarks: 'No status provided' })
      .expect(400);
    
    expect(response.body.message).toBe('Missing required fields');
    
    // Check that the application wasn't updated
    const unchangedApp = await ApplicationDocument.findById(application._id);
    expect(unchangedApp.status).toBe('Pending');
  });

  it('should return 404 if application is not found', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    
    const response = await agent
      .patch(`/api/acadadmin/documents/applications/${fakeId}/status`)
      .send({ status: 'approved' })
      .expect(404);
    
    expect(response.body.message).toBe('Application not found');
  });

  it('should handle server errors gracefully', async () => {
    // Mock an error with the findById method
    const originalFindById = ApplicationDocument.findById;
    ApplicationDocument.findById = () => {
      throw new Error('Database error occurred');
    };

    const response = await agent
      .patch(`/api/acadadmin/documents/applications/${application._id}/status`)
      .send({ status: 'approved' })
      .expect(500);

    expect(response.body.message).toBe('Database error occurred');
    
    // Restore the original method
    ApplicationDocument.findById = originalFindById;
  });
});