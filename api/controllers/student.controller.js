import { Student } from '../models/student.model.js';
import { Course, StudentCourse, FacultyCourse,ProgramCourseMapping,CourseApprovalRequest } from '../models/course.model.js';
import { ApplicationDocument, Bonafide, Passport } from '../models/documents.models.js';
import { Faculty } from '../models/faculty.model.js';
import { CourseDropRequest } from '../models/courseDropRequest.model.js';
import { User } from '../models/user.model.js';
import { FeeBreakdown, FeeDetails } from "../models/fees.model.js";
import mongoose from "mongoose";
import { Feedback , GlobalFeedbackConfig } from '../models/feedback.model.js';
import { Attendance } from '../models/attendance.model.js';
import { Assignment } from '../models/assignment.model.js';

// Get basic student info
export const getStudent = async (req, res) => {
  try {
    const studentId = req.params.id;
    // console.log(studentId);
    // console.log(studentId);
    const user = await Student.findOne({ userId: studentId }).populate(
      "userId"
    );

    if (!user) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(user);
    //console.log("Student details fetched successfully", user);
  } catch (error) {
    console.error("Error fetching student details:", error);
    res.status(500).json({ message: "Error fetching student details" });
  }
};

//get completed courses for display on the completed courses page
// export const getCompletedCourses = async (req, res) => {
//     try {
//       console.log("Fetching completed courses for student ID:", req.params.id);
//       const user = await Student.findOne({ userId: req.params.id })
//         .populate('userId');

//       if (!user) {
//         return res.status(404).json({ message: 'Student not found' });
//       }

//       console.log("User: ", user);
//       const courses = await StudentCourse.find({
//         rollNo: user.rollNo,
//         isCompleted: true
//       })
//       .populate({
//         path: 'courseId',
//         model: 'Course',
//         select: 'courseCode courseName credits department'
//       })
//       .lean();

//       console.log("Completed courses fetched:", courses);

//       const formatted = courses.map(course => ({
//         courseCode: course.courseId.courseCode,
//         courseName: course.courseId.courseName,
//         credits: course.courseId.credits,
//         department: course.courseId.department,
//         semester: course.semester,
//         grade: course.grade,
//         creditOrAudit: course.creditOrAudit,
//         completedAt: course.updatedAt
//       }));

//       res.status(200).json({ courses: formatted });
//     } catch (error) {
//       console.error("Error fetching completed courses:", error);
//       res.status(500).json({ message: error.message });
//     }
//   };

export const getCompletedCourses = async (req, res) => {
  try {
    //console.log("Fetching completed courses for student ID:", req.params.id);
    const user = await Student.findOne({ userId: req.params.id }).populate(
      "userId"
    );

    if (!user) {
      return res.status(404).json({ message: "Student not found" });
    }

    //console.log("User: ", user);

    // First, get all completed student courses
    const studentCourses = await StudentCourse.find({
      rollNo: user.rollNo,
      isCompleted: true,
    }).lean();

    // Get the courseIds to fetch course details
    const courseIds = studentCourses.map((sc) => sc.courseId);

    // Fetch all relevant courses
    const courseDetails = await Course.find({
      courseCode: { $in: courseIds },
    }).lean();

    // Create a map for quick lookup
    const courseMap = {};
    courseDetails.forEach((course) => {
      courseMap[course.courseCode] = course;
    });

    // Now combine the data
    const formatted = studentCourses.map((sc) => {
      const course = courseMap[sc.courseId] || {};
      return {
        courseCode: course.courseCode || sc.courseId,
        courseName: course.courseName || "Unknown Course",
        credits: course.credits || 0,
        department: course.department || "Unknown",
        semester: sc.semester,
        grade: sc.grade,
        creditOrAudit: sc.creditOrAudit,
        completedAt: sc.updatedAt,
      };
    });

    //console.log("Formatted courses:", formatted);
    res.status(200).json({ courses: formatted });
  } catch (error) {
    console.error("Error fetching completed courses:", error);
    res.status(500).json({ message: error.message });
  }
};

