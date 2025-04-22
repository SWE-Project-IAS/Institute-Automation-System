import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RoleContext } from "../../context/Rolecontext";
import axios from "axios";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRoleInput] = useState("");
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [resetEmail, setResetEmail] = useState("");
    const [resetSuccess, setResetSuccess] = useState(false);
    const navigate = useNavigate();

    const { setRole } = useContext(RoleContext);

    const handleLogin = async () => {
        if (!email || !password || !role) {
            alert("All fields are required!");
            return;
        }
        const emailRegex = /^[a-zA-Z.]+@iitg\.ac\.in$/;
        if (!emailRegex.test(email)) {
            alert("Please enter a valid IITG email address!");
            return;
        }
        console.log({ email, role });
        try {
            const user = {
                email: email,
                password: password,
                role: role
            }

            const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, user, {
                withCredentials: true,
            });

            const data = response.data;

            console.log(data);
            if (response) {
                console.log("Login successful:", data);
                localStorage.setItem("currentUser", JSON.stringify({ data, role }));
                setRole(role);
                navigate("/profile", { role });
            } else {
                alert(`Login failed: ${data.message || "Unknown error"}`);
            }
        } catch (error) {
            console.error("Error logging in:", error);
            alert("Invalid Credentials.");
        }
    };

    const handlePasswordReset = async () => {
        const emailRegex = /^[a-zA-Z.]+@iitg\.ac\.in$/;
        if (!resetEmail) {
            alert("Please enter your email address!");
            return;
        }
        if (!emailRegex.test(resetEmail)) {
            alert("Please enter a valid email address!");
            return;
        }
    
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/forgot-password`, {
                email: resetEmail
            });
    
            if (response.status === 200) {
                setResetSuccess(true);
            }
        } catch (error) {
            console.error("Error requesting password reset:", error);
            
            if (error.response) {
                console.error("Error data:", error.response.data);
                console.error("Error status:", error.response.status);
                alert(`Error: ${error.response.data.message || "Failed to process your request"}`);
            } else if (error.request) {
                console.error("No response received:", error.request);
                alert("Server did not respond. Please check your connection.");
            } else {
                alert("Failed to process your request. Please try again later.");
            }
        }
    };
    
    if (isForgotPassword) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100" style={{ backgroundImage: "url('iit-g.jpg')" }}>
                <div className="w-96 bg-white p-6 rounded-lg shadow-lg">
                    <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">INSTITUTE AUTOMATION SYSTEM</h1>
                    <h2 className="text-xl font-semibold text-center mb-4">Reset Password</h2>
                    
                    {resetSuccess ? (
                        <div className="text-center">
                            <p className="text-green-600 mb-4">Password reset link has been sent to your email!</p>
                            <button 
                                onClick={() => {setIsForgotPassword(false); setResetSuccess(false);}}
                                className="text-blue-500 hover:underline"
                            >
                                Return to login
                            </button>
                        </div>
                    ) : (
                        <>
                            <p className="mb-4 text-sm text-gray-600">
                                Enter your email address below. We'll send you a link to reset your password.
                            </p>
                            <div className="mb-4">
                                <label className="block text-sm font-medium">IITG Email</label>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={resetEmail}
                                    onChange={(e) => setResetEmail(e.target.value)}
                                    className="mt-1 p-2 border rounded w-full"
                                />
                            </div>
                            <button 
                                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mb-4" 
                                onClick={handlePasswordReset}
                            >
                                Send Reset Link
                            </button>
                            <div className="text-center">
                                <button 
                                    onClick={() => setIsForgotPassword(false)}
                                    className="text-blue-500 hover:underline"
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

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100" style={{ backgroundImage: "url('iit-g.jpg')" }}>
            <div className="w-96 bg-white p-6 rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">INSTITUTE AUTOMATION SYSTEM</h1>
                <h2 className="text-xl font-semibold text-center mb-4">Login</h2>
                <div className="mb-4">
                    <label className="block text-sm font-medium">Email</label>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 p-2 border rounded w-full"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium">Password</label>
                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full mt-1 p-2 border rounded"
                    />
                    <div className="text-right mt-1">
                        <button 
                            onClick={() => setIsForgotPassword(true)}
                            className="text-sm text-blue-500 hover:underline"
                        >
                            Forgot Password?
                        </button>
                    </div>
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium">Role</label>
                    <select
                        value={role}
                        onChange={(e) => setRoleInput(e.target.value)}
                        className="w-full mt-1 p-2 border rounded"
                    >
                        <option value="" disabled>Select your role</option>
                        <option value="student">Student</option>
                        <option value="faculty">Faculty</option>
                        <option value="acadAdmin">Academic Admin</option>
                        <option value="nonAcadAdmin">Hostel Admin</option>
                    </select>
                </div>
                <button className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600" onClick={handleLogin}>Login</button>
            </div>
        </div>
    );
}
