import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { User } from '../models/user.model.js';
import { Faculty } from '../models/faculty.model.js';
import { Student } from '../models/student.model.js';
import { AcadAdmin } from '../models/acadAdmin.model.js';
import { HostelAdmin } from '../models/hostelAdmin.model.js';
import { validateAccessToken, validateRefreshToken } from '../middleware/auth.middleware.js';
import { findUserByEmail, verifyRefreshTokenInDB } from '../middleware/auth.middleware.js';
import { sendPasswordResetEmail } from '../utils/email.js';


export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        // Validate input (can be moved to a separate middleware if needed)
        if (!email || !password || !role) {
            return res.status(400).json({ message: 'Email, password, and role are required' });
        }

        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        let specificUser;
        switch (role) {
            case 'student':
                specificUser = await Student.findOne({ userId: user._id }); // Assuming Student model is defined
                break;
            case 'acadAdmin':
                specificUser = await AcadAdmin.findOne({ userId: user._id });     // Assuming Admin model is defined
                break;
            case 'faculty':
                specificUser = await Faculty.findOne({ userId: user._id });   // Assuming Faculty model is defined
                break;
            case 'nonAcadAdmin':
                specificUser = await HostelAdmin.findOne({ userId: user._id }); // Assuming HostelAdmin model is defined
                break;

            default:
                return res.status(400).json({ message: 'Invalid role' });
        }

        if (!specificUser) {
            return res.status(401).json({ message: 'Invalid role' });
        }

        const accessToken = jwt.sign({ user: { email: user.email, role: role } }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
        const refreshToken = jwt.sign({ user: { email: user.email, role: role } }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });

        // Save refresh token to the database
        user.refreshToken = refreshToken;
        await user.save();

        console.log(accessToken)

        // res.cookie('refreshToken', refreshToken, { httpOnly: false, sameSite: 'none' });

        return res.status(200)
            .cookie('user', JSON.stringify({ email: user.email, userId: user._id, role:role }), { httpOnly: false, sameSite: 'none', maxAge: 1000 * 60 * 60 * 24, secure: true }) // Set cookie to expire in 1 day
            .cookie('refreshToken', refreshToken, { httpOnly: false, sameSite: 'none', maxAge: 1000 * 60 * 60 * 24, secure: true }) // Set cookie to expire in 1 day
            .cookie('accessToken', accessToken, { httpOnly: false, sameSite: 'none', maxAge: 1000 * 60 * 60 * 24, secure: true }) // Set cookie to expire in 1 hour
            .header('Authorization', accessToken)
            .json({ user: { email: user.email, userId: user._id } });

    } catch (err) {
        console.error("Error during login:", err);
        return res.status(500).send("Something went wrong!");
    }
};

export const refresh = [
    validateRefreshToken,
    findUserByEmail,
    verifyRefreshTokenInDB,
    async (req, res) => {
        try {
            const accessToken = jwt.sign({ user: { email: req.foundUser.email, role: req.foundUser.role } }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
            return res.status(200)
                .header('Authorization', accessToken)
                .json({ user: { email: req.foundUser.email, role: req.foundUser.role } });
        } catch (error) {
            console.error("Error during refresh:", error);
            return res.status(500).send("Internal server error");
        }
    }
];

export const logout = [
    validateAccessToken,
    async (req, res) => {
        try {
            // req.foundUser.refreshToken = null;
            // await req.foundUser.save();

            res.clearCookie('refreshToken', { httpOnly: false, sameSite: 'strict' });
            res.clearCookie('accessToken', { httpOnly: false, sameSite: 'strict' });
            res.clearCookie('user', { httpOnly: false, sameSite: 'strict' });

            return res.status(200).json({ message: "Logout successful" });

        } catch (error) {
            console.error("Error during logout:", error);
            return res.status(500).send("Something went wrong!");
        }
    }
];

// New forgotPassword function
export const forgotPassword = async (req, res) => {
    try {
      const { email } = req.body;
      
      // Validate email
      const emailRegex = /^[a-zA-Z.]+@iitg\.ac\.in$/;
      if (!email || !emailRegex.test(email)) {
        return res.status(400).json({ message: "Please provide a valid email address" });
      }
      
      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Generate a reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      
      // Hash the token before saving
      const hashedToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
      
      // Save the token to the user document with expiration
      user.passwordResetToken = hashedToken;
      user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
      await user.save({ validateBeforeSave: false });
      
      // Create reset URL
      const resetURL = `http://localhost:3000/reset-password/${resetToken}`;
      
      // Send email with reset link
      await sendPasswordResetEmail(user.email, resetURL);
      
      res.status(200).json({
        status: 'success',
        message: 'Password reset link sent to email'
      });
    } catch (error) {
      console.error('Password reset error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to send password reset email'
      });
    }
  };
  
  // New resetPassword function
  export const resetPassword = async (req, res) => {
    try {
      // Get token from URL parameter
      const { token } = req.params;
      const { password } = req.body;
      
      // Hash the token from the URL to compare with stored hashed token
      const hashedToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');
      
      // Find user with the token and check if token hasn't expired
      const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
      });
      
      // If token is invalid or expired
      if (!user) {
        return res.status(400).json({
          status: 'error',
          message: 'Token is invalid or has expired'
        });
      }
      
      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      // Update user password
      user.password = hashedPassword;
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      
      // Save the user with the new password
      await user.save();
      
      res.status(200).json({
        status: 'success',
        message: 'Password has been reset successfully'
      });
    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to reset password'
      });
    }
  };