// Add this new function for student courses
export const getStudentCourses = async (req, res) => {
  try {
    const studentId = req.params.id;
    //console.log("Fetching courses for student ID:", studentId);

    // First get the student record to get the roll number
    const student = await Student.findOne({ userId: studentId });
    //console.log("fjshkjfhkjsfkjsdkjf", student);

    if (!student) {
        //console.log("Student not found for ID:", studentId);
        return res.status(404).json({ message: "Student not found" });
        }

        //console.log("Found student with roll number:", student.rollNo);
 
        // Get current academic session
        const now = new Date();
        const year = now.getFullYear();
        let session;
       
        if (now.getMonth() >= 0 && now.getMonth() <= 4) {
            session = 'Spring Semester';
        } else if (now.getMonth() >= 5 && now.getMonth() <= 7) {
            session = 'Summer Course';
        } else {
            session = 'Winter Semester';
        }
       
        const semester = `${session} ${year}`;
        // console.log("Current academic session:", semester);
        // console.log(student.rollNo);
       
        // Find approved courses for this student
        const studentCourses = await StudentCourse.find({rollNo: student.rollNo, status: 'Approved', isCompleted: false})
        // console.log(`Found ${studentCourses.length} enrolled courses for student`);
       
        if (!studentCourses || studentCourses.length === 0) {
            return res.status(200).json({
                courses: [],
                feedbackOpen: false
            });
        }

        // // Get global feedback status
        const globalConfig = await GlobalFeedbackConfig.getConfig();
        const globalFeedbackActive = globalConfig.isActive;
        //console.log("Global feedback active status:", globalFeedbackActive);

        // console.log(`Courses enrolled by student:`, studentCourses);
       
        // Get course details and faculty information
        const courses = await Promise.all(
            studentCourses.map(async (sc) => {
                const course = await Course.findOne({ courseCode: sc.courseId });
                // console.log("Course details fetched:", course);
                if (!course) {
                    //console.log(`Course not found for ID: ${sc.courseId}`);
                    return null;
                }
                // console.log("Course details:", sc);
                const facultyCourse = await FacultyCourse.findOne({
                    courseCode: sc.courseId
                });
                //console.log("Faculty course details fetched:", facultyCourse);
                // .populate('facultyId', 'name');
                const facultyUser = await User.findById(facultyCourse.facultyId);
                                // Added feedback active logic here
                let feedbackOpen = false;
               
                if (globalFeedbackActive && facultyCourse && facultyCourse.facultyId) {
                    // Get the faculty document to use the correct ObjectId
                    const faculty = await Faculty.findOne({userId: facultyCourse.facultyId});
                    //console.log("Facccc", faculty);
                    //console.log("Coursss", course);
                    //console.log("Studd", student);
                    if (faculty) {
                        const feedbackExists = await Feedback.exists({
                            student: student._id.toString(),
                            course: course._id.toString(),
                            faculty: faculty._id.toString()
                        });
                        //console.log("Feedback exists:", feedbackExists);
                        // Set feedbackOpen to true if feedback doesn't exist
                        feedbackOpen = !feedbackExists;
                        //console.log("already submitted",feedbackExists);
                    }
                }

                const totalDays = await Attendance.countDocuments({
                  rollNo: student.rollNo ,
                  courseCode: sc.courseId,
                  isApproved: true
                });

                const presentDays = await Attendance.countDocuments({
                  rollNo: student.rollNo ,
                  courseCode: sc.courseId,
                  isPresent: true,
                  isApproved: true
                });

                const percentage = totalDays > 0 ? ((presentDays / totalDays) * 100 ).toFixed(2): 0;

                // Get the count of assignments for this course
                const assignmentCounter = await Assignment.countDocuments({ courseCode: course.courseCode });

                // Use placeholder values for some fields
                return {
                    id: course.courseCode,
                    name: course.courseName,
                    instructor: facultyUser.name,
                    credits: course.credits,
                    assignments: assignmentCounter, // Placeholder
                    announcements: course.announcements.length,
                    attendance: percentage,
                    feedbackOpen: feedbackOpen,
                    slot: course.slot,
                };
            })
        );
        //console.log("Hehehhe", courses);
        // console.log(`Fetched course details for ${courses.length} courses`);
        // console.log(courses);
        // Filter out null value    s (courses that weren't found)
        const validCourses = courses.filter(course => course !== null);
        //console.log(`Returning ${validCourses.length} valid courses`);
       
        // Determine if feedback is available (implement your logic)
        const isFeedbackAvailable = false; // Placeholder
       
        res.status(200).json({
            courses: validCourses
        });
       
    } catch (error) {
        //console.log("Error fetching student courses:", error);
        res.status(500).json({ message: "Failed to fetch courses" });
    }
};

export const getCourseAnnouncements = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Find course with announcements
    const course = await Course.findOne({ courseCode: courseId });

    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    // If no announcements or empty array, return course with empty announcements
    if (!course.announcements || course.announcements.length === 0) {
      return res.status(200).json(course);
    }

    // Get all faculty IDs from announcements
    const facultyIds = [
      ...new Set(
        course.announcements.map((announcement) => announcement.postedBy)
      ),
    ];
    
    //console.log("Faculty IDs found:", facultyIds);

    // Find all faculty members who posted announcements
    const facultyMembers = await Faculty.find({
      userId: { $in: facultyIds },
    });

    //console.log("Faculty members found1:", facultyMembers);
    
    const facultyUsers = await User.find({
      _id: { $in: facultyMembers.map((faculty) => faculty.userId) },
    });

    //console.log("Faculty members found:", facultyUsers);  

    // Create a lookup object for faculty
    const facultyLookup = {};
    facultyUsers.forEach((faculty) => {
      facultyLookup[faculty._id] = {
        name: faculty.name,
        email: faculty.email,
        // department: faculty.department,
        // designation: faculty.designation,
      };
    });

    //console.log("Faculty lookup object:", facultyLookup);

    // Add faculty details to each announcement
    const announcementsWithFaculty = course.announcements.map(
      (announcement) => {
        const faculty = facultyLookup[announcement.postedBy] || null;

        return {
          ...announcement.toObject(),
          faculty: faculty,
        };
      }
    );
    //console.log("Announcements with faculty details:", announcementsWithFaculty);
    // Sort announcements by date (most recent first)
    announcementsWithFaculty.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    // Return course with enhanced announcements
    const result = {
      ...course.toObject(),
      announcements: announcementsWithFaculty,
    };

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching course announcements:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch course announcements",
      error: error.message,
    });
  }
};

