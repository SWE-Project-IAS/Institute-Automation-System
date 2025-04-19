import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const { token } = useParams();
  const navigate = useNavigate();

  // Validate token on component mount
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setError("Invalid token");
        return;
      }
      
      // For now, we'll just continue with the UI flow
      // You could add an API endpoint to validate the token if needed
    };
    
    validateToken();
  }, [token]);

  const handleResetPassword = async () => {
    // Reset states
    setError("");
    
    // Validate password
    if (!password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Fixed: Added quotes around the URL
      const response = await axios.post(`https://ias-server-cpoh.onrender.com/api/auth/reset-password/${token}`, {
        password
      });
      
      if (response.status === 200) {
        setIsSuccess(true);
        // Redirect to login page after 3 seconds
        setTimeout(() => {
          navigate("/");
        }, 3000);
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      if (error.response) {
        // Get specific error message from server if available
        setError(error.response.data.message || "Failed to reset password");
      } else if (error.request) {
        // The request was made but no response received
        setError("No response from server. Please try again later.");
      } else {
        // Something happened in setting up the request
        setError("Failed to process your request. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100" style={{ backgroundImage: "url('iit-g.jpg')" }}>
      <div className="w-96 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-center mb-4">Reset Your Password</h2>
        
        {isSuccess ? (
          <div className="text-center">
            <p className="text-green-600 mb-2">Your password has been reset successfully!</p>
            <p className="text-gray-600">Redirecting to login page...</p>
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
                {error}
              </div>
            )}
            
            <div className="mb-4">
              <label className="block text-sm font-medium">New Password</label>
              <input
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 p-2 border rounded w-full"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium">Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 p-2 border rounded w-full"
              />
            </div>
            
            <button
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
              onClick={handleResetPassword}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Reset Password"}
            </button>
            
            <div className="mt-4 text-center">
              <button 
                className="text-blue-500 hover:underline"
                onClick={() => navigate("/")}
              >
                Back to Login
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}