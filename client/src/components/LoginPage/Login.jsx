import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { RoleContext } from "../../context/Rolecontext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRoleInput] = useState("");

  const { setRole } = useContext(RoleContext);

  const navigate = useNavigate();

  const handleLogin = async () => {
    // if (!email || !password || !role) {
    //     alert("All fields are required!");
    //     return;
    // }
    // console.log({ email, password, role });
    // try {
    //   const response = await fetch("http://localhost:8000/api/auth/login", {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify({ email, password, role }),
    //   });

    //   const data = await response.json();

    //   if (response.ok) {
    //       console.log("Login successful:", data);
    //       setRole(data.user.role);
    //       navigate("/profile", { state: { role } });
    //   } else {
    //     alert(`Login failed: ${data.message || "Unknown error"}`);
    //   }
    // } catch (error) {
    //     console.error("Error logging in:", error);
    //     alert("Failed to connect to the server.");
    // }
    
    navigate("/profile", { state: {role}});
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
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Role</label>
          <select
            value={role}
            onChange={(e) => setRoleInput(e.target.value)}
            className="w-full mt-1 p-2 border rounded"
          >
            <option value="" disabled selected>Select your role</option>
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