// Get faculty by IDs
export const getFacultyByIds = async (req, res) => {
  try {
    const facultyIds = req.query.ids.split(",");

    // Find faculty members by IDs
    const facultyMembers = await Faculty.find({
      facultyId: { $in: facultyIds },
    });

    if (!facultyMembers || facultyMembers.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No faculty members found" });
    }

    return res.status(200).json(facultyMembers);
  } catch (error) {
    console.error("Error fetching faculty members:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch faculty members",
      error: error.message,
    });
  }
};

// Drop a course for a student
export const dropCourse = async (req, res, next) => {
  try {
    //console.log("I am here in drop course");
    const { studentId, courseId } = req.params;

    // Find the student
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Check if the student is enrolled in the course
    const courseIndex = student.courses.findIndex(
      (course) => course.toString() === courseId
    );
    if (courseIndex === -1) {
      return res
        .status(404)
        .json({ message: "Course not found in student's enrolled courses" });
    }

    // Remove the course from the student's courses array
    student.courses.splice(courseIndex, 1);
    await student.save();

    // Find the course and update its enrolled students
    const course = await Course.findById(courseId);
    //console.log("Course found:", course);
    if (course) {
      const studentIndex = course.students.findIndex(
        (id) => id.toString() === studentId
      );
      if (studentIndex !== -1) {
        course.students.splice(studentIndex, 1);
        await course.save();
      }
    }

    res.status(200).json({ message: "Course dropped successfully" });
  } catch (error) {
    next(error);
  }
};

export const createCourseDropRequest = async (req, res) => {
  try {
    const studentId = req.params.id;
    const { courseId } = req.body;

    // Find the student to get the roll number
    const student = await Student.findOne({ userId: studentId });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Check if the student is enrolled in the course
    const studentCourse = await StudentCourse.findOne({
      rollNo: student.rollNo,
      courseId: courseId,
      status: "Approved",
    });

    if (!studentCourse) {
      return res
        .status(404)
        .json({ message: "Student is not enrolled in this course" });
    }

    // Check if there's already a pending drop request for this course
    const existingRequest = await CourseDropRequest.findOne({
      rollNo: student.rollNo,
      courseId: courseId,
      status: "Pending",
    });

    if (existingRequest) {
      return res
        .status(400)
        .json({ message: "A drop request for this course is already pending" });
    }

    // Get course details
    const course = await Course.findOne({ courseCode: courseId });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Get current academic session
    const now = new Date();
    const year = now.getFullYear();
    let session;

    if (now.getMonth() >= 0 && now.getMonth() <= 4) {
      session = "Spring Semester";
    } else if (now.getMonth() >= 5 && now.getMonth() <= 7) {
      session = "Summer Course";
    } else {
      session = "Winter Semester";
    }

    const semester = `${session} ${year}`;

    // Create a new drop request
    const dropRequest = new CourseDropRequest({
      studentId: studentId,
      rollNo: student.rollNo,
      courseId: courseId,
      courseName: course.courseName,
      semester: semester,
      status: "Pending",
    });

    await dropRequest.save();

    res.status(201).json({
      message: "Course drop request submitted successfully",
      requestId: dropRequest._id,
    });
  } catch (error) {
    console.error("Error creating course drop request:", error);
    res.status(500).json({ message: "Failed to submit course drop request" });
  }
};

// Get all course drop requests for a student
export const getStudentDropRequests = async (req, res) => {
  try {
    const studentId = req.params.id;

    // Find the student to get the roll number
    const student = await Student.findOne({ userId: studentId });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Get all drop requests for this student
    const dropRequests = await CourseDropRequest.find({
      rollNo: student.rollNo,
    }).sort({ createdAt: -1 });

    res.status(200).json(dropRequests);
  } catch (error) {
    console.error("Error fetching course drop requests:", error);
    res.status(500).json({ message: "Failed to fetch course drop requests" });
  }
};

