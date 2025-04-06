import { connectDB } from "../database/mongoDb.js";
import { User} from "../models/user.model.js";
import { Student } from "../models/student.model.js"; 
import bcrypt from "bcrypt"; // Import the bcrypt library


// Sample user data
const userData = {
  name: "John Doe",
  email: "testStudent@iitg.ac.in",
  password: "password123", // In a real app, you should hash this
  refreshToken: "sample-refresh-token-1",
  contactNo: "1234567890",
  isVerified: true
};

// Function to seed data
const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    console.log("Connected to MongoDB, starting seed process...");

    // Generate a salt
    const saltRounds = 10; // You can adjust this number for more or less security (higher is more secure but slower)
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

    // Create user with the hashed password
    const createdUser = await User.create({
      ...userData, // Spread the existing userData
      password: hashedPassword, // Override the plain text password with the hashed one
    });
    console.log("User created:", createdUser.name, "with email:", createdUser.email);

    // Create a student with the same email
    const student = await Student.create({
      userId: createdUser._id,
      registerNo: "CS2023001",
      department: "Computer Science",
      semester: 3,
      batch: "2023-2027",
      program: "BTech",
      status: "active"
    });
    console.log("Student created with register number:", student.registerNo);
    console.log("Student is linked to user with email:", createdUser.email);

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

// Run the seeding function
seedDatabase();