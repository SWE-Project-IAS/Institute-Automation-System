import mongoose from 'mongoose';

// Get MongoDB URI from environment variables
const MONGODB_URI = "mongodb+srv://kevintj916:VvLxpm85TJLuxr0B@institutionautomationcl.bn7xvyp.mongodb.net/?retryWrites=true&w=majority&appName=institutionAutomationclu";

// Connection options
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// MongoDB connection function
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI, options);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

// Export mongoose as well
export { mongoose,connectDB };