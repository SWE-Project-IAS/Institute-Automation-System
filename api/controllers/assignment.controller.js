import mongoose from "mongoose";
import { Faculty } from "../models/faculty.model.js";
import { Course, FacultyCourse } from "../models/course.model.js";
import { Assignment } from "../models/assignment.model.js";
import { Student } from "../models/student.model.js";
import { StudentCourse } from "../models/course.model.js";
import { User } from "../models/user.model.js";

export const getFacultyCourses = async (req, res) => {
    const {userId} = req.params;

    try {
        // console.log("userId:",userId);
        // Ensure userId is a string
        const faculty = await Faculty.findOne({ userId: userId });
        // console.log(faculty);
        if (!faculty) {
            return res.status(404).json({ message: 'Faculty not found' });
        }

        // Get all faculty course mappings
        // console.log(userId)
        const facultyCourses = await FacultyCourse.find({ facultyId: userId, status: "Ongoing" });
        if (!facultyCourses.length) {
            return res.status(404).json({ message: 'No courses found for this faculty' });
        }

        const courseCodes = facultyCourses.map(fc => fc.courseCode);

        // Fetch full course details using courseCodes
        const courses = await Course.find({ courseCode: { $in: courseCodes } });

        return res.status(200).json({ courses });
    } catch (err) {
        console.error("Error fetching faculty courses:", err);
        return res.status(500).json({ message: "Error fetching faculty courses", error: err });
    }
};
export const getStudentCourses = async (req, res) => {
    const { userId } = req.params;

    try {
        const student = await Student.findOne({ userId: userId });
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Get all courses the student is enrolled in
        const studentCourses = await StudentCourse.find({ rollNo: student.rollNo, status: 'Approved', isCompleted: false });

        const courseCodes = studentCourses.map(sc => sc.courseId);

        const courses = await Course.find({ courseCode: { $in: courseCodes } });

        return res.status(200).json({ courses });
    } catch (err) {
        console.error("Error fetching student courses:", err);
        return res.status(500).json({ message: "Error fetching student courses", error: err });
    }
};
export const createAssignment = async (req, res) => {
    const {courseId }  = req.params;
    try {
      const { title, description, dueDate } = req.body;
      // console.log(title, description, dueDate, courseId); // Debugging line
      if (!title || !description || !dueDate || !courseId) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields.",
        });
      }
  
      // Count current assignments to assign a new assignmentNumber
      const assignmentCount = await Assignment.countDocuments({ courseCode: courseId });
  
      // console.log(assignmentCount); // Debugging line
      const newAssignment = new Assignment({
        assignmentNumber: assignmentCount + 1,
        courseCode: courseId,
        title,
        description,
        dueDate: new Date(dueDate), // Ensure proper Date format
        submissions: [],             // Start with empty submissions
        createdAt: new Date(),
        updatedAt: new Date()
      });
  
  
  
      await newAssignment.save();
  
      res.status(201).json({
        success: true,
        message: "Assignment created successfully",
        assignment: newAssignment,
      });
    } catch (error) {
      console.error("Error creating assignment:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  };

  export const getCourseAssignments = async (req, res) => {
    const {courseId} = req.params;
    // console.log('Course ID:', courseId); // Debugging line
    if (!courseId) {
        return res.status(400).json({ success: false, message: 'Course ID is required' });
    }

    try {
        const assignments = await Assignment.find({ courseCode: courseId });

        return res.status(200).json({
            success: true,
            count: assignments.length,
            assignments
        });
    } catch (error) {
        console.error('Error fetching course assignments:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};
export const getCourse = async (req, res) => {
    try {
        const { courseCode } = req.params; // 'id' is actually the courseCode
        
        if (!courseCode) {
            return res.status(400).json({ success: false, message: 'Course code is required' });
        }

        const course = await Course.findOne({ courseCode });

        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        return res.status(200).json({
            success: true,
            data: course
        });
    } catch (error) {
        console.error('Error fetching course details:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};
export const getAssignmentDetails = async (req, res) => {
    try {
      const { courseId, assignmentId } = req.params;
  
      const assignment = await Assignment.findOne({
        assignmentNumber: assignmentId,
        courseCode: courseId,
      });
  
      if (!assignment) {
        return res.status(404).json({ success: false, message: "Assignment not found" });
      }
  
      res.status(200).json({ success: true, assignment });
    } catch (err) {
      console.error("Server error:", err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };
  export const deleteAssignmentDetails = async (req, res) => {
    try {
    const { courseId, assignmentId } = req.params;
      // console.log("Delete request received for:", { courseId, assignmentId });
  
      if (!courseId || !assignmentId) {
        return res.status(400).json({ success: false, message: "Course ID and Assignment ID are required." });
      }
  
      const deletedAssignment = await Assignment.findOneAndDelete({
        assignmentNumber: assignmentId,
        courseCode: courseId,
      });
  
      if (!deletedAssignment) {
        return res.status(404).json({ success: false, message: "Assignment not found." });
      }
  
      res.status(200).json({
        success: true,
        message: "Assignment deleted successfully",
        assignment: deletedAssignment,
      });
    } catch (err) {
      console.error("Server error:", err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };
  export const editAssignmentDetails = async (req, res) => {
    try {
      const { courseId, assignmentId } = req.params;
      const { title, description, dueDate } = req.body;
  
      // console.log("Editing assignment:", { courseId, assignmentId, title, description, dueDate });
  
      // Validate input
      if (!title || !description || !dueDate) {
        return res.status(400).json({
          success: false,
          message: "Title, description, and due date are required.",
        });
      }
  
      // Update assignment
      const updatedAssignment = await Assignment.findOneAndUpdate(
        { assignmentNumber: assignmentId, courseCode: courseId },
        { title, description, dueDate },
        { new: true }
      );
  
      if (!updatedAssignment) {
        return res.status(404).json({
          success: false,
          message: "Assignment not found.",
        });
      }
  
      // Return success response
      res.status(200).json({
        success: true,
        message: "Assignment updated successfully.",
        assignment: updatedAssignment,
      });
    } catch (error) {
      console.error("Edit assignment error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
  };
  
// Controller to submit an assignment
export const submitAssignment = async (req, res) => {
  try {
    const { courseCode, assignmentId } = req.params;
    const { studentRollNo, studentName, content } = req.body;
    console.log("Uploaded file info:", req.file);
    const assignment = await Assignment.findOne({
      assignmentNumber: assignmentId,
      courseCode: courseCode,
    });

    if (!assignment) {
      return res.status(404).json({ success: false, message: "Assignment not found" });
    }

    const alreadySubmitted = assignment.submissions.some(
      (sub) => sub.studentRollNo === studentRollNo
    );

    if (alreadySubmitted) {
      return res.status(409).json({ success: false, message: "Already submitted" });
    }

    const fileUrl = req.file ? req.file.path : null;
    const fileName = req.file ? req.file.originalname : null;
    assignment.submissions.push({
      studentRollNo,
      studentName,
      content,
      fileUrl,
      fileName,
      submittedAt: new Date(),
    });
    

    await assignment.save();

    res.status(200).json({ success: true, message: "Submitted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to submit assignment" });
  }
};

  export const undoSubmission = async (req, res) => {
    try {
      const { courseCode, assignmentId, rollNo } = req.params;
        // console.log("Undo submission request:", { courseCode, assignmentId, rollNo });
      const assignment = await Assignment.findOne({
        assignmentNumber: assignmentId,
        courseCode: courseCode,
      });
  
      if (!assignment) {
        return res.status(404).json({ success: false, message: "Assignment not found" });
      }
  
      const initialLength = assignment.submissions.length;
      assignment.submissions = assignment.submissions.filter(
        (sub) => sub.studentRollNo !== rollNo
      );
  
      if (assignment.submissions.length === initialLength) {
        return res.status(404).json({ success: false, message: "Submission not found" });
      }
  
      await assignment.save();
  
      res.status(200).json({ success: true, message: "Submission undone" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "Failed to undo submission" });
    }
  };
export const getStudent = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const student = await Student.findOne({ userId });
        
        if (!student) {
            return res.status(404).json({ 
                success: false, 
                message: 'Student not found' 
            });
        }
        
        return res.status(200).json({
            success: true,
            student
        });
    } catch (error) {
        console.error('Error fetching student details:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};
export const getUser = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }
        
        return res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.error('Error fetching user details:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};