import { connectDB } from "../database/mongoDb.js";
import { User} from "../models/user.model.js";
import { Student } from "../models/student.model.js"; 
import bcrypt from "bcrypt"; // Import the bcrypt library
import { HostelAdmin } from "../models/hostelAdmin.model.js";
import { AcadAdmin } from "../models/acadAdmin.model.js";
import { Faculty } from "../models/faculty.model.js";


// Sample user data
const userData = {
  name: "John Doe",
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
// Function to seed data
const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    console.log("Connected to MongoDB, starting seed process...");

    // Generate a salt
    const saltRounds = 10; // You can adjust this number for more or less security (higher is more secure but slower)
    const hashedPassword = await bcrypt.hash(facultyData.password, saltRounds);
    
    // Create user with the hashed password
    const createdFacultyUser = await User.create({
      ...facultyData, // Spread the existing facultyData
      password: hashedPassword, // Override the plain text password with the hashed one
    });
    console.log("User created:", createdFacultyUser.name, "with email:", createdFacultyUser.email);
    
    // Create a faculty with the same email
    const faculty = await Faculty.create({
          userId: createdFacultyUser._id,
          email: facultyData.email,
          department: facultyData.department,
          designation: facultyData.designation,
          courses: facultyData.courses,
          specialization: facultyData.specialization,
          qualifications: facultyData.qualifications,
          status: facultyData.status,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        console.log("Faculty created with designation:", faculty.designation);
        console.log("Faculty is linked to user with email:", createdFacultyUser.email);

    // const hashedPassword = await bcrypt.hash(acadAdminData.password, saltRounds);
    
    // // Create user with the hashed password
    // const createdAcadAdminUser = await User.create({
    //   ...acadAdminData, // Spread the existing acadAdminData
    //   password: hashedPassword, // Override the plain text password with the hashed one
    // });
    // console.log("User created:", createdAcadAdminUser.name, "with email:", createdAcadAdminUser.email);
    
    // // Create an academic admin with the same email
    // const acadAdmin = await AcadAdmin.create({
    //       userId: createdAcadAdminUser._id,
    //       email: acadAdminData.email,
    //       designation: acadAdminData.designation,
    //       qualifications: acadAdminData.qualifications,
    //       status: acadAdminData.status,
    //       createdAt: new Date(),
    //       updatedAt: new Date()
    //     });
    //     console.log("Academic Admin created with designation:", acadAdmin.designation);
    //     console.log("Academic Admin is linked to user with email:", createdAcadAdminUser.email);

    // const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
    
    // // Create user with the hashed password
    // const createdUser = await User.create({
    //   ...userData, // Spread the existing userData
    //   password: hashedPassword, // Override the plain text password with the hashed one
    // });
    // console.log("User created:", createdUser.name, "with email:", createdUser.email);
    
    // // Create a student with the same email
    // const student = await Student.create({
    //       userId: createdUser._id,
    //       hostel: "Lohit",
    //       rollNo: "220101039",
    //       email: "testStudent@iitg.ac.in",
    //       department: "Computer Science and Engineering",
    //       semester: 3,
    //       batch: "2023-2027",
    //       program: "BTech",
    //       status: "active",
    //       roomNo: "D-234",
    //       createdAt: new Date(),
    //       updatedAt: new Date()
    //     });
    //     console.log("Student created with register number:", student.registerNo);
    //     console.log("Student is linked to user with email:", createdUser.email);
        
    // const hashedPassword2 = await bcrypt.hash(nonAcadAdminData.password, saltRounds);
    // console.log("Hashed password for non-academic admin:", hashedPassword2);
    // // Create the Non-Academic Admin User
    // const createdHabUser = await User.create({
    //     ...nonAcadAdminData,
    //     password: hashedPassword2,
    // });
    // console.log("Non-Academic Admin User created:", createdHabUser.name, "with email:", createdHabUser.email);

    // // Now create the HostelAdmin entry
    // const createdHab = await HostelAdmin.create({
    //     userId: createdHabUser._id,     // Link to created User
    //     email: createdHabUser.email,    // Same email
    //     status: "active",               // or "on-leave" / "inactive" if you want
    // });
    // console.log("HostelAdmin created:", createdHab.email);

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

// Run the seeding function
seedDatabase();