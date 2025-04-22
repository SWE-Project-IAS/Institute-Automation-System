import mongoose from 'mongoose';

// Get MongoDB URI from environment variables

// MongoDB connection function
const connectDB = async () => {
    try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    // mongoose.connection.
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

// Function to close database connection
const closeDB = async () => {
  if (mongoose.connection.readyState!=0) {  // Check if connection is open
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
};

// Function to reset connection to test database
const resetDBConnectionForTests = async (testDbUri) => {
  // Close existing connection if any
  await closeDB();
  
  // Connect to test database
  return connectDB(testDbUri);
};

// Export mongoose as well
export { mongoose,connectDB,closeDB,resetDBConnectionForTests };
