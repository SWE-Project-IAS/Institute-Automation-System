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
        //console.log("userId:",userId);
        // Ensure userId is a string
        const faculty = await Faculty.findOne({ userId: userId });

        if (!faculty) {
            return res.status(404).json({ message: 'Faculty not found' });
        }

        // Filter faculty courses to find those with status "Ongoing"
        // const ongoingCourses = faculty.courses.filter(course => course.status === "Ongoing");
        // const courseCodes = ongoingCourses.map(course => course.courseCode);
        
        // Get all faculty course mappings
        const facultyCourses = await FacultyCourse.find({ facultyId: userId, status: "Ongoing" });

        if (!facultyCourses.length) {
            return res.status(404).json({ message: 'No courses found for this faculty' });
        }

        const courseCodes = facultyCourses.map(fc => fc.courseCode);

        // Fetch full course details using courseCodes
        const courses = await Course.find({ courseCode: { $in: courseCodes } });

        //console.log("Courses:", courses);

        return res.status(200).json({ courses });
    } catch (err) {
        console.error("Error fetching faculty courses:", err);
        return res.status(500).json({ message: "Error fetching faculty courses", error: err });
    }
};


export const getStudentsinCourse = async (req, res) => {
    try {
      const { courseId } = req.params;
      //console.log("Course id")
      //console.log(courseId)
      if (!courseId) {
        return res.status(400).json({ message: 'Course ID is required' });
      }

    // Find the course by courseId
    const course = await Course.findOne({
        courseCode: courseId
    });

    if (!course) {
        return res.status(404).json({ message: 'Course not found' });
    }

    // Extract student ObjectIds from the course's students array
    // const studentIds = course.students;
    // // Find students by their ObjectIds
    // const enrolledStudents = await Student.find({
    //     _id: { $in: studentIds }
    // }).select('rollNo email'); // Select rollNo and email
    // console.log("Enrolled Students");
    // console.log(enrolledStudents);


    //   Find all students who are enrolled (Approved status) in the given course
    const enrolledStudents = await StudentCourse.find({
      courseId,
      status: 'Approved'
    }) // Select rollNo and email
  
    // Extract roll numbers and emails from the result
    const studentDetails = await Promise.all(
      enrolledStudents.map(async (student) => {
      const studentData = await Student.findOne({ rollNo: student.rollNo });
      if (!studentData) {
        return {
        rollNumber: student.rollNo,
        name: 'Unknown'
        };
      }
      const user = await User.findById(studentData.userId).select('name');
      return {
        rollNumber: student.rollNo,
        name: user ? user.name : 'Unknown'
      };
      })
    );

    res.status(200).json({ students: studentDetails });

    } catch (error) {
      console.error('Error fetching students:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

export const submitGrades = async (req, res) => {
  const studentGrades = req.body.students;
  const { courseId } = req.params;
  const facultyId = req.body.faculty;
  //console.log(req.body);
  try {
    // Iterate through the list of students and update their grades
    for (const student of studentGrades) {
      //console.log("Student = ", student);
      const { rollNumber, grade } = student;

      // Find the StudentCourse entry with the given courseId and rollNo
      const studentCourse = await StudentCourse.findOne({
        courseId,
        rollNo: rollNumber
      });

      if (!studentCourse) {
        console.warn(`No StudentCourse entry found for rollNo: ${rollNumber} and courseId: ${courseId}`);
        continue; // Skip to the next student if no entry is found
      }

      // Update the grade for the student
      studentCourse.grade = grade;
      studentCourse.updatedAt = new Date();
      studentCourse.isCompleted = true; // Mark the course as completed
      // Save the updated StudentCourse entry
      await studentCourse.save();

      // console.log(`Updated grade for rollNo: ${rollNumber} to ${grade}`);
    }
    

    // Find the FacultyCourse entry with the given courseId and facultyId
    const facultyCourse = await FacultyCourse.findOne({
      courseCode: courseId,
      facultyId
    });

    if (facultyCourse) {
      // Mark the course as completed
      facultyCourse.status = "Completed";
      facultyCourse.updatedAt = new Date();
      await facultyCourse.save();

      //console.log(`Marked course with courseId: ${courseId} as Completed for facultyId: ${facultyId}`);
    } else {
      console.warn(`No FacultyCourse entry found for courseId: ${courseId} and facultyId: ${facultyId}`);
    }


    res.status(200).json({ message: "Grades submitted successfully" });
  } catch (error) {
    console.error("Error submitting grades:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};