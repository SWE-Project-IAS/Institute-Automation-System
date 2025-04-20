import express from "express";
import { connectDB } from "./database/mongoDb.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import authRoute from "../api/routes/auth.route.js";
import hostelRoute from "../api/routes/hostel.route.js";
import studentRoute from "../api/routes/student.route.js";
import complaintsRouter from "../api/routes/complaints.route.js";
import createCourseRoute from "../api/routes/createCourse.route.js";
import acadAdminRoute from "../api/routes/acadAdmin.route.js";
import facultyRoute from "../api/routes/faculty.route.js";
import feedbackRoute from "../api/routes/feedback.route.js";
// import { fillFacultyCourse, seedStudentCourses, seedCourses, removeAllStudentsFromCourse } from "../api/scripts/seedDb.js";
// import {fillFacultyCourse, seedDatabase, seedStudentCourses, seedCourses, seedFacultyCourses, fillFacultyCourse } from "../api/scripts/seedDb.js";
// import { fillFacultyCourse, seedStudentCourses, seedCourses, seedFacultyCourses } from "../api/scripts/seedDb.js";
import seedSupportStaff from "./scripts/seedSupportStaff.js";
import attendanceRoute from "../api/routes/attendance.route.js"
import assignmentRoute from "../api/routes/assignment.route.js"
import gradeRoute from "../api/routes/grade.route.js";

import Razorpay from "razorpay";
import crypto from "crypto"; // Needed for signature verification (production)

const __dirname = path.resolve(); // Get the current directory name

const app = express();
dotenv.config(); // Load environment variables first

// index.js
// const cors = require("cors");


app.use(cors({
  origin: "http://localhost:3000", 
  credentials: true, 
  exposedHeaders: ['Authorization'] // This explicitly exposes the Authorization header
}));
app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());

app.use('/uploads/complaints', express.static(path.join(process.cwd(), 'uploads/complaints')));

app.use("/api/auth",authRoute);
app.use("/api/hostel",hostelRoute);
app.use("/api/student",studentRoute);
app.use("/api/course",createCourseRoute);
app.use("/api/faculty",facultyRoute);
app.use("/api/acadadmin", acadAdminRoute);
app.use("/api/feedback", feedbackRoute);
app.use("/api/course",createCourseRoute);

app.use("/api/acadadmin", acadAdminRoute);
app.use("/api/attendancelanding", attendanceRoute);
app.use("/api/assignment", assignmentRoute);
app.use("/api/grades", gradeRoute);
app.use('/api/complaints', complaintsRouter);
 

// --- Middleware ---
app.use(express.urlencoded({ extended: true,limit: '5mb' }));

// app.use(express.static(path.join(__dirname, "/client/dist")));
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "client","dist","index.html"));
// });

// --- Initialize Razorpay ---
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Endpoint to create a Razorpay order
app.post("/api/payment/create-order", async (req, res) => {
  const { amount, currency = "INR" } = req.body; // Get amount from request body

  if (!amount) {
    return res.status(400).json({ error: "Amount is required" });
  }

  // Razorpay expects amount in the smallest currency unit (e.g., paise for INR)
  const amountInPaise = Number(amount) * 100;

  const options = {
    amount: amountInPaise,
    currency: currency,
    receipt: `receipt_order_${Date.now()}`, // Unique receipt ID
  };

  try {
    console.log("Creating Razorpay order with options:", options);
    const order = await razorpay.orders.create(options);
    console.log("Razorpay order created:", order);
    // Send back essential order details to the frontend
    res.json({
      orderId: order.id,
      currency: order.currency,
      amount: order.amount, // Amount is in paise
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res
      .status(500)
      .json({ error: "Failed to create order", details: error.message });
  }
});

// Endpoint for Payment Verification (IMPORTANT FOR PRODUCTION)
// In this test setup, we rely on the frontend handler, but this endpoint
// shows the structure for secure server-side verification.
app.post("/api/payment/verify", (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;
  const secret = process.env.RAZORPAY_KEY_SECRET;

  console.log("Verification Request Body:", req.body);

  const shasum = crypto.createHmac("sha256", secret);
  shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
  const digest = shasum.digest("hex");

  if (digest === razorpay_signature) {
    console.log("Payment verification successful");
    // TODO: Update your database here - mark order as paid
    res.json({
      status: "success",
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
    });
  } else {
    console.error("Payment verification failed");
    res.status(400).json({ status: "failure", message: "Invalid signature" });
  }
});

// Start server with database connection
const startServer = async () => {
  try {
    await connectDB();
    
    // Seed support staff data
    // await seedSupportStaff();
    
    app.listen(process.env.PORT ||8000, () => {
      console.log(`Backend server is running on port ${8000}`);
      if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        console.warn(
          "WARNING: Razorpay API keys not found in .env file. Payment integration will fail."
        );
      }
    });
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();

export {app}

// const runSeeds = async () => {
//   try {
//     await seedCourses();
//     // await seedStudentCourses();
//     // await seedCourses();
//     // seedFacultyCourses();
//     // removeAllStudentsFromCourse();
//     console.log("All seeding completed successfully!");
//   } catch (error) {
//     console.error("Error during seeding:", error);
//   }
// };

// runSeeds();
