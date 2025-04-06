import express from "express";
import { connectDB } from "./database/mongoDb.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "../api/routes/auth.route.js";

dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(cors({origin:"http://localhost:3000", credentials:true}));
app.use(express.json());
app.use(cookieParser());
app.use(authRouter);

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Start server with database connection
const startServer = async () => {
  try {
    await connectDB();
    app.listen(8000, () => {
      console.log(`Backend server is running on port ${8000}`);
    });
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();