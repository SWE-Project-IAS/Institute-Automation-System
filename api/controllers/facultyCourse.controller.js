import { Faculty } from '../models/faculty.model.js';
import { FacultyCourse } from '../models/course.model.js';
import { Course } from '../models/course.model.js';
import { CourseRegistration } from '../models/course.model.js';
import { Student } from '../models/student.model.js';
import { StudentCourse } from '../models/course.model.js';


export const getFacultyCourses = async (req, res) => {    
  try {
    const {id}=req.params;
    console.log(id);
    const userId=id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required in headers'
      });
    }
    // Step 1: Find the faculty using the userId
    const faculty = await Faculty.findOne({ userId });
    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: 'Faculty not found for the given user ID'
      });
    }
    console.log(faculty);
    // Step 2: Find all faculty-course mappings for this faculty
    const facultyCourses = await FacultyCourse.find({ facultyId: faculty.userId });

    if (!facultyCourses.length) {
      return res.status(404).json({
        success: false,
        message: 'No courses assigned to this faculty'
      });
    }

    // Step 3: Get detailed info from Course model
    const courseCodes = facultyCourses.map(fc => fc.courseCode);
    const courses = await Course.find({ courseCode: { $in: courseCodes } });

    return res.status(200).json({
      success: true,
      data: courses
    });

  } catch (error) {
    console.error('Error fetching faculty courses:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message
    });
  }
};

// Get students registered for a course
export const getStudentsByCourse = async (req, res) => {
    const { courseCode } = req.params;
  
    try {
      const registrations = await CourseRegistration.find({ courseCode }).populate({
        path: 'rollNo',
        model: Student
      });
  
      const students = registrations.map((reg) => ({
        name: reg.rollNo?.userId?.name || "N/A",
        rollNo: reg.rollNo?.rollNo,
        program: reg.rollNo?.program,
        semester: reg.rollNo?.semester,
      }));
  
      res.status(200).json({ success: true, students });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: err.message });
    }
  };


  // Approve selected student registrations
export const approveRegistrations = async (req, res) => {
  const { courseCode, students } = req.body;

  if (!courseCode || !Array.isArray(students)) {
    return res.status(400).json({ success: false, message: 'Invalid request body' });
  }

  try {
    for (const rollNo of students) {
      const reg = await CourseRegistration.findOne({ courseCode, rollNo });
      if (!reg) continue;

      await StudentCourse.findOneAndUpdate(
        { courseId: courseCode, rollNo },
        {
          $set: {
            courseId: courseCode,
            rollNo,
            creditOrAudit: reg.creditOrAudit,
            semester: reg.semester,
            status: 'Approved',
            updatedAt: new Date(),
          },
        },
        { upsert: true, new: true }
      );

      await CourseRegistration.deleteOne({ courseCode, rollNo });
    }

    return res.json({ success: true, message: 'Students approved successfully' });
  } catch (error) {
    console.error('Error approving registrations:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
