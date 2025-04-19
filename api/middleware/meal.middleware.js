import { User } from "../models/user.model.js";
import { Student } from "../models/student.model.js";

export const validateMealAccess = async (req, res, next) => {
  try {

    const userCookie = req.cookies.user || req.cookies.userData;
    
    if (!userCookie) {
      return res.status(401).json({ message: "Authentication required" });
    }

    let userData;
    try {
      userData = typeof userCookie === 'string' ? JSON.parse(userCookie) : userCookie;
    } catch (error) {
      console.error("Cookie parsing error:", error);
      return res.status(401).json({ message: "Invalid authentication data" });
    }

    if (!userData.email || !userData.userId) {
      return res.status(401).json({ message: "Invalid authentication data" });
    }

    const user = await User.findById(userData.userId).select('-password -refreshToken');
    
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    
    req.user = {
      _id: user._id,
      email: user.email,
      role: userData.role
    };
    
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Middleware to check if user is a student
export const isStudent = async (req, res, next) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (req.user.role !== 'student') {
      return res.status(403).json({ message: "Access denied. Student role required." });
    }

    const student = await Student.findOne({ userId: req.user._id });
    
    if (!student) {
      return res.status(403).json({ message: "Student record not found." });
    }
    
    // Attach student to request object for easy access in controllers
    req.student = student;
    next();
  } catch (error) {
    console.error("Student check middleware error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Middleware to check if user is a meal admin
export const isMealAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (req.user.role !== 'nonAcadAdmin') {
      return res.status(403).json({ message: "Access denied. Admin role required." });
    }
    
    next();
  } catch (error) {
    console.error("Admin check middleware error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};