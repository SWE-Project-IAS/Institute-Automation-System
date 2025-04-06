import express from "express";
import { connectDB } from "./database/mongoDb.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import authRoute from "../api/routes/auth.route.js";
import hostelRoute from "../api/routes/hostel.route.js";

import Razorpay from "razorpay";
import crypto from "crypto"; // Needed for signature verification (production)

const app = express();
dotenv.config(); // Load environment variables first

// index.js
// const cors = require("cors");


app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth",authRoute);
app.use("/api/hostel",hostelRoute);

const port = process.env.PORT || 8000;

// --- Middleware ---
app.use(express.urlencoded({ extended: true }));

// --- Initialize Razorpay ---
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// --- Routes ---

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

// try{
//     // console.log(process.env.MONGO_URI)
//     await mongoose.connect(process.env.MONGO_URI);
//     console.log("Connected to mongoDb")
// }catch(err){
//     console.log(err);
// }

// app.use("/api/auth",authRoute);

// app.use((err,req,res,next)=>{
//     const errorStatus=err.status||500;
//     const errorMessage=err.message||"Something went wrong!";

//     return res.status(errorStatus).send(errorMessage);
// })


// Start server with database connection
const startServer = async () => {
  try {
    await connectDB();
      app.listen(port, () => {
      console.log(`Backend server is running on port ${port}`);
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
