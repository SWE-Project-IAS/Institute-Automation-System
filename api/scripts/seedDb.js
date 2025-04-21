import { connectDB } from "../database/mongoDb.js";
import { User} from "../models/user.model.js";
import { Student } from "../models/student.model.js"; 
import bcrypt from "bcrypt"; // Import the bcrypt library
import { HostelAdmin } from "../models/hostelAdmin.model.js";
import { AcadAdmin } from "../models/acadAdmin.model.js";
import { Faculty } from "../models/faculty.model.js";
import { StudentCourse } from "../models/course.model.js";
import { Course } from "../models/course.model.js";
import { FacultyCourse } from "../models/course.model.js";
import { Feedback } from "../models/feedback.model.js";
// Sample user data
const userData = {
  name: "Divyansh Chandak",
  email: "testStudent@iitg.ac.in",
  hostel: "Lohit",
  rollNo: "220101039",
  password: "password123", // In a real app, you should hash this
  refreshToken: "sample-refresh-token-1",
  contactNo: "1234567890",
  isVerified: true
};
const nonAcadAdminData = {
  name: "Himanshu Sharma",
  email: "testHab@iitg.ac.in",
  password: "1234", // In a real app, you should hash this
  refreshToken: "sample-refresh-token-2",
  contactNo: "8329521234",
  isVerified: true
};
const acadAdminData = {
    name: "Dr. Smith",
    email: "acadAdmin@iitg.ac.in",
    password: "admin123",
    refreshToken: "sample-refresh-token-3",
    contactNo: "9876543210",
    isVerified: true,
    designation: "Dean of Academic Affairs",
    qualifications: ["PhD in Computer Science", "M.Tech in AI"],
    status: "active"
};
const facultyData = {
    name: "Dr. Sarah Johnson",
    email: "faculty@iitg.ac.in",
    password: "faculty123",
    refreshToken: "sample-refresh-token-4",
    contactNo: "7654321890",
    isVerified: true,
    department: "Computer Science and Engineering",
    designation: "Associate Professor",
    courses: [],//empty for now
    specialization: "Machine Learning",
    qualifications: ["PhD in AI", "MTech in Computer Science"],
    status: "active"
};


const studentCoursesData = [
  {
      rollNo: "220101039",
      courseId: "CS101",
      creditOrAudit: "Credit",
      semester: "3",
      status: "Approved",
      grade: "A",
      isCompleted: true
    },
    {
      rollNo: "220101039",
      courseId: "MA102",
      creditOrAudit: "Credit",
      semester: "3",
      status: "Approved",
      grade: "B+",
      isCompleted: false
    },
    {
      rollNo: "220101039",
      courseId: "EE204",
      creditOrAudit: "Credit",
      semester: "3",
      status: "Approved",
      grade: "A-",
      isCompleted: false
    },
    {
      rollNo: "220101039",
      courseId: "HS103",
      creditOrAudit: "Audit",
      semester: "3",
      status: "Pending",
      grade: null,
      isCompleted: false
  }
];

