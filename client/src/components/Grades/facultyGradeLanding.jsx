import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RoleContext } from "../../context/Rolecontext";
import { FaBookOpen } from "react-icons/fa";

export default function FacultyGradeLanding() {
  const { role } = useContext(RoleContext); // Use role context
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  // Get the current user's data from localStorage or Context
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const userId = currentUser?.data?.user?.userId; // Assuming the user object in localStorage contains userId

  useEffect(() => {
    console.log("User ID:", userId);
    console.log("Role:", role);
    if (!userId) {
      alert("Please log in first.");
      navigate("/login");
      return;
    }

    // Fetch courses based on the userId and role
    const fetchCourses = async () => {
      try { 
        const response = await fetch(`${process.env.REACT_APP_API_URL}/grades/${role}/${userId}/courses`);
        const data = await response.json();
        if (response.ok) {
          setCourses(data.courses); // Assuming the response contains an array of courses
        } else {
          alert("Failed to fetch courses");
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
        alert("Failed to connect to the server.");
      }
    };

    fetchCourses();
  }, [role, userId]);

  return (
    <div className="m-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        {role === "faculty" ? "My Faculty Courses" : "My Courses"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => {
          // Filter assignments for the specific course

          return (
            <div
              key={course.courseCode}
              className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition duration-300"
            >
              {/* Course Title and Icon */}
              <div className="flex items-center gap-3 mb-4">
                <FaBookOpen className="text-blue-500 text-3xl" />
                <h2 className="text-2xl font-semibold text-gray-900">{course.courseName}</h2>
              </div>

              {/* Course Code */}
              <p className="text-gray-600 text-sm font-medium mb-3">
                Course Code: <span className="text-gray-800">{course.courseCode}</span>
              </p>

             
            <div className="space-y-3">
                
                {/* View Assignments */}
                <button
                onClick={() => navigate(`/course/${course.courseCode}/submitGrades`)}
                className="block text-center bg-blue-500 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-600 transition duration-300"
                >
                Submit Grades
                </button>
            </div>
              
                
            </div>
          );
        })}
      </div>
    </div>
  );
}
