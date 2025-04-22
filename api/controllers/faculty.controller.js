import { Course, FacultyCourse} from '../models/course.model.js';
import { Faculty } from '../models/faculty.model.js';
import { Student } from '../models/student.model.js';
import { StudentCourse } from '../models/course.model.js';
import { User } from '../models/user.model.js';
import { CourseApprovalRequest } from "../models/course.model.js";
import { GlobalFeedbackConfig } from '../models/feedback.model.js';
import { Attendance } from '../models/attendance.model.js';
import { Assignment }  from '../models/assignment.model.js';

// Get basic faculty info
export const getFaculty = async (req, res) => {
    try {
        const facultyId = req.params.id;
        const user = await Faculty.findOne({ userId: facultyId })
            .populate('userId');

        if (!user) {
            return res.status(404).json({ message: 'Faculty not found' });
        }
       
        res.status(200).json(user);
        // console.log("Faculty details fetched successfully", user);
    } catch (error) {
        console.error('Error fetching faculty details:', error);
        res.status(500).json({ message: 'Error fetching faculty details' });
    }
};
 
  // Get faculty by IDs
export const getFacultyByIds = async (req, res) => {
  try {
    const facultyIds = req.query.ids.split(',');
   
    // Find faculty members by IDs
    const facultyMembers = await Faculty.find({ facultyId: { $in: facultyIds } });
   
    if (!facultyMembers || facultyMembers.length === 0) {
      return res.status(404).json({ success: false, message: 'No faculty members found' });
    }
   
    return res.status(200).json(facultyMembers);
  } catch (error) {
    console.error('Error fetching faculty members:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch faculty members',
      error: error.message
    });
  }
};

export const getFacultyCourses = async (req, res) => {
try {

    // console.log("Fetching faculty courses for user ID:", req.params.id);
    const { id } = req.params;

    // Check if the faculty exists
    const faculty = await Faculty.findOne({ userId: id });
    // console.log("Faculty found:", faculty);
    if (!faculty) {
        return res.status(404).json({ message: 'Faculty not found' });
    }
   
    // Get the faculty courses with details
    const facultyCourses = await FacultyCourse.find({ facultyId: faculty.userId, status: 'Ongoing' })
    // console.log("Faculty courses:", facultyCourses);
    // Get current semester status
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
   
    // // Determine current session based on month
    let currentSession;
    if (currentMonth >= 0 && currentMonth <= 4) {
        currentSession = 'Winter Semester';
    } else if (currentMonth >= 5 && currentMonth <= 7) {
        currentSession = 'Summer Course';
    } else {
        currentSession = 'Spring Semester';
    }
   
    // Get all active courses for the current session
    // const activeCourses = facultyCourses.filter(course =>
    //     course.year === currentYear &&
    //     course.session === currentSession &&
    //     course.status === 'Ongoing'
    // );

    const activeCourses = facultyCourses.filter(course => course.status === 'Ongoing');
    // console.log("Active courses:", activeCourses);
    // console.log("Active courses:", activeCourses);
    // Get course details for each active course
    const coursesWithDetails = await Promise.all(
        activeCourses.map(async (course) => {
        const courseDetails = await Course.findOne({ courseCode: course.courseCode });
       
        if (!courseDetails) {
            return {
            id: course.courseCode,
            name: course.courseCode, // Fallback if details not found
            department: "",
            credits: 0,
            assignments: 0,
            attendance: 0,
            announcements: 0,
            };
        }
       
        // Get student count (dummy data for now)
        // const studentCount = Math.floor(Math.random() * 60) + 20; // Random between 20-80
        const studentCount = courseDetails.students ? courseDetails.students.length : 0;
        // Get assignment count
        const assignmentCount = Math.floor(Math.random() * 5) + 1; // Random between 1-5
       
        // Get average attendance
        // First, get all students who have not completed this course
        const activeStudents = await StudentCourse.find({
          courseId: course.courseCode,
          isCompleted: false
        }).select('rollNo');
       
        // Extract roll numbers of active students
        const activeStudentRolls = activeStudents.map(student => student.rollNo);
       
        // If no active students found
        // if (!activeStudentRolls.length) {
        //   return {
        //     ...course.toObject(),
        //     attendancePercentage: 0,
        //     totalStudents: 0
        //   };
        // }
       
        // Get all attendance records for this course for active students only
        const attendanceRecords = await Attendance.find({
          courseCode: course.courseCode,
          rollNo: { $in: activeStudentRolls }
        });
       
        // If no attendance records found for active students
        // if (!attendanceRecords.length) {
        //   return {
        //     ...course.toObject(),
        //     attendancePercentage: 0,
        //     totalStudents: activeStudentRolls.length
        //   };
        // }
       
        // Get unique student roll numbers from attendance records
        const uniqueStudents = [...new Set(attendanceRecords.map(record => record.rollNo))];
        const totalStudents = uniqueStudents.length;
       
        // Count total present attendance
        const totalPresent = attendanceRecords.filter(record => record.isPresent && record.isApproved).length;
       
        // Total possible attendance (total approved records)
        const totalAttendance = attendanceRecords.filter(record => record.isApproved).length;
       
        // Calculate percentage
        const attendancePercentage = totalAttendance > 0
          ? ((totalPresent / totalAttendance) * 100).toFixed(2)
          : 0;
        const avgAttendance = attendancePercentage;


        // Count assignments for this course from Assignment schema
          // Count documents matching the course code
          const assignmentCounter = await Assignment.countDocuments({ courseCode: courseDetails.courseCode });
       
        return {
            id: courseDetails.courseCode,
            name: courseDetails.courseName,
            department: courseDetails.department,
            credits: courseDetails.credits,
            students: studentCount,
            assignments: assignmentCounter,
            avgAttendance: avgAttendance,
            announcements: courseDetails.announcements ? courseDetails.announcements.length : 0,
            year: course.year,
            session: course.session,
        };
        })
    );
   
    // Get feedback availability status (could be from settings or config)
    // const feedbackOpen = currentMonth >= 3 && currentMonth <= 5; // Open during April-June
    const globalConfig = await GlobalFeedbackConfig.getConfig();
    const feedbackOpen = globalConfig.isActive;
   
    return res.status(200).json({
        courses: coursesWithDetails,
        feedbackOpen: feedbackOpen
    });
   
    } catch (error) {
    console.error('Error fetching faculty courses:', error);
    return res.status(500).json({ message: 'Error fetching faculty courses', error: error.message });
    }
}