// 67fb92cbabe317891d8c0c11
const coursesData = [
  {
      courseCode: "CS101",
      courseName: "Introduction to Computer Science",
      department: "Computer Science and Engineering",
      slot: "F1",
      credits: 6,
      announcements: [
          {
              title: "Mid-Semester Exam Schedule",
              content: "The mid-semester exam will be conducted on April 25, 2025, from 9:00 AM to 12:00 PM in the Main Auditorium. Please bring your ID cards and necessary stationery.",
              importance: "High",
              date: new Date("2025-04-10"),
              postedBy: "FACULTY001"
          },
          {
              title: "Assignment Submission Deadline Extended",
              content: "Due to the upcoming festival, the deadline for Assignment 2 has been extended to April 20, 2025.",
              importance: "Medium",
              date: new Date("2025-04-12"),
              postedBy: "FACULTY001"
          }
      ],
      students: []
  },
  {
      courseCode: "MA102",
      courseName: "Calculus and Linear Algebra",
      department: "Mathematics",
      slot: "A1",
      credits: 8,
      announcements: [
          {
              title: "Extra Class This Weekend",
              content: "We will have an extra class this Saturday (April 19, 2025) from 10:00 AM to 12:00 PM to cover topics from Chapter 7.",
              importance: "Medium",
              date: new Date("2025-04-14"),
              postedBy: "FACULTY002"
          }
      ],
      students: []
  },
  {
      courseCode: "EE204",
      courseName: "Digital Electronics",
      department: "Electrical Engineering",
      slot: "E1",
      credits: 6,
      announcements: [
          {
              title: "Lab Report Submission",
              content: "All lab reports for experiments 1-5 must be submitted by April 22, 2025. No extensions will be provided.",
              importance: "High",
              date: new Date("2025-04-08"),
              postedBy: "FACULTY003"
          },
          {
              title: "Project Groups Formation",
              content: "Please form groups of 3 students for the final project and submit your group details by April 17, 2025.",
              importance: "Medium",
              date: new Date("2025-04-11"),
              postedBy: "FACULTY003"
          }
        ],
        students: []
  },
  {
      courseCode: "HS103",
      courseName: "Introduction to Philosophy",
      department: "Humanities and Social Sciences",
      slot: "G",
      credits: 4,
      announcements: [
          {
              title: "Guest Lecture Announcement",
              content: "We will have a guest lecture by Prof. Michael Stevens on 'Contemporary Philosophical Perspectives' on April 23, 2025, at 3:00 PM in the HSS Auditorium.",
              importance: "Medium",
              date: new Date("2025-04-13"),
              postedBy: "FACULTY004"
          }
      ],
      students: []
  },
  {
      courseCode: "CS201",
      courseName: "Data Structures and Algorithms",
      department: "Computer Science and Engineering",
      slot: "B2",
      credits: 8,
      announcements: [
          {
              title: "Coding Contest",
              content: "A coding contest will be held on April 21, 2025, from 6:00 PM to 9:00 PM in the Computer Lab. Top performers will receive extra credits.",
              importance: "Medium",
              date: new Date("2025-04-09"),
              postedBy: "FACULTY001"
          },
          {
              title: "URGENT: Change in Syllabus",
              content: "The topic 'Advanced Graph Algorithms' has been removed from the final exam syllabus. Please refer to the updated syllabus on the course portal.",
              importance: "Critical",
              date: new Date("2025-04-12"),
              postedBy: "FACULTY001"
          }
      ],
      students: []
  },
  {
      courseCode: "ME101",
      courseName: "Engineering Mechanics",
      department: "Mechanical Engineering",
      slot: "D",
      credits: 6,
      announcements: [
          {
              title: "Field Trip",
              content: "A field trip to the Manufacturing Plant is scheduled for April 27, 2025. Details will be shared in the next class.",
              importance: "Medium",
              date: new Date("2025-04-14"),
              postedBy: "FACULTY005"
          }
      ],
      students: []
  },
  {
      courseCode: "CH102",
      courseName: "Physical Chemistry",
      department: "Chemistry",
      slot: "F2",
      credits: 6,
      announcements: [
          {
              title: "Lab Equipment Malfunction",
              content: "Due to a malfunction in the lab equipment, this week's practical session has been postponed to next week.",
              importance: "High",
              date: new Date("2025-04-13"),
              postedBy: "FACULTY006"
          }
      ],
      students: []
  }
];

