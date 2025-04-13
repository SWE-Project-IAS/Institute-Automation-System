import mongoose from 'mongoose';

// Get MongoDB URI from environment variables

// MongoDB connection function
const connectDB = async () => {
    try {
    //   console.log(process.env.MONGODB_URI);
    // const conn = await mongoose.connect(process.env.MONGODB_URI);
    const conn = await mongoose.connect("mongodb+srv://divyansh:KrHRg7mgeh7tgNiU@cluster0.qhaz53w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

// Export mongoose as well
export { mongoose,connectDB };