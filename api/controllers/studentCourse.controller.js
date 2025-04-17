// controllers/courseRegistration.controller.js
import { Student } from "../models/student.model.js";
import { ProgramCourseMapping } from "../models/course.model.js";
import { Course } from "../models/course.model.js";
import { StudentCourse, CourseRegistration } from '../models/course.model.js';


export const getAvailableCoursesForRegistration = async (req, res) => {
    const { userId } = req.params;
    console.log(userId);
    console.log("Fetching courses for userId:", userId);
  
    try {
      const student = await Student.findOne({ userId });
      console.log("Student found:", student);
  
      if (!student) {
        return res.status(404).json({ success: false, message: "Student not found" });
      }
  
      const { program, department, semester } = student;
      console.log("Program:", program, "Department:", department, "Semester:", semester);
  
      const courseMappings = await ProgramCourseMapping.find({
        program,
        department,
        semester,
      });
      console.log("Course mappings:", courseMappings);
  
      const courseCodes = courseMappings.map((c) => c.courseCode);
      const courses = await Course.find({ courseCode: { $in: courseCodes } });
      console.log("Fetched course details:", courses);
  
      const coreCourses = [];
      const electiveCourses = [];
  
      courseMappings.forEach((mapping) => {
        const course = courses.find((c) => c.courseCode === mapping.courseCode);
        if (!course) return;
  
        if (mapping.type === "Core") coreCourses.push(course);
        else if (mapping.type === "Elective") electiveCourses.push(course);
      });
  
      const allAuditMappings = await ProgramCourseMapping.find({ semester });
      const allAuditCourseCodes = allAuditMappings.map((c) => c.courseCode);
      const allAuditCourses = await Course.find({ courseCode: { $in: allAuditCourseCodes } });
  
      console.log("Returning data:");
      console.log("Core:", coreCourses.length);
      console.log("Elective:", electiveCourses.length);
      console.log("Audit:", allAuditCourses.length);
  
      return res.status(200).json({
        success: true,
        coreCourses,
        electiveCourses,
        auditCourses: allAuditCourses,
      });
    } catch (err) {
      console.error("Error in course fetch:", err);
      return res.status(500).json({ success: false, message: err.message });
    }
  };



  export const registerCourse = async (req, res) => {
    try {
        const { userId, courseCode, creditOrAudit } = req.body;

        // 1. Get course details by courseCode
        const course = await Course.findOne({ courseCode });
        if (!course) return res.status(404).json({ message: "Course not found" });

        const { slot, maxIntake } = course;

        // 2. Get student using userId to access rollNo and semester
        const student = await Student.findOne({ userId });
        if (!student) return res.status(404).json({ message: "Student not found" });

        const { rollNo, semester } = student;

        // 3. Check capacity
        const currentRegistrations = await StudentCourse.countDocuments({
            courseId: courseCode,
            isCompleted: false,
        });

        if (currentRegistrations >= maxIntake) {
            return res.status(400).json({ message: "Course capacity full" });
        }

        // 4. Prevent duplicate registration
        const alreadyRegistered = await StudentCourse.findOne({
            rollNo,
            courseId: courseCode,
            isCompleted: false,
        });

        if (alreadyRegistered) {
            return res.status(400).json({ message: "Already registered for this course" });
        }

        // 5. Check for slot clashes
        const studentCourses = await StudentCourse.find({ rollNo, isCompleted: false });

        for (const sc of studentCourses) {
            const c = await Course.findOne({ courseCode: sc.courseId });
            if (c && c.slot === slot) {
                return res.status(400).json({ message: `Slot clash with course: ${c.courseName}` });
            }
        }

        // 6. Register in CourseRegistration
        await CourseRegistration.create({
            courseCode,
            rollNo,
            creditOrAudit,
            semester,
        });

        // 7. Register in StudentCourse
        await StudentCourse.create({
            rollNo,
            courseId: courseCode,
            creditOrAudit,
            semester,
            status: "Pending",
        });

        res.status(200).json({ message: "Course registration submitted successfully (pending approval)" });

    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
