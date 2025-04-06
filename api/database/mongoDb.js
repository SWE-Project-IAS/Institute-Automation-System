import mongoose from 'mongoose';

// Connection options
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

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