const facultyCoursesData = [
  {
    facultyId: "68027a2d8046282b12c3b3b3", // Will be replaced with actual facultyId
    courseCode: "CS101",
    year: 2025,
    session: "Spring Semester",
    status: "Ongoing",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    facultyId: "68027a2d8046282b12c3b3b3", // Will be replaced with actual facultyId
    courseCode: "EE204",
    year: 2025,
    session: "Spring Semester",
    status: "Ongoing",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    facultyId: "68027a2d8046282b12c3b3b3", // Will be replaced with actual facultyId
    courseCode: "CS201",
    year: 2025,
    session: "Spring Semester",
    status: "Ongoing",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    facultyId: "68027a2d8046282b12c3b3b3", // Will be replaced with actual facultyId
    courseCode: "HS103",
    year: 2024,
    session: "Winter Semester",
    status: "Completed",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    facultyId: "68027a2d8046282b12c3b3b3", // Will be replaced with actual facultyId
    courseCode: "MA102",
    year: 2024,
    session: "Summer Course",
    status: "Completed",
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Function to seed data
const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    console.log("Connected to MongoDB, starting seed process...");
    
    // Generate a salt
    const saltRounds = 10; // You can adjust this number for more or less security (higher is more secure but slower)
    // const hashedPassword = await bcrypt.hash(facultyData.password, saltRounds);
    // // Create user with the hashed password
    // const createdFacultyUser = await User.create({
    //   ...facultyData, // Spread the existing facultyData
    //   password: hashedPassword, // Override the plain text password with the hashed one
    // });
    // console.log("User created:", createdFacultyUser.name, "with email:", createdFacultyUser.email);
    // // Create a faculty with the same email
    // const faculty = await Faculty.create({
    //   userId: createdFacultyUser._id,
    //   email: facultyData.email,
    //   department: facultyData.department,
    //   designation: facultyData.designation,
    //   courses: facultyData.courses,
    //       specialization: facultyData.specialization,
    //       qualifications: facultyData.qualifications,
    //       status: facultyData.status,
    //       createdAt: new Date(),
    //       updatedAt: new Date()
    //     });
    //     console.log("Faculty created with designation:", faculty.designation);
    //     console.log("Faculty is linked to user with email:", createdFacultyUser.email);
        
        const hashedPassword = await bcrypt.hash(acadAdminData.password, saltRounds);
        
        // Create user with the hashed password
        const createdAcadAdminUser = await User.create({
            ...acadAdminData, // Spread the existing acadAdminData
            password: hashedPassword, // Override the plain text password with the hashed one
          });
          console.log("User created:", createdAcadAdminUser.name, "with email:", createdAcadAdminUser.email);
          
          // Create an academic admin with the same email
          const acadAdmin = await AcadAdmin.create({
                  userId: createdAcadAdminUser._id,
                  email: acadAdminData.email,
                  designation: acadAdminData.designation,
                  qualifications: acadAdminData.qualifications,
                  status: acadAdminData.status,
                  createdAt: new Date(),
                  updatedAt: new Date()
                });
                console.log("Academic Admin created with designation:", acadAdmin.designation);
                console.log("Academic Admin is linked to user with email:", createdAcadAdminUser.email);
            
            // const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
            
            // // Create user with the hashed password
            // const createdUser = await User.create({
            //     ...userData, // Spread the existing userData
            //     password: hashedPassword, // Override the plain text password with the hashed one
            //   });
            //   console.log("User created:", createdUser.name, "with email:", createdUser.email);
              
            //   // Create a student with the same email
            //   const student = await Student.create({
            //           userId: createdUser._id,
            //           hostel: "Lohit",
            //           rollNo: "220101039",
            //           fatherName: "testPapa",
            //           motherName:"testMumma",
            //           email: "testStudent@iitg.ac.in",
            //           department: "Computer Science and Engineering",
            //           semester: 6,
            //           batch: "2022-2026",
            //           program: "BTech",
            //           status: "active",
            //           roomNo: "B-238",
            //           createdAt: new Date(),
            //           updatedAt: new Date()
            //         });
            //         // console.log("Student created with register number:", student.registerNo);
            //         console.log("Student is linked to user with email:", createdUser.email);
                
                // const hashedPassword2 = await bcrypt.hash(nonAcadAdminData.password, saltRounds);
                // console.log("Hashed password for non-academic admin:", hashedPassword2);
                // // Create the Non-Academic Admin User
                // const createdHabUser = await User.create({
                //       ...nonAcadAdminData,
                //       password: hashedPassword2,
                //   });
                //   console.log("Non-Academic Admin User created:", createdHabUser.name, "with email:", createdHabUser.email);
                  
                //   // Now create the HostelAdmin entry
                //   const createdHab = await HostelAdmin.create({
                //         userId: createdHabUser._id,     // Link to created User
                //         email: createdHabUser.email,    // Same email
                //         status: "active",               // or "on-leave" / "inactive" if you want
                //     });
                //     console.log("HostelAdmin created:", createdHab.email);
                    
                    console.log("Database seeded successfully!");
                    process.exit(0);
                  } catch (error) {
                    console.error("Error seeding database:", error);
                    process.exit(1);
                  }
  };
                
