import { Course, FacultyCourse, ProgramCourseMapping } from "../models/course.model.js";
import { Faculty } from "../models/faculty.model.js";

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
      
        // Find the faculty document
        const facultyDoc = await Faculty.findOne({ email: faculty });
        if (!facultyDoc) {
          return res.status(404).json({ message: "Faculty not found" });
        }
        const facultyId = facultyDoc.userId; // Get the faculty ID from the document

        // console.log("fdkfhdjfhdhfkuhfkuh");
        // console.log("Faculty document found:", facultyDoc);

      // Create mappings for each semester
      for (const semester of semesters) {
        // Create faculty-course mapping
        const facultyCourse = new FacultyCourse({
          facultyId: facultyId,
          courseCode,
          program,
          semester,
          year,
          session
        });
        await facultyCourse.save();

        // facultyDoc.courses.push({
        //   facultyId: faculty,
        //   courseCode,
        //   program,
        //   semester,
        //   year,
        //   session
        // });
        const updateResult = await Faculty.findByIdAndUpdate(
          facultyDoc._id,
          { 
            $push: {
              courses: facultyCourse.toObject() // Convert to plain object before pushing
            },
            updatedAt: new Date()
          },
          { new: true } // Return the updated document
        );

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
    // console.log("Mappings created successfully");

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