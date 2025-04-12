import mongoose from 'mongoose';

// Get MongoDB URI from environment variables

// MongoDB connection function
const connectDB = async () => {
    const MONGODB_URI = process.env.MONGODB_URI;
  try {
    const conn = await mongoose.connect(MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

// Export mongoose as well
export { mongoose,connectDB };