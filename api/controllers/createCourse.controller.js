import { Course, FacultyCourse, ProgramCourseMapping } from "../models/course.model.js";

export const createCourse = async (req, res) => {
  try {
    const {
      courseCode,
      courseName,
      maxIntake,
      faculty,
      slot,
      courseDepartment,
      credits,
      year,
      session,
      configurations,
    } = req.body;



    // Validate required fields
    if (!courseCode || !courseName || !courseDepartment) {
      return res.status(400).json({ message: "Missing required course fields" });
    }

    // Create or update course
    let course = await Course.findOne({ courseCode });
    if (!course) {
      course = new Course({
        courseCode,
        courseName,
        department: courseDepartment,
        maxIntake,
        slot,
        credits
      });
      await course.save();
    }

    // console.log("Course created or updated:", course);

    // Process configurations
    for (const config of configurations) {
      const { program, department, semesters, type } = config;

      // Validate configuration
      if (!program || !department || !semesters?.length || !type) {
        continue; // Skip invalid configurations
      }


      // Create mappings for each semester
      for (const semester of semesters) {
        // Create faculty-course mapping
        const facultyCourse = new FacultyCourse({
          facultyId: faculty,
          courseCode,
          program,
          semester,
          year,
          session
        });
        await facultyCourse.save();


        // Create program-course mapping
        const programMapping = new ProgramCourseMapping({
          courseCode,
          program,
          department,
          year,
          semester,
          type
        });
        await programMapping.save();
      }
    }
    console.log("Mappings created successfully");

    return res.status(200).json({
      message: "Course and mappings created successfully",
      courseCode
    });

  } catch (err) {
    console.error("Error in createCourse:", err);
    return res.status(500).json({
      message: err.message || "Internal server error"
    });
  }
};
export default createCourse; 