// Cancel a pending course drop request
export const cancelDropRequest = async (req, res) => {
  try {
    const studentId = req.params.id;
    const requestId = req.params.requestId;

    // Find the student to get the roll number
    const student = await Student.findOne({ userId: studentId });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Find the drop request
    const dropRequest = await CourseDropRequest.findById(requestId);

    if (!dropRequest) {
      return res.status(404).json({ message: "Drop request not found" });
    }

    // Check if the request belongs to this student
    if (dropRequest.rollNo !== student.rollNo) {
      return res
        .status(403)
        .json({ message: "Unauthorized to cancel this request" });
    }

    // Check if the request is still pending
    if (dropRequest.status !== "Pending") {
      return res
        .status(400)
        .json({
          message: `Cannot cancel a request that is already ${dropRequest.status.toLowerCase()}`,
        });
    }

    // Delete the request
    await CourseDropRequest.findByIdAndDelete(requestId);

    res
      .status(200)
      .json({ message: "Course drop request cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling course drop request:", error);
    res.status(500).json({ message: "Failed to cancel course drop request" });
  }
};

// Get student details for bonafide
export const getStudentBonafideDetails = async (req, res) => {
  try {
    const studentId = req.params.id;

    const student = await Student.findOne({ userId: studentId }).populate(
      "userId",
      "name dateOfBirth"
    );

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const studentDetails = {
      name: student.userId.name,
      rollNo: student.rollNo,
      fatherName: student.fatherName,
      dateOfBirth: student.userId.dateOfBirth,
      program: student.program,
      department: student.department,
      hostel: student.hostel,
      roomNo: student.roomNo,
      semester: student.semester,
      batch: student.batch,
      enrolledYear: student.batch,
    };

    res.status(200).json(studentDetails);
  } catch (error) {
    console.error("Error fetching student bonafide details:", error);
    res.status(500).json({ message: "Error fetching student details" });
  }
};

// Create new bonafide application
export const createBonafideApplication = async (req, res) => {
  try {
    const studentId = req.params.id;
    const { currentSemester, certificateFor, otherReason } = req.body;

    // Find student
    const student = await Student.findOne({ userId: studentId });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Create application document
    const applicationDoc = new ApplicationDocument({
      studentId: student._id,
      documentType: "Bonafide",
      status: "Pending", // This matches the enum in ApplicationDocument model
    });
    await applicationDoc.save();

    // Create bonafide document
    const bonafide = new Bonafide({
      applicationId: applicationDoc._id,
      currentSemester,
      purpose: certificateFor,
      otherReason: certificateFor === "Other" ? otherReason : undefined,
    });
    await bonafide.save();

    res.status(201).json({
      message: "Bonafide application submitted successfully",
      applicationId: applicationDoc._id,
    });
  } catch (error) {
    console.error("Error creating bonafide application:", error);
    res.status(500).json({
      message: error.message || "Error submitting bonafide application",
    });
  }
};

// Get student's bonafide applications
export const getBonafideApplications = async (req, res) => {
  try {
    const studentId = req.params.id;

    const student = await Student.findOne({ userId: studentId });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const applications = await ApplicationDocument.find({
      studentId: student._id,
      documentType: "Bonafide",
    }).sort({ createdAt: -1 });

    const applicationDetails = await Promise.all(
      applications.map(async (app) => {
        const bonafide = await Bonafide.findOne({ applicationId: app._id });
        if (!bonafide) return null;

        return {
          applicationDate: app.createdAt,
          certificateFor:
            bonafide.purpose === "Other"
              ? bonafide.otherReason
              : bonafide.purpose,
          currentSemester: bonafide.currentSemester,
          remarks: app.approvalDetails?.remarks || "",
          documentStatus:
            app.status === "Pending"
              ? "Documents Under Review"
              : "Documents Verified",
          currentStatus: app.status, // Status is already in proper case from model
        };
      })
    );

    const validApplications = applicationDetails.filter((app) => app !== null);
    res.status(200).json(validApplications);
  } catch (error) {
    console.error("Error fetching bonafide applications:", error);
    res.status(500).json({ message: "Error fetching applications" });
  }
};

// Get student details for passport
export const getStudentPassportDetails = async (req, res) => {
  try {
    const studentId = req.params.id;

    const student = await Student.findOne({ userId: studentId }).populate(
      "userId",
      "name dateOfBirth email"
    );

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const studentDetails = {
      name: student.userId.name,
      rollNo: student.rollNo,
      department: student.department,
      programme: student.program,
      dateOfBirth: student.userId.dateOfBirth,
      email: student.userId.email,
      contactNumber: student.userId.contactNo || "",
      hostelName: student.hostel,
      roomNo: student.roomNo,
      fathersName: student.fatherName,
      mothersName: student.motherName,
    };
    // console.log('fetched student info for passport',studentDetails)
    res.status(200).json(studentDetails);
  } catch (error) {
    console.error("Error fetching student passport details:", error);
    res.status(500).json({ message: error.message });
  }
};

// Submit passport application
export const submitPassportApplication = async (req, res) => {
  try {
    const studentId = req.params.id;
    const {
      applicationType,
      placeOfBirth,
      semester,
      mode,
      tatkalReason,
      travelPlans,
      travelDetails,
      fromDate,
      toDate,
    } = req.body;

    const student = await Student.findOne({ userId: studentId });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Create application document with proper status case
    const applicationDoc = new ApplicationDocument({
      studentId: student._id,
      documentType: "Passport",
      status: "Pending", // This matches the enum in ApplicationDocument model
    });
    await applicationDoc.save();

    // Create passport document
    const passport = new Passport({
      applicationId: applicationDoc._id,
      applicationType,
      placeOfBirth,
      semester,
      mode,
      tatkalReason,
      travelPlans,
      travelDetails,
      fromDate: travelPlans === "yes" ? fromDate : undefined,
      toDate: travelPlans === "yes" ? toDate : undefined,
    });
    await passport.save();

    res.status(201).json({
      message: "Passport application submitted successfully",
      applicationId: applicationDoc._id,
    });
  } catch (error) {
    console.error("Error creating passport application:", error);
    res.status(500).json({
      message: error.message || "Error submitting passport application",
    });
  }
};

// Get passport applications history
export const getPassportApplications = async (req, res) => {
  try {
    const studentId = req.params.id;
    const student = await Student.findOne({ userId: studentId });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const applications = await ApplicationDocument.find({
      studentId: student._id,
      documentType: "Passport",
    })
      .sort({ createdAt: -1 })
      .lean();

    const passportApplications = await Promise.all(
      applications.map(async (app) => {
        const passportDoc = await Passport.findOne({ applicationId: app._id });
        return {
          applicationDate: new Date(app.createdAt).toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          applicationType: passportDoc.applicationType,
          mode: passportDoc.mode,
          remarks: app.approvalDetails?.remarks || "",
          otherDetails:
            passportDoc.mode === "tatkal"
              ? `Tatkal Application - ${passportDoc.tatkalReason}`
              : "Regular Application",
          documentStatus:
            app.status === "Pending"
              ? "Documents Under Review"
              : "Documents Verified",
          currentStatus: app.status, // Status is already in proper case from model
        };
      })
    );

    const validApplications = passportApplications.filter(
      (app) => app !== null
    );
    res.status(200).json(validApplications);
  } catch (error) {
    console.error("Error fetching passport applications:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update student profile
export const updateStudentProfile = async (req, res) => {
  try {
    const studentId = req.params.id;
    const updateData = req.body;

        // Update user data
        if (updateData.userData) {
            await User.findByIdAndUpdate(
                updateData.userData.userId,
                {
                    name: updateData.userData.name,
                    email: updateData.userData.email,
                    contactNo: updateData.userData.contact
                }
            );
        }
        // console.log(updateData.hostel);
    // Update user data
    if (updateData.userData) {
      await User.findByIdAndUpdate(updateData.userData.userId, {
        name: updateData.userData.name,
        email: updateData.userData.email,
        contactNo: updateData.userData.contact,
      });
    }

    // Update student data
    const student = await Student.findOneAndUpdate(
      { userId: studentId },
      {
        hostel: updateData.hostel,
        roomNo: updateData.roomNo,
        department: updateData.branch,
        program: updateData.program,
        semester: updateData.semester,
        updatedAt: new Date(),
      },
      { new: true }
    ).populate("userId");

    // console.log(studentId);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(student);
  } catch (error) {
    console.error("Error updating student profile:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get student fee details
export const getStudentFeeDetails = async (req, res) => {
  try {
    const studentId = req.params.id;

    // Find the student with populated user data
    const student = await Student.findOne({ userId: studentId }).populate(
      "userId",
      "name email contactNo"
    );

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Calculate next semester and its parity
    const currentSemester = parseInt(student.semester) || 1;
    const nextSemester = currentSemester + 1;

    // Check if student has reached maximum semesters based on program
    const maxSemesters = {
      BTech: 8,
      MTech: 4,
      PhD: 10,
      BDes: 8,
      MDes: 4,
    };

    const programMaxSemesters = maxSemesters[student.program] || 8; // Default to 8 if program not found

    // If next semester exceeds maximum, return with appropriate message
    if (nextSemester > programMaxSemesters) {
      return res.status(200).json({
        message: `You have completed the maximum number of semesters (${programMaxSemesters}) for your program.`,
        isMaxSemesterReached: true,
        student: {
          name: student.userId.name,
          rollNo: student.rollNo,
          program: student.program,
          department: student.department,
          semester: currentSemester,
          nextSemester: null,
          email: student.userId.email,
          contact: student.userId.contactNo,
        },
      });
    }

    const nextSemesterParity = nextSemester % 2; // 0 for even, 1 for odd

    // Get ACTIVE fee structure for student's program and next semester parity
    const feeBreakdown = await FeeBreakdown.findOne({
      program: student.program,
      semesterParity: nextSemesterParity,
      isActive: true, // Only get active fee structure
    });

    if (!feeBreakdown) {
      return res.status(404).json({
        message: "Fee payment is not yet enabled for the next semester",
        isActive: false,
      });
    }

    // Check if student has already paid
    const feeDetails = await FeeDetails.findOne({
      rollNo: student.rollNo,
      semester: nextSemester,
      "feeBreakdownData.program": student.program,
      "feeBreakdownData.semesterParity": nextSemesterParity,
    });

    const isPaid = !!feeDetails?.isPaid;

    // Format fee data for response
    const feeData = {
      student: {
        name: student.userId.name,
        rollNo: student.rollNo,
        program: student.program,
        department: student.department,
        semester: currentSemester,
        nextSemester: nextSemester,
        email: student.userId.email,
        contact: student.userId.contactNo,
      },
      feeBreakdown: {
        ...feeBreakdown.toObject(),
        totalAmount: calculateTotalAmount(feeBreakdown),
      },
      feeStatus: {
        isPaid,
        semester: nextSemester,
        feeDetailsId: feeDetails?._id,
        semesterParity: nextSemesterParity,
      },
    };

    res.status(200).json(feeData);
  } catch (error) {
    console.error("Error fetching student fee details:", error);
    res.status(500).json({ message: error.message });
  }
};

// Helper function to calculate total amount
const calculateTotalAmount = (feeBreakdown) => {
  return (
    feeBreakdown.tuitionFees +
    feeBreakdown.examinationFees +
    feeBreakdown.registrationFee +
    feeBreakdown.gymkhanaFee +
    feeBreakdown.medicalFee +
    feeBreakdown.hostelFund +
    feeBreakdown.hostelRent +
    feeBreakdown.elecAndWater +
    feeBreakdown.messAdvance +
    feeBreakdown.studentsBrotherhoodFund +
    feeBreakdown.acadFacilitiesFee +
    feeBreakdown.hostelMaintenance +
    feeBreakdown.studentsTravelAssistance
  );
};

// Helper function to get current academic year
const getCurrentAcademicYear = () => {
  const today = new Date();
  const month = today.getMonth();
  const year = today.getFullYear();
  return month < 6 ? `${year - 1}-${year}` : `${year}-${year + 1}`;
};

export const recordFeePayment = async (req, res) => {
  try {
    const studentId = req.params.id;
    const {
      semester,
      feeBreakdownId, // We'll use this to get the fee breakdown data
      transactionId,
      paymentDetails,
      academicYear,
      paidAt,
    } = req.body;

    // Debug logging
    //console.log("Request body:", req.body);

    // Find student and validate rollNo
    const student = await Student.findOne({ userId: studentId });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    if (!student.rollNo) {
      return res
        .status(400)
        .json({ message: "Student record missing roll number" });
    }

    // Get fee breakdown data to embed in fee details
    const feeBreakdown = await FeeBreakdown.findById(feeBreakdownId);
    if (!feeBreakdown) {
      return res.status(400).json({ message: "Invalid fee breakdown ID" });
    }

    // Calculate total amount
    const totalAmount = calculateTotalAmount(feeBreakdown);

    // Create the fee details document with embedded fee breakdown data
    const feeDetailsData = {
      rollNo: student.rollNo,
      semester: Number(semester),
      // Store complete fee breakdown data for historical record
      feeBreakdownData: {
        tuitionFees: feeBreakdown.tuitionFees,
        examinationFees: feeBreakdown.examinationFees,
        registrationFee: feeBreakdown.registrationFee,
        gymkhanaFee: feeBreakdown.gymkhanaFee,
        medicalFee: feeBreakdown.medicalFee,
        hostelFund: feeBreakdown.hostelFund,
        hostelRent: feeBreakdown.hostelRent,
        elecAndWater: feeBreakdown.elecAndWater,
        messAdvance: feeBreakdown.messAdvance,
        studentsBrotherhoodFund: feeBreakdown.studentsBrotherhoodFund,
        acadFacilitiesFee: feeBreakdown.acadFacilitiesFee,
        hostelMaintenance: feeBreakdown.hostelMaintenance,
        studentsTravelAssistance: feeBreakdown.studentsTravelAssistance,
        program: feeBreakdown.program,
        semesterParity: feeBreakdown.semesterParity,
        totalAmount: totalAmount,
      },
      isPaid: true,
      transactionId: transactionId,
      paymentDetails: {
        razorpayOrderId: paymentDetails.razorpayOrderId,
        razorpayPaymentId: paymentDetails.razorpayPaymentId,
        razorpaySignature: paymentDetails.razorpaySignature,
        amount: Number(paymentDetails.amount),
        currency: paymentDetails.currency,
      },
      academicYear: academicYear || getCurrentAcademicYear(),
      viewableDocumentId: new mongoose.Types.ObjectId(),
      paidAt: paidAt ? new Date(paidAt) : new Date(),
    };

    // Create and save the document
    const feeDetails = new FeeDetails(feeDetailsData);

    // Validate the document before saving
    const validationError = feeDetails.validateSync();
    if (validationError) {
      console.error("Validation error:", validationError);
      return res.status(400).json({
        message: "Validation failed",
        errors: Object.values(validationError.errors).map((err) => err.message),
      });
    }

    // Save the document
    const savedFeeDetails = await feeDetails.save();
    //console.log("Successfully saved FeeDetails:", savedFeeDetails);

    return res.status(200).json({
      message: "Fee payment recorded successfully",
      feeDetails: savedFeeDetails,
    });
  } catch (error) {
    console.error("Error recording fee payment:", error);
    return res.status(500).json({
      message: "Failed to record fee payment",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

// Update the fee payment history endpoint to use stored fee breakdown data only
export const getFeePaymentHistory = async (req, res) => {
  try {
    const studentId = req.params.id;
    //console.log("Fetching fee history for student ID:", studentId);

    // Find student
    const student = await Student.findOne({ userId: studentId }).populate(
      "userId",
      "name email contactNo"
    );

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    //console.log("Found student for fee history:", {
      rollNo: student.rollNo,
      name: student.userId?.name,
      program: student.program,
    });

    // Get all fee payments for this student
    const feePayments = await FeeDetails.find({
      rollNo: student.rollNo,
      isPaid: true, // Only get payments that are marked as paid
    }).sort({ semester: 1 });

    //console.log(
      `Found ${feePayments.length} fee payments for student ${student.rollNo}`
    );

    // Transform payment data for the response, using only stored feeBreakdownData
    const payments = feePayments.map((payment) => {
      // Ensure all fee breakdown numeric values are properly converted to numbers
      const feeBreakdown = payment.feeBreakdownData
        ? {
            tuitionFees: Number(payment.feeBreakdownData.tuitionFees),
            examinationFees: Number(payment.feeBreakdownData.examinationFees),
            registrationFee: Number(payment.feeBreakdownData.registrationFee),
            gymkhanaFee: Number(payment.feeBreakdownData.gymkhanaFee),
            medicalFee: Number(payment.feeBreakdownData.medicalFee),
            hostelFund: Number(payment.feeBreakdownData.hostelFund),
            hostelRent: Number(payment.feeBreakdownData.hostelRent),
            elecAndWater: Number(payment.feeBreakdownData.elecAndWater),
            messAdvance: Number(payment.feeBreakdownData.messAdvance),
            studentsBrotherhoodFund: Number(
              payment.feeBreakdownData.studentsBrotherhoodFund
            ),
            acadFacilitiesFee: Number(
              payment.feeBreakdownData.acadFacilitiesFee
            ),
            hostelMaintenance: Number(
              payment.feeBreakdownData.hostelMaintenance
            ),
            studentsTravelAssistance: Number(
              payment.feeBreakdownData.studentsTravelAssistance
            ),
            program: payment.feeBreakdownData.program,
            semesterParity: Number(payment.feeBreakdownData.semesterParity),
            totalAmount: Number(payment.feeBreakdownData.totalAmount),
          }
        : null;

      return {
        semester: payment.semester,
        academicYear: payment.academicYear,
        transactionId: payment.transactionId,
        paidAt: payment.paidAt,
        viewableDocumentId: payment.viewableDocumentId,
        // Use the embedded fee breakdown data
        feeBreakdown,
        isPaid: payment.isPaid,
        paymentDetails: payment.paymentDetails,
      };
    });

    res.status(200).json({
      student: {
        name: student.userId?.name || "Unknown",
        rollNo: student.rollNo,
        program: student.program,
        department: student.department,
        email: student.userId?.email,
        contact: student.userId?.contactNo,
      },
      payments,
    });
  } catch (error) {
    console.error("Error fetching fee payment history:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getAvailableCourses = async (req, res) => {
  try {
    //console.log("fetching available courses for student ID:", req.params.id);
    const { id } = req.params;

    //console.log("1", id);
    // Fetch student details
    const student = await Student.findOne({ userId: id });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // console.log("fjdshfkjhdskufhdskghfkdjgfkjgfjkgjhfgjhewrfhk");
    // console.log("2", student.program);
    // console.log("2", student.department);
    // console.log("2", student.semester);

    // Retrieve courses for the student's program and semester
    const courses = await ProgramCourseMapping.find({
      program: student.program,
      department: student.department,
      semester: student.semester,
    });

    //console.log("3", courses);

    res.status(200).json(courses);
  } catch (error) {
    console.error("Error fetching available courses:", error);
    res.status(500).json({ message: "Failed to fetch available courses" });
  }
};

// Submit course approval request
export const submitCourseApprovalRequest = async (req, res) => {
  try {
    const { id } = req.params; // Student ID
    const { courseCode, courseType } = req.body;

    // Check if a similar request already exists
    const existingRequest = await CourseApprovalRequest.findOne({
      studentId: id,
      courseCode,
      status: "Pending",
    });

    if (existingRequest) {
      return res
        .status(200)
        .json({ message: "A request for this course is already pending." });
    }

    // Fetch student details
    const student = await Student.findOne({ userId: id }).lean();
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    // Create a new approval request
    const approvalRequest = new CourseApprovalRequest({
      studentId: id,
      courseCode,
      courseType,
    });

    await approvalRequest.save();
    res
      .status(200)
      .json({ message: "Course approval request submitted successfully." });
  } catch (error) {
    console.error("Error submitting course approval request:", error);
    res
      .status(500)
      .json({ message: "Failed to submit course approval request." });
  }
};

export const getPendingRequests = async (req, res) => {
  try {
    const { id } = req.params;
    //console.log("Fetching pending requests for student ID:", id);
    const requests = await CourseApprovalRequest.find({
      studentId: id,
      // status: "Pending", // now we will receive all kinds of requests on the frontend
    });
    res.status(200).json(requests);
  } catch (error) {
    console.error("Error fetching pending requests:", error);
    res.status(500).json({ message: "Failed to fetch pending requests." });
  }
};

// get userId of student by rollNo
export const getStudentFromRollNumber = async (req, res) => {
  try {
    const rollNo = req.params.id; // Assuming rollNo is passed as a URL parameter
    // console.log(rollNo);

    // Find the student by roll number
    const student = await Student.findOne({ rollNo: rollNo });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Return the userId of the found student
    res.status(200).json({ userId: student.userId });
  } catch (error) {
    console.error("Error fetching student by rollNo:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getPerformance = async (req, res) => {
  try {
    //console.log("====== CALCULATING SPI/CPI ======");
    //console.log("Student ID:", req.params.id);

    // Fetch student
    const user = await Student.findOne({ userId: req.params.id }).populate(
      "userId"
    );
    //console.log("Student found:", user ? "Yes" : "No", user?.rollNo);

    if (!user) {
      //console.log("Student not found for ID:", req.params.id);
      return res.status(404).json({ message: "Student not found" });
    }

    //  Initialize result array
    let performanceResult = [];

    // Fetch completed credit courses
    const studentCourses = await StudentCourse.find({
      rollNo: user.rollNo,
      isCompleted: true,
      creditOrAudit: "Credit",
    }).lean();

    //console.log("Found completed courses:", studentCourses.length);

    if (studentCourses.length === 0) {
      //console.log("No completed courses found for student");
      return res.status(200).json({ performance: performanceResult });
    }

    const courseIds = studentCourses.map((sc) => sc.courseId);

    const courseDetails = await Course.find({
      courseCode: { $in: courseIds },
    }).lean();

    //console.log("Found course details:", courseDetails.length);

    // Create course lookup map
    const courseMap = {};
    courseDetails.forEach((course) => {
      courseMap[course.courseCode] = course;
    });

    // Grade to point mapping
    const GRADE_MAP = {
      AA: 10,
      AB: 9,
      BB: 8,
      BC: 7,
      CC: 6,
      CD: 5,
      DD: 4,
      FF: 0,
    };

    // Group courses by semester
    const semesterMap = {};
    studentCourses.forEach((sc) => {
      const course = courseMap[sc.courseId] || {};
      const gradePoint = GRADE_MAP[sc.grade] ?? 0;
      const credits = course.credits ?? 0;

      if (!semesterMap[sc.semester]) semesterMap[sc.semester] = [];
      semesterMap[sc.semester].push({
        courseCode: sc.courseId,
        grade: sc.grade,
        gradePoint,
        credits,
      });
    });

    // Sort semesters
    const sortedSemesters = Object.keys(semesterMap).sort(
      (a, b) => Number(a) - Number(b)
    );

    let cumulativeCredits = 0;
    let cumulativeWeightedSum = 0;

    sortedSemesters.forEach((sem) => {
      const courses = semesterMap[sem];
      const totalCredits = courses.reduce((sum, c) => sum + c.credits, 0);
      const weightedSum = courses.reduce(
        (sum, c) => sum + c.gradePoint * c.credits,
        0
      );

      const spi = totalCredits
        ? (weightedSum / totalCredits).toFixed(2)
        : "0.00";

      cumulativeCredits += totalCredits;
      cumulativeWeightedSum += weightedSum;
      const cpi = cumulativeCredits
        ? (cumulativeWeightedSum / cumulativeCredits).toFixed(2)
        : "0.00";

      // 🔍 Debug Logs
      //console.log(`\n🎓 Semester ${sem}`);
      courses.forEach((c) =>
        //console.log(
          `  - ${c.courseCode}: grade=${c.grade}, pts=${
            c.gradePoint
          }, credits=${c.credits}, weighted=${c.gradePoint * c.credits}`
        )
      );
      //console.log(`  → Total Credits: ${totalCredits}`);
      //console.log(`  → Weighted Sum: ${weightedSum}`);
      //console.log(`  → SPI: ${spi}`);
      //console.log(`  → CPI: ${cpi}`);

      performanceResult.push({
        semester: Number(sem),
        spi,
        cpi,
      });
    });

    //console.log("Final result:", performanceResult);
    res.status(200).json({ performance: performanceResult });
  } catch (error) {
    console.error(" Error calculating performance:", error);
    res.status(500).json({ message: error.message });
  }
};
