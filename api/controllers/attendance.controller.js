import {Course} from '../models/course.model.js';
import { Attendance } from '../models/attendance.model.js';
import { FacultyCourse } from '../models/course.model.js';
import { StudentCourse } from '../models/course.model.js';
import { Student } from '../models/student.model.js';
//Student Side

export const getPercentages = async (req, res) => {
  const rollNo = req.headers['rollno'];
  const role = req.headers['role'];
  if (!rollNo) {
    return res.status(400).json({ error: 'Roll number is required in headers' });
  }

  try {
    // Step 1: Get the student's enrolled courses from studentCourseSchema
    // Note: We're using courseId which is a string in your schema (not an ObjectId)
    var studentCourses = []; 
    if (role === 'student') {
    studentCourses = await StudentCourse.find({ 
      rollNo,
      status: 'Approved',
      isCompleted: false
    });
  }
  else {
    studentCourses = await StudentCourse.find({ 
      rollNo,
      status: 'Approved'
    });
  }
    
    if (studentCourses.length === 0) {
      return res.json({
        rollNo,
        message: 'No approved courses found for this student',
        attendance: []
      });
    }
    
    // Step 2: Extract course IDs
    const courseIds = studentCourses.map(course => course.courseId);
    
    // Step 3: Fetch course details to get courseCode and courseName
    // We'll use a try-catch for each course to handle potential errors
    const courseDetailsMap = {};
    
    for (const courseId of courseIds) {
      try {
        // Find by courseId NOT by _id
        const course = await Course.findOne({ courseCode:courseId });
        if (course) {
          courseDetailsMap[courseId] = {
            courseCode: course.courseCode,
            courseName: course.courseName
          };
        } else {
          // If course not found, use courseId as both code and name
          courseDetailsMap[courseId] = {
            courseCode: courseId,
            courseName: courseId
          };
        }
      } catch (courseError) {
        console.error(`Error fetching course ${courseId}: ${courseError.message}`);
        // Still add entry with courseId as fallback
        courseDetailsMap[courseId] = {
          courseCode: courseId,
          courseName: courseId
        };
      }
    }
    
    // Step 4: Calculate attendance for each course
    const attendanceResults = [];
    
    for (const courseId of courseIds) {
      const courseDetails = courseDetailsMap[courseId];
      const courseCode = courseDetails.courseCode;
      
      // Get total days
      const totalDays = await Attendance.countDocuments({ 
        rollNo,
        courseCode,
        isApproved: true
      });
      
      // Get present days
      const presentDays = await Attendance.countDocuments({ 
        rollNo,
        courseCode,
        isPresent: true,
        isApproved: true
      });
      
      // Calculate percentage
      const percentage = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;
      
      attendanceResults.push({
        courseCode,
        courseName: courseDetails.courseName,
        percentage: parseFloat(percentage.toFixed(2)),
        totalDays,
        presentDays
      });
    }
    
    // Return the results
    res.json({
      rollNo,
      attendance: attendanceResults
    });
    
  } catch (error) {
    console.error('Error calculating attendance percentages:', error);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: error.message,
      stack: error.stack
    });
  }
};

  export const getCourse = async (req, res) => {
    const { courseId } = req.params;
    const studentId = req.headers['rollno'];
    if (!studentId) {
      return res.status(400).json({ error: 'Roll number is required in headers' });
    }  
    try {
      // Find the course by courseCode to get course details
      const course = await Course.findOne({ courseCode: courseId });
      
      if (!course) {
        return res.status(404).json({ error: 'No such course' });
      }

      // Get attendance records for this specific student and course
      const attendanceAll = await Attendance.find({
        courseCode: courseId,
        rollNo: studentId
      });
      
      // Calculate statistics
      const classesAttended = attendanceAll.filter(record => record.isPresent && record.isApproved).length;
      const classesMissed = attendanceAll.filter(record => record.isApproved).length - classesAttended;
      const percentage = ((classesAttended + classesMissed) ? 
        (classesAttended / (classesAttended + classesMissed)) * 100 : 0).toFixed(2);
      const reqClasses = Math.max(0, 3 * classesMissed - classesAttended);
      
      // Format event list for calendar display
      const eventList = attendanceAll.map(record => {
        let title = '';
        
        if (!record.isApproved) {
          title = "pending approval";
        } else if (!record.isPresent) {
          title = "absent";
        } else {
          title = "present";
        }
      
        return {
          title,
          start: record.date,
          end: record.date,
          allDay: true,
          resource: { 
            isPresent: record.isPresent, 
            isApproved: record.isApproved 
          }
        };
      });
      
      
      res.status(200).json({
        student: studentId,
        courseId,
        courseName: course.courseName, // Added course name from the fetched course document
        attendanceRecords: attendanceAll,
        stats: {
          percentage,
          classesMissed,
          classesAttended, 
          reqClasses
        },
        eventList
      });
    } catch (error) {
      console.error('Error fetching course attendance:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  // Faculty Side
  export const createAttendanceRecord = async (req, res) => {
    // Extract data from request body
    const { courseCode, date, isPresent, isApproved } = req.body;
    const rollNo = req.headers['rollno'];
    try {
      // Validate required fields
      if (!courseCode || !rollNo) {
        return res.status(400).json({ error: 'Course code and roll number are required' });
      }
      
      // Check if a record already exists for this student, course, and date
      const existingRecord = await Attendance.findOne({
        courseCode,
        rollNo,
        date: date ? new Date(date) : new Date()
      });
      
      if (existingRecord) {
        return res.status(400).json({ 
          error: 'An attendance record already exists for this student, course, and date',
          existingRecord
        });
      }
      
      // Create a new attendance record
      const newAttendance = new Attendance({
        courseCode,
        rollNo,
        date: date ? new Date(date) : new Date(),
        isPresent: isPresent !== undefined ? isPresent : false,
        isApproved: isApproved !== undefined ? isApproved : false,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      // Save to database
      await newAttendance.save();
      
      // Return success response
      res.status(201).json({
        success: true,
        message: 'Attendance record created successfully',
        data: newAttendance
      });
      
    } catch (error) {
      console.error('Error creating attendance record:', error);
      res.status(500).json({ 
        error: 'Internal Server Error', 
        message: error.message 
      });
    }
  };

  export const createBulkAttendanceRecords = async (req, res) => {
    const { attendanceRecords } = req.body;
    const courseCode = req.params.id; 

    if (!attendanceRecords || !Array.isArray(attendanceRecords) || attendanceRecords.length === 0) {
        return res.status(400).json({ error: 'attendanceRecords array is required' });
    }

    try {
        const results = [];
        const errors = [];

        // Process each record sequentially
        for (const record of attendanceRecords) {
            try {
                // Validate and parse the date
                let mongoDate;
                try {
                    // Parse yyyy-mm-dd and set to noon UTC to avoid timezone issues
                    const [year, month, day] = record.date.split('-');
                    mongoDate = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
                    
                    // Validate the date
                    if (isNaN(mongoDate.getTime())) {
                        throw new Error('Invalid date format');
                    }
                } catch (dateError) {
                    errors.push({
                        success: false,
                        record,
                        error: `Invalid date format: ${record.date}. Expected yyyy-mm-dd`
                    });
                    continue; // Skip to next record
                }

                // Create a mock request object for the existing controller
                const mockReq = {
                    body: {
                        courseCode,
                        date: mongoDate, // Now passing properly formatted Date object
                        isPresent: record.status === 'present',
                        isApproved: false // Default to false for bulk uploads
                    },
                    headers: {
                        rollno: record.rollNo
                    }
                };

                // Create a mock response object to capture the result
                const mockRes = {
                    status: function(code) {
                        this.statusCode = code;
                        return this;
                    },
                    json: function(data) {
                        this.responseData = data;
                        return this;
                    }
                };

                // Call the existing controller
                await createAttendanceRecord(mockReq, mockRes);

                if (mockRes.statusCode === 201) {
                    results.push({
                        success: true,
                        record,
                        data: mockRes.responseData
                    });
                } else {
                    errors.push({
                        success: false,
                        record,
                        error: mockRes.responseData.error || 'Unknown error'
                    });
                }
            } catch (error) {
                errors.push({
                    success: false,
                    record,
                    error: error.message
                });
            }
        }

        // Return summary of results
        res.status(200).json({
            success: true,
            message: `Bulk upload processed with ${results.length} successes and ${errors.length} failures`,
            results,
            errors
        });

    } catch (error) {
        console.error('Error in bulk attendance upload:', error);
        res.status(500).json({ 
            error: 'Internal Server Error', 
            message: error.message 
        });
    }
};

export const getFacultyCourses = async (req, res) => {
  try {
    const facultyId = req.headers['userid'];
    // Validate facultyId
    if (!facultyId) {
      return res.status(400).json({
        success: false,
        message: 'Faculty ID is required'
      });
    }
    
    // Find all courses taught by the faculty
    const facultyCourses = await FacultyCourse.find({ facultyId, status: "Ongoing" });
    
    if (!facultyCourses.length) {
      return res.status(404).json({
        success: false,
        message: 'No courses found for this faculty'
      });
    }
    
    // Get course codes from faculty courses
    const courseCodes = facultyCourses.map(course => course.courseCode);
    
    // Get course details for all course codes
    const courseDetails = await Course.find({ courseCode: { $in: courseCodes } })
      .select('courseCode courseName')
      .lean();
    
    // Create a map of course codes to course names
    const courseNameMap = {};
    courseDetails.forEach(course => {
      courseNameMap[course.courseCode] = course.courseName;
    });
    
    // For each course, calculate attendance percentage
    const coursesWithAttendance = await Promise.all(
      facultyCourses.map(async (course) => {
        // First, get all students who have not completed this course
        const activeStudents = await StudentCourse.find({
          courseId: course.courseCode,
          isCompleted: false
        }).select('rollNo');
        
        // Extract roll numbers of active students
        const activeStudentRolls = activeStudents.map(student => student.rollNo);
        
        // If no active students found
        if (!activeStudentRolls.length) {
          return {
            ...course.toObject(),
            courseName: courseNameMap[course.courseCode] || 'Unknown Course',
            attendancePercentage: 0,
            totalStudents: 0
          };
        }
        
        // Get all attendance records for this course for active students only
        const attendanceRecords = await Attendance.find({
          courseCode: course.courseCode,
          rollNo: { $in: activeStudentRolls }
        });
        
        // If no attendance records found for active students
        if (!attendanceRecords.length) {
          return {
            ...course.toObject(),
            courseName: courseNameMap[course.courseCode] || 'Unknown Course',
            attendancePercentage: 0,
            totalStudents: activeStudentRolls.length
          };
        }
        
        // Get unique student roll numbers from attendance records
        const uniqueStudents = [...new Set(attendanceRecords.map(record => record.rollNo))];
        const totalStudents = uniqueStudents.length;
        
        // Count total present attendance
        const totalPresent = attendanceRecords.filter(record => record.isPresent && record.isApproved).length;
        
        // Total possible attendance (total approved records)
        const totalAttendance = attendanceRecords.filter(record => record.isApproved).length;
        
        // Calculate percentage
        const attendancePercentage = totalAttendance > 0 
          ? (totalPresent / totalAttendance) * 100 
          : 0;
        
        return {
          ...course.toObject(),
          courseName: courseNameMap[course.courseCode] || 'Unknown Course',
          attendancePercentage: parseFloat(attendancePercentage.toFixed(2)),
          totalStudents
        };
      })
    );
    
    return res.status(200).json({
      success: true,
      data: coursesWithAttendance,
      count: coursesWithAttendance.length
    });
    
  } catch (error) {
    console.error('Error in getFacultyCourse:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

export const getStudents = async (req, res) => {
  try {
    const { id } = req.params;
    const courseId = id
    if (!courseId) {
      return res.status(400).json({ message: 'Course ID is required' });
    }

    // Find all students who are enrolled (Approved status) in the given course
    const enrolledStudents = await StudentCourse.find({
      courseId,
      status: 'Approved',
      isCompleted : false
    }).select('rollNo -_id'); // Only select rollNo, exclude _id

    // Extract roll numbers from the result
    const rollNumbers = enrolledStudents.map(student => student.rollNo);

    res.status(200).json({ rollNumbers });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const modifyAttendanceRecord = async (req, res) => {
  // Extract data from request body
  const { courseCode, date, isPresent, isApproved } = req.body;
  const rollNo = req.headers['rollno'];
  try {
    // Validate required fields
    if (!courseCode || !rollNo || !date) {
      return res.status(400).json({
        error: 'Course code, roll number, and date are required'
      });
    }
    const inputDate = new Date(date);

    // Find the existing attendance record
    const startOfDay = new Date(inputDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(inputDate.setHours(23, 59, 59, 999));
    
    const attendanceRecord = await Attendance.findOne({
      courseCode,
      rollNo,
      date: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    });
    if (!attendanceRecord) {
      return res.status(404).json({
        error: 'Attendance record not found for given course, roll number, and date'
      });
    }

    // Update fields
    if (isPresent !== undefined) attendanceRecord.isPresent = isPresent;
    if (isApproved !== undefined) attendanceRecord.isApproved = isApproved;
    attendanceRecord.updatedAt = new Date();

    // Save changes
    await attendanceRecord.save();

    res.status(200).json({
      success: true,
      message: 'Attendance record updated successfully',
      data: attendanceRecord
    });
  } catch (error) {
    console.error('Error updating attendance record:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
};


//admin side

export const getAllCourses = async (req, res) => {
  try {
      // Fetch only courseCode and courseName fields from all courses
      const courses = await Course.find({}, 'courseCode courseName');
      
      // Return the courses array
      res.status(200).json({
          success: true,
          data: courses
      });
  } catch (error) {
      console.error("Error fetching courses:", error);
      res.status(500).json({
          success: false,
          message: "Failed to fetch courses",
          error: error.message
      });
  }
};

export const getApprovalRequests = async (req, res) => {
  try {
    // Find all attendance records where isApproved is false
    const pendingApprovals = await Attendance.find({ isApproved: false })
      .sort({ createdAt: -1 });

    // Format the response to match your desired structure
    const formattedApprovals = pendingApprovals.map(record => ({
      studentId: record.rollNo, // Directly use the string value
      courseId: record.courseCode, // Directly use the string value
      date: record.date.toISOString().split('T')[0], // Format as YYYY-MM-DD
      present: record.isPresent,
      pendingApproval: !record.isApproved
    }));

    res.status(200).json(formattedApprovals);

  } catch (error) {
    console.error('Error fetching approval requests:', error);
    res.status(500).json({
      error: 'Failed to fetch pending approval requests',
      details: error.message
    });
  }
};

export const approveAttendance = async (req, res) => {
  try {
    const { courseCode, rollNo, date } = req.body;

    if (!courseCode || !rollNo || !date) {
      return res.status(400).json({
        success: false,
        message: "courseCode, rollNo, and date are required"
      });
    }

    // Parse the date and extract YYYY-MM-DD part
    const targetDate = new Date(date);
    const startOfDay = new Date(
      targetDate.getFullYear(),
      targetDate.getMonth(),
      targetDate.getDate()
    );
    
    const endOfDay = new Date(
      targetDate.getFullYear(),
      targetDate.getMonth(),
      targetDate.getDate(),
      23, 59, 59, 999
    );

    // Find the attendance record matching the criteria
    const attendanceRecord = await Attendance.findOneAndUpdate(
      {
        courseCode: courseCode,
        rollNo: rollNo,
        date: { $gte: startOfDay, $lte: endOfDay }
      },
      {
        isApproved: true,
        updatedAt: Date.now()
      },
      { new: true }
    );

    if (!attendanceRecord) {
      return res.status(404).json({
        success: false,
        message: "Attendance record not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Attendance record approved successfully",
      data: attendanceRecord
    });
  } catch (error) {
    console.error("Error approving attendance:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

export const getAllStudents = async (req, res) => {
  try {
    // Query the database to get only the rollNo field from all student documents
    const students = await Student.find({}, 'rollNo');
    
    // Extract only the roll numbers from the returned documents
    const rollNumbers = students.map(student => student.rollNo);
    
    // Return success response with roll numbers
    return res.status(200).json({
      success: true,
      count: rollNumbers.length,
      data: rollNumbers
    });
  } catch (error) {
    console.error('Error fetching student roll numbers:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};