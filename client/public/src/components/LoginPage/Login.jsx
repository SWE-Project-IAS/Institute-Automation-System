import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const navigate = useNavigate();

  const handleLogin = () => {
    if (!email || !password || !role) {
        alert("All fields are required!");
        return;
    }
    console.log({ email, password, role });
    navigate("/", { state: { role } });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-96 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-center mb-4">Login</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 p-2 border rounded mr-2"
          /> @iitg.ac.in
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
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full mt-1 p-2 border rounded"
          >
            <option value="" disabled selected>Select your role</option>
            <option value="student">Student</option>
            <option value="faculty">Faculty</option>
            <option value="academic-admin">Academic Admin</option>
            <option value="hostel-admin">Hostel Admin</option>
          </select>
        </div>
        <button className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600" onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
}