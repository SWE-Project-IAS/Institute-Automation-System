import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RoleContext } from "../../context/Rolecontext";
import { FaBookOpen, FaPlus, FaClipboardList, FaSpinner } from "react-icons/fa";

export default function AssignmentLanding() {
  const { role } = useContext(RoleContext);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const userId = currentUser?.data?.user?.userId;
  
  useEffect(() => {
    if (!userId) {
      alert("Please log in first.");
      navigate("/login");
      return;
    }
    
    const fetchCourses = async () => {
      setLoading(true);
      try {
        console.log(userId)
        const response = await fetch(
          `https://ias-server-cpoh.onrender.com/api/assignment/${role}/${userId}/courses`
        );
        const data = await response.json();
        if (response.ok) {
          setCourses(data.courses);
        } else {
          alert("Failed to fetch courses");
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
        alert("Failed to connect to the server.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourses();
  }, [role, userId, navigate]);
  
  return (
    <div className="px-4 py-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        {role === "faculty" ? "My Faculty Courses" : "My Courses"}
      </h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <FaSpinner className="animate-spin text-blue-500 text-4xl" />
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <p className="text-xl text-gray-600">No courses found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div
              key={course.courseCode}
              className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 flex flex-col"
            >
              {/* Header - Same height for all cards */}
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <FaBookOpen className="text-blue-600 text-xl" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 line-clamp-1">
                    {course.courseName}
                  </h2>
                  <p className="text-sm text-gray-600">
                    Code:{" "}
                    <span className="font-medium text-gray-800">
                      {course.courseCode}
                    </span>
                  </p>
                </div>
              </div>
              
              {/* Spacer to push buttons to bottom */}
              <div className="flex-grow"></div>
              
              {/* Actions - Now aligned at the bottom */}
              <div className="mt-4 space-y-3">
                {role === "faculty" ? (
                  <>
                    <button
                      onClick={() =>
                        navigate(`/course/${course.courseCode}/create-assignment`)
                      }
                      className="w-full flex items-center justify-center gap-2 bg-green-500 text-white py-2 px-4 rounded-md font-medium hover:bg-green-600 transition"
                    >
                      <FaPlus /> Create Assignment
                    </button>
                    <button
                      onClick={() =>
                        navigate(`/course/${course.courseCode}/assignments`)
                      }
                      className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-600 transition"
                    >
                      <FaClipboardList /> View Assignments
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() =>
                      navigate(`/course/${course.courseCode}/assignments`)
                    }
                    className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-600 transition"
                  >
                    <FaClipboardList /> View Assignments
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}