const seedStudentCourses = async () => {
    try {
      // Connect to MongoDB
      await connectDB();
      console.log("Connected to MongoDB, starting student courses seed process...");
      
      // Check if courses already exist for this student
      const existingCourses = await StudentCourse.find({ rollNo: "220101039" });
      
      if (existingCourses.length > 0) {
        console.log(`Found ${existingCourses.length} existing courses for student 220101039. Deleting them before re-seeding.`);
        await StudentCourse.deleteMany({ rollNo: "220101039" });
      }
      
      // Insert the student courses
      const result = await StudentCourse.insertMany(studentCoursesData);
      
      console.log(`Successfully added ${result.length} courses for student 220101039:`);
      result.forEach(course => {
        console.log(`- ${course.courseId} (${course.creditOrAudit}) - Status: ${course.status}, Grade: ${course.grade || 'Not graded yet'}`);
      });
      
      console.log("Student courses seeded successfully!");
      process.exit(0);
    } catch (error) {
      console.error("Error seeding student courses:", error);
      process.exit(1);
    }
  };
  
  const seedCourses = async () => {
    try {
      // Connect to MongoDB
      await connectDB();
      console.log("Connected to MongoDB, starting courses seed process...");
      
      // Check if courses already exist
      // const existingCourses = await Course.find({
      //   // courseCode: { $in: coursesData.map(course => course.courseCode) }
      // });
      // console.log("Existing courses found:", existingCourses);
      // if (existingCourses.length > 0) {
      //   console.log(`Found ${existingCourses.length} existing courses. Deleting them before re-seeding.`);
      //   await Course.deleteMany({
      //     // courseCode: { $in: coursesData.map(course => course.courseCode) }
      //   });
      // }
      
      const result = await Course.updateMany(
        { "announcements.postedBy": "Dr. Sarah Johnson" },
        { 
          $pull: { 
            announcements: { postedBy: "Dr. Sarah Johnson" } 
          } 
        }
      );
      
      console.log(`Operation completed. Modified ${result.modifiedCount} courses.`);
      console.log(`Matched ${result.matchedCount} courses with Dr. Johnson's announcements.`);
      
      return result;
      // Insert the courses
      // const result = await Course.insertMany(coursesData);
      
      // console.log(`Successfully added ${result.length} courses:`);
      // result.forEach(course => {
      //   console.log(`- ${course.courseCode}: ${course.courseName} (${course.credits} credits, Slot: ${course.slot})`);
      // });
      
      console.log("Courses seeded successfully!");
      
      // If you want to run both seed functions, you can call seedStudentCourses() here
      // or just exit
      process.exit(0);
    } catch (error) {
      console.error("Error seeding courses:", error);
      process.exit(1);
    }
  };

  const removeAllStudentsFromCourse = async () => {
    try {
      // Connect to MongoDB
      await connectDB();
      console.log("Connected to MongoDB, starting student removal process...");
      
      // Find the course with code CS101
      const course = await Course.findOne({ courseCode: "CS101" });
      
      if (!course) {
        console.log("Course CS101 not found!");
        process.exit(1);
      }
      
      console.log(`Found course: ${course.courseName} with ${course.students.length} students enrolled`);
      
      // Update the course to have an empty students array
      const updatedCourse = await Course.findByIdAndUpdate(
        course._id,
        { students: [] },
        { new: true }
      );
      
      console.log(`Successfully removed all students from ${updatedCourse.courseCode} - ${updatedCourse.courseName}`);
      console.log(`Current student count: ${updatedCourse.students.length}`);
      
      console.log("Student removal completed successfully!");
      process.exit(0);
    } catch (error) {
      console.error("Error removing students from course:", error);
      process.exit(1);
    }
  };

  const removeStudentCouse = async () => {
    try {
      // Connect to MongoDB
      await connectDB();
      console.log("Connected to MongoDB, starting student course removal process...");
      
      // Find the student course entry
      const studentCourse = await StudentCourse.findOne({
        rollNo: "220101039",
        courseId: "CS101"
      });
      
      if (!studentCourse) {
        console.log(`Student course entry not found for rollNo: 220101039 and courseId: CS101`);
        process.exit(1);
      }
      
      // Remove the student from the course
      await StudentCourse.deleteOne({
        rollNo: "220101039",
        courseId: "CS101"
      });
      
      console.log(`Successfully removed student from course CS101`);
      process.exit(0);
    } catch (error) {
      console.error("Error removing student from course:", error);
      process.exit(1);
    }
  };
    
  const seedFacultyCourses = async () => {
    try {
      // Connect to MongoDB
      await connectDB();
      console.log("Connected to MongoDB, starting faculty courses seed process...");
      
      // Check if faculty courses already exist
      const existingFacultyCourses = await FacultyCourse.find({});
      console.log("Existing faculty courses found:", existingFacultyCourses);
      if (existingFacultyCourses) {
        console.log(`Found existing faculty courses. Deleting them before re-seeding.`);
        await FacultyCourse.deleteMany({});
      }
      
      // Insert the faculty courses
      const result = await FacultyCourse.insertMany(facultyCoursesData);
      
      console.log(`Successfully added ${result.length} faculty courses for ${facultyData.facultyId}:`);
      result.forEach(course => {
        console.log(`- ${course.courseCode} (${course.year}, ${course.session}) - Status: ${course.status}`);
      });
      
      console.log("Faculty courses seeded successfully!");
      process.exit(0);
    } catch (error) {
      console.error("Error seeding faculty courses:", error);
      process.exit(1);
    }
  }

  const fillFacultyCourse = async () => {
    try {
      // Connect to MongoDB
      await connectDB();
      console.log("Connected to MongoDB, starting faculty course filling process...");
      // const result = await Faculty.updateMany(
      //   {}, // Empty filter means select all documents
      //   { $set: { courses: [] } } // Set courses to an empty array
      // );
      // Find the faculty with ID 67fb92cbabe317891d8c0c11
      // const facultyCourses = await FacultyCourse.find({});
      const courses1 = ["CS101", "MA102", "EE204"];
      const courses2 = ["CS201", "ME101", "CH102", "HS103"];
      const fac1Id = "68027a2d8046282b12c3b3b3";
      const fac2Id = "6802b5627d04605a4cecf14e";

      const currentYear = new Date().getFullYear();

      // Array of possible sessions
      const sessions = ['Winter Semester', 'Spring Semester', 'Summer Course'];
      const stud1Id = "680268e4359e6305027d1f5e";
      const roll1 = "220101039";
      const stud2Id = "6802673cb698ebe4b9e7a7e6";
      const roll2 = "220101066";

      // const studentCourseObj = courses2.map(courseCode => {
      //   return {
      //     rollNo: roll2,
      //     courseId: courseCode,
      //     creditOrAudit: "Credit",
      //     semester: "3",
      //     status: "Approved",
      //     grade: null,
      //     isCompleted: false,
      //     createdAt: new Date(),
      //     updatedAt: new Date()
      //   };
      // });

      const update = await Course.updateMany(
        { courseCode: { $in: courses2 } },
        { $push: { students: stud2Id } }
      );

      console.log("Updated course students:", update);
      // const insert = await StudentCourse.insertMany(studentCourseObj);
      // Create an array of documents to insert
      // const facultyCourseDocs = courses2.map(courseCode => {
      //   return {
      //     facultyId: fac2Id,
      //     courseCode: courseCode,
      //     year: currentYear,
      //     session: sessions[Math.floor(Math.random() * sessions.length)], // Random session
      //     status: 'Ongoing', // Default status
      //     createdAt: new Date(),
      //     updatedAt: new Date()
      //   };
      // });

      // const facultyCourseObjects = await FacultyCourse.find({ courseCode: { $in: courses2 } });
      // const faculty = await Faculty.findOne({ userId: fac2Id });
      // const updateResult = await Faculty.findByIdAndUpdate(
      //   faculty._id,
      //   { 
      //     $push: { 
      //       courses: { 
      //         $each: facultyCourseObjects 
      //       } 
      //     },
      //     updatedAt: new Date()
      //   },
      //   { new: true } // Return the updated document
      // );
      // console.log("Updated faculty courses:", updateResult);
      // const result = await Course.updateMany(
      //   { courseCode: { $in: courses2 } },
      //   { $set: { "announcements.$[].postedBy": fac2Id } }
      // );
      // facultyCourse me daal ye sab
      // console.log("Faculty courses found:", facultyCourses);
      
      // // map through all the FacultyCourses, through the facultyId find the faculty and put the id in the faculty course array
      // for (const course of facultyCourses) {
      //   // Find the faculty by facultyId
      //   const faculty = await Faculty.findOne({ userId: course.facultyId });
        
      //   if (faculty) {
      //     console.log(`Updating faculty ${faculty.email} with course ${course.courseCode}`);
          
      //     // Check if the course already exists in faculty's courses array
      //     const courseExists = faculty.courses.some(existingCourse => 
      //       existingCourse._id.toString() === course._id.toString()
      //     );
          
      //     if (!courseExists) {
      //       // Add the course to faculty's courses array
      //       faculty.courses.push(course);
      //       faculty.updatedAt = Date.now();
            
      //       // Save the faculty document
      //       await faculty.save();
      //       console.log(`Added course ${course.courseCode} to faculty ${faculty.email}`);
      //     } else {
      //       console.log(`Course ${course.courseCode} already exists for faculty ${faculty.email}`);
      //     }
      //   } else {
      //     console.log(`Faculty not found for course ${course.courseCode} with faculty ID ${course.facultyId}`);
      //   }
      // }
      // Update the faculty's courses
      
      process.exit(0);
    } catch (error) {
      console.error("Error filling faculty courses:", error);
      process.exit(1);
    }
  }

  const deleteAllFeedback = async () => {
    try {
      // Connect to MongoDB
      await connectDB();
      console.log("Connected to MongoDB, starting feedback deletion process...");
      
      // Delete all feedback documents
      const result = await Feedback.deleteMany({});
      
      console.log(`Successfully deleted ${result.deletedCount} feedback documents.`);
      process.exit(0);
    } catch (error) {
      console.error("Error deleting feedback:", error);
      process.exit(1);
    }
  }

  const clearAllCourseAnnouncements = async () => {
    try {
      // Connect to MongoDB
      await connectDB();
      console.log("Connected to MongoDB, starting announcement clearing process...");
      
      // Update all course documents by setting their announcements array to empty
      const result = await Course.updateMany(
        {}, // Empty filter means select all documents
        { $set: { announcements: [] } } // Set announcements to an empty array
      );
      
      console.log(`Successfully cleared announcements for ${result.modifiedCount} course documents.`);
      process.exit(0);
    } catch (error) {
      console.error("Error clearing course announcements:", error);
      process.exit(1);
    }
  }

  const checkFeedBackExists = async () => {
    try {
      // Connect to MongoDB
      await connectDB();
      console.log("Connected to MongoDB, checking feedback existence...");
      
      // Check if feedback exists for the course CS101
      const feedbackExists = await Feedback.exists({ 
        student: "67fb82e1fd693835a24dd232",
        faculty: "6800f94ff45d8abf4fb94ba9",
        course: "67fe39a36530a0d8bd12cfa4"
       });
      
      if (feedbackExists) {
        console.log("Feedback exists for course CS101.");
      } else {
        console.log("No feedback found for course CS101.");
      }
      
      process.exit(0);
    } catch (error) {
      console.error("Error checking feedback existence:", error);
      process.exit(1);
    }
  }

  const completeCourse = async () => {
    try {
      // Connect to MongoDB
      await connectDB();
      console.log("Connected to MongoDB, starting course completion process...");
      
      // Find the course with code CS101
      const course = await StudentCourse.findOne({ courseId: "CS101" });
      console.log("Course found:", course);
      if (!course) {
        console.log("Course CS101 not found!");
        process.exit(1);
      }
      
      // console.log(`Found course: ${course.courseName} with ${course.students.length} students enrolled`);
      
      // Update the course to be completed
      const updatedCourse = await StudentCourse.findByIdAndUpdate(
        course._id,
        { isCompleted: true },
        { new: true }
      );
      
      console.log(`Successfully marked ${updatedCourse.courseCode} - ${updatedCourse.courseName} as completed`);
      
      console.log("Course completion process completed successfully!");
      process.exit(0);
    } catch (error) {
      console.error("Error completing course:", error);
      process.exit(1);
    }
  }

  const fixFeedbackIndexes = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log("Connected to MongoDB, starting feedback index fix process...");
    
    // Drop the problematic index
    await Feedback.collection.dropIndex("feedbackId_1");
    console.log("Successfully dropped the feedbackId index");
    
    // Verify indexes
    const indexes = await Feedback.collection.indexes();
    console.log("Updated indexes:", indexes);
    
    process.exit(0);
  } catch (error) {
    console.error("Error fixing feedback indexes:", error);
    process.exit(1);
  }
  }

  export {fixFeedbackIndexes, seedDatabase, seedStudentCourses, seedCourses, removeAllStudentsFromCourse, seedFacultyCourses, fillFacultyCourse };
seedDatabase()