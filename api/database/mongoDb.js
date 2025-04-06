import mongoose from 'mongoose';

// Get MongoDB URI from environment variables
const MONGODB_URI="mongodb+srv://divyansh:KrHRg7mgeh7tgNiU@cluster0.qhaz53w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// MongoDB connection function
const connectDB = async () => {
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