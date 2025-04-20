import { createCourse } from '../controllers/createCourse.controller.js';
import { Course, FacultyCourse, ProgramCourseMapping } from '../models/course.model.js';

// Mock the models
jest.mock('../models/course.model.js');

describe('createCourse Controller', () => {
  // Setup request and response objects
  let req;
  let res;
  let consoleLogSpy;
  let consoleErrorSpy;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Mock console methods
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    // Mock response object with status and json functions
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // Mock request object with default valid data
    req = {
      body: {
        courseCode: 'CS101',
        courseName: 'Introduction to Programming',
        maxIntake: 100,
        faculty: 'F12345',
        slot: 'A',
        courseDepartment: 'Computer Science',
        credits: 4,
        year: 2025,
        session: 'Spring Semester',
        configurations: [
          {
            program: 'BTech',
            department: 'Computer Science',
            semesters: ['1', '2'],
            type: 'Core'
          }
        ]
      }
    };

    // Default mock implementations
    Course.findOne = jest.fn().mockResolvedValue(null);
    Course.prototype.save = jest.fn().mockResolvedValue({
      courseCode: 'CS101',
      courseName: 'Introduction to Programming',
      department: 'Computer Science',
      maxIntake: 100,
      slot: 'A',
      credits: 4
    });

    FacultyCourse.prototype.save = jest.fn().mockResolvedValue({});
    ProgramCourseMapping.prototype.save = jest.fn().mockResolvedValue({});
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  test('should successfully create a new course and mappings', async () => {
    await createCourse(req, res);

    expect(Course.findOne).toHaveBeenCalledWith({ courseCode: 'CS101' });
    expect(Course.prototype.save).toHaveBeenCalled();
    expect(FacultyCourse.prototype.save).toHaveBeenCalledTimes(2); // Once for each semester
    expect(ProgramCourseMapping.prototype.save).toHaveBeenCalledTimes(2); // Once for each semester
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Course and mappings created successfully',
      courseCode: 'CS101'
    });
    expect(consoleLogSpy).toHaveBeenCalledWith('Mappings created successfully');
  });

  test('should update an existing course instead of creating a new one', async () => {
    // Mock finding an existing course
    const existingCourse = {
      courseCode: 'CS101',
      courseName: 'Intro to Programming',
      department: 'Computer Science',
      maxIntake: 80,
      slot: 'B',
      credits: 3,
      save: jest.fn().mockResolvedValue({})
    };
    Course.findOne = jest.fn().mockResolvedValue(existingCourse);

    await createCourse(req, res);

    expect(Course.findOne).toHaveBeenCalledWith({ courseCode: 'CS101' });
    expect(Course.prototype.save).not.toHaveBeenCalled(); // Should not create new course
    expect(existingCourse.save).not.toHaveBeenCalled(); // Existing course should not be updated
    expect(FacultyCourse.prototype.save).toHaveBeenCalledTimes(2);
    expect(ProgramCourseMapping.prototype.save).toHaveBeenCalledTimes(2);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Course and mappings created successfully',
      courseCode: 'CS101'
    });
  });

  test('should return 400 if courseCode is missing', async () => {
    req.body.courseCode = null;
    await createCourse(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Missing required course fields' });
    expect(Course.prototype.save).not.toHaveBeenCalled();
    expect(FacultyCourse.prototype.save).not.toHaveBeenCalled();
    expect(ProgramCourseMapping.prototype.save).not.toHaveBeenCalled();
  });

  test('should return 400 if courseName is missing', async () => {
    req.body.courseName = null;
    await createCourse(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Missing required course fields' });
    expect(Course.prototype.save).not.toHaveBeenCalled();
  });

  test('should return 400 if courseDepartment is missing', async () => {
    req.body.courseDepartment = null;
    await createCourse(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Missing required course fields' });
    expect(Course.prototype.save).not.toHaveBeenCalled();
  });

  test('should skip invalid configurations but process valid ones', async () => {
    req.body.configurations = [
      // Valid configuration
      {
        program: 'BTech',
        department: 'Computer Science',
        semesters: ['1'],
        type: 'Core'
      },
      // Invalid configuration (missing program)
      {
        department: 'Computer Science',
        semesters: ['2'],
        type: 'Elective'
      },
      // Invalid configuration (missing semesters)
      {
        program: 'MTech',
        department: 'Computer Science',
        type: 'Elective'
      },
      // Invalid configuration (empty semesters array)
      {
        program: 'PhD',
        department: 'Computer Science',
        semesters: [],
        type: 'Elective'
      }
    ];

    await createCourse(req, res);

    expect(Course.prototype.save).toHaveBeenCalled();
    expect(FacultyCourse.prototype.save).toHaveBeenCalledTimes(1); // Only one valid config
    expect(ProgramCourseMapping.prototype.save).toHaveBeenCalledTimes(1); // Only one valid config
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test('should handle multiple semesters in a configuration', async () => {
    req.body.configurations = [
      {
        program: 'BTech',
        department: 'Computer Science',
        semesters: ['1', '2', '3'],
        type: 'Core'
      }
    ];

    await createCourse(req, res);

    expect(Course.prototype.save).toHaveBeenCalled();
    expect(FacultyCourse.prototype.save).toHaveBeenCalledTimes(3); // Once for each semester
    expect(ProgramCourseMapping.prototype.save).toHaveBeenCalledTimes(3); // Once for each semester
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test('should handle database error during course creation', async () => {
    const error = new Error('Database connection error');
    Course.findOne = jest.fn().mockRejectedValue(error);

    await createCourse(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Database connection error'
    });
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error in createCourse:', error);
  });

  test('should handle database error during faculty course mapping creation', async () => {
    const error = new Error('Faculty mapping error');
    FacultyCourse.prototype.save = jest.fn().mockRejectedValue(error);

    await createCourse(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Faculty mapping error'
    });
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error in createCourse:', error);
  });

  test('should handle database error during program course mapping creation', async () => {
    const error = new Error('Program mapping error');
    // First allow faculty course to save, but fail on program mapping
    FacultyCourse.prototype.save = jest.fn().mockResolvedValue({});
    ProgramCourseMapping.prototype.save = jest.fn().mockRejectedValue(error);

    await createCourse(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Program mapping error'
    });
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error in createCourse:', error);
  });
});
