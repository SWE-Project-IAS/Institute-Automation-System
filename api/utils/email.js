import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const sendPasswordResetEmail = async (email, resetURL) => {
  try {
    // Create transporter with Gmail settings
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    // Define email options
    const mailOptions = {
      from: `Institute Automation <${process.env.EMAIL_USERNAME}>`, // Sender address
      to: email, // List of receivers (can work with any domain, including Outlook)
      subject: 'Password Reset Request (valid for 10 min)', // Subject line
      text: `Forgot your password? Submit a new password at: ${resetURL}\n\nIf you didn't forget your password, please ignore this email.`, // Plain text body
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 5px;">
          <h2 style="color: #0056b3;">Password Reset Request</h2>
          <p>You requested a password reset for your Institute Automation account.</p>
          <p>Please click the button below to set a new password. This link is valid for 10 minutes only.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetURL}" style="background-color: #0056b3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
          </div>
          <p style="color: #666;">If you didn't request this password reset, please ignore this email or contact support if you have concerns.</p>
          <hr style="border: none; border-top: 1px solid #e1e1e1; margin: 20px 0;">
          <p style="font-size: 12px; color: #999;">This is an automated message, please do not reply to this email.</p>
        </div>
      ` // HTML body
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    //console.log('Password reset email sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};