export const getCourseStudents = async (req, res) => {
  try {
    const { courseId } = req.params;
    // console.log("Fetching students for course ID:", courseId);

    // Find the course
    const course = await Course.findOne({ courseCode: courseId });
    // console.log("Course found:", course);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Find all student registrations for this course
    // const students = await StudentCourse.find({
    //   courseId: courseId
    // });

    const students = course.students || [];
    // console.log("Student registrations found:", students);
    if (!students || students.length === 0) {
      return res.status(200).json({
        success: true,
        course: {
          courseCode: course.courseCode,
          courseName: course.courseName,
          department: course.department,
          credits: course.credits
        },
        students: []
      });
    }

    // Get roll numbers for all registered students
    // Find student details
    const studentDetails = await Student.find({
      // rollNo: { $in: studentRollNumbers }
      userId : { $in: students }
    });
    // console.log("Student details found:", studentDetails);
    // Get user IDs for all students to retrieve names and emails
    // const userIds = studentDetails.map(student => student.userId);
   
    // Find user information
    const userInfo = await User.find({
      _id: { $in: students }
    }, 'name email profilePicture');

    // Create a lookup map for user info
    const userLookup = {};
    userInfo.forEach(user => {
      userLookup[user._id.toString()] = {
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture
      };
    });

    // console.log("User information found:", userInfo);

    // Create a lookup map for student details
    const studentLookup = {};
    studentDetails.forEach(student => {
      studentLookup[student.userId.toString()] = {
        userId: student.userId.toString(),
        rollNo: student.rollNo,
        department: student.department,
        semester: student.semester,
        batch: student.batch,
        program: student.program,
        status: student.status,
        hostel: student.hostel,
        roomNo: student.roomNo
      };
    });

    // console.log("Student details lookup:", studentLookup);
    // Combine all data
    const studentsWithDetails = students.map(registration => {
      // console.log("Processing registration:", registration);
      const studentInfo = studentLookup[registration] || {};
      // console.log("Student info found:", studentInfo);  /
      const user = userLookup[studentInfo.userId] || {};
     
      // Generate random attendance data for demonstration (in a real app, this would come from your database)
      const attendance = Math.floor(Math.random() * 30) + 70; // Random attendance between 70-100%
     
      return {
        rollNo: studentInfo.rollNo,
        name: user.name || 'Unknown',
        email: user.email || 'No email',
        profilePicture: user.profilePicture || null,
        department: studentInfo.department || 'Unknown',
        semester: studentInfo.semester || 0,
        batch: studentInfo.batch || 'Unknown',
        program: studentInfo.program || 'Unknown',
        status: studentInfo.status || 'active',
        hostel: studentInfo.hostel || 'Unknown',
        roomNo: studentInfo.roomNo || 'Unknown',
        registrationStatus: registration.creditOrAudit || 'Credit',
        grade: registration.grade || null,
        attendance: attendance
      };
    });

    // Return course info and student details
    return res.status(200).json({
      success: true,
      course: {
        courseCode: course.courseCode,
        courseName: course.courseName,
        department: course.department,
        credits: course.credits
      },
      students: studentsWithDetails
    });
   
  } catch (error) {
    console.error('Error fetching course students:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch course students',
      error: error.message
    });
  }
};  

export const getPendingRequestsFaculty = async (req, res) => {
  try {
    const { id } = req.params;
    const { courseCode } = req.query; // Get courseCode from query parameters
    
    // console.log("Fetching pending requests for faculty ID:", id);
    if (courseCode) {
      //console.log("Filtering by course code:", courseCode);
    }
    
    // Check if the faculty exists
    const faculty = await Faculty.findOne({ userId: id });
    if(!faculty) {
      //console.log("Faculty not found");
      return res.status(404).json({ message: "Faculty not found" });
    }
    
    // Get pending requests for faculty's courses
    const facultyCourses = Array.isArray(faculty.courses) ? faculty.courses : [];
    
    // Build the query
    let query = {
      status: 'Pending',
      courseCode: { $in: facultyCourses.map(c => c.courseCode) }
    };
    
    // If courseCode is provided, filter by that specific course
    if (courseCode) {
      // Make sure the faculty teaches this course
      if (!facultyCourses.some(c => c.courseCode === courseCode)) {
        return res.status(403).json({ message: "You don't teach this course" });
      }
      
      query.courseCode = courseCode;
    }
    
    const requests = await CourseApprovalRequest.find(query);
   
    // Fetch student details for each request
    const studentIds = requests.map(request => request.studentId);
    const students = await Student.find({ userId: { $in: studentIds } });

    // Transform data for frontend
    const formattedRequests = requests.map(request => {
      const student = students.find(student => student.userId.toString() === request.studentId.toString());
      return {
        id: request._id,
        rollNo: student ? student.rollNo : 'Unknown',
        program: student ? student.program : 'Unknown',
        semester: student ? student.semester : 'Unknown',
        courseCode: request.courseCode,
        courseType: request.courseType,
        createdAt: request.createdAt
      };
    });

    res.status(200).json(formattedRequests);
  } catch (error) {
    console.error("Error fetching pending requests:", error);
    res.status(500).json({ message: "Failed to fetch requests" });
  }
};


export const handleRequestApprovalFaculty = async (req, res) => {
  try {
    // console.log("I am here mf");
    const { requestId } = req.params;
    const { status } = req.body;

    // Validate status
    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    // const updatedRequest = await CourseApprovalRequest.findById(requestId);
    // console.log("Updated request found:", updatedRequest);
    // Update request status and get populated student data
    const updatedRequest = await CourseApprovalRequest.findByIdAndUpdate(
      requestId,
      { status },
      { new: true }
    );
   
    if (!updatedRequest) {
      return res.status(404).json({ message: "Registration request not found" });
    }
   
    if (status === 'Approved') {
      const student = updatedRequest.studentId;
      // console.log("Student ID:", student);
      const courseCode = updatedRequest.courseCode;

      // console.log(student);
      const mystudent = await Student.findOne({userId:student._id});
      // console.log("Student found:", mystudent);
      // Check if the course is already registered
      const existingRegistration = await StudentCourse.findOne({
        rollNo: mystudent.rollNo,
        courseId: courseCode,
        status: 'Approved'
      });

      if(existingRegistration) {
        // alert("You have already registered for this course.");
        return res.status(400).json({ message: "Course already registered" });
      }else{
        // alert("You have not yet registered for this course. Do you want register?");
      }
      // 1. Create StudentCourse entry
      const newStudentCourse = new StudentCourse({
        rollNo: mystudent.rollNo,
        courseId: courseCode,
        creditOrAudit: updatedRequest.courseType === 'Audit' ? 'Audit' : 'Credit',
        semester: String(mystudent.semester),
        status: 'Approved',
        isCompleted: false,
      });
      await newStudentCourse.save();

      // console.log("StudentCourse entry created:", newStudentCourse);

      // 2. Update Course's student list with ObjectId reference
      // Yahaan ki wajah se tere students list mein kuch kuch chizein aa nahi rahi hai
      // check kar le
      // console.log("Student ID:", student);
      await Course.findOneAndUpdate(
        { courseCode },
        { $addToSet: { students: student } },
        { new: true }
      );
    }

    // console.log("ALLDONE");
    res.status(200).json({
      success: true,
      message: `Request ${status.toLowerCase()} successfully`,
      updatedRequest
    });

  } catch (error) {
    console.error("Approval processing error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
};


// Add this function to get faculty courses for dashboard
export const getFacultyDashboardCourses = async (req, res) => {
  try {
    // console.log("Fetching dashboard courses for faculty ID:", req.params);
    const userId  = req.params.id;
    const faculty = await Faculty.findOne({userId})

    if (!faculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }

    const usercourses = FacultyCourse.find({ facultyId: faculty.userId })

    const facultyCourses = await FacultyCourse.find({ facultyId: faculty.userId, status: 'Ongoing' });
    const formattedCourses = facultyCourses.map(course => ({
      code: course.courseCode,
      // name: course.courseCode // Assuming course name is not stored in FacultyCourse, you may need to populate it if required
    }));

    res.status(200).json(formattedCourses);
  } catch (error) {
    console.error('Error fetching faculty courses:', error);
    res.status(500).json({ message: 'Error fetching courses' });
  }
};