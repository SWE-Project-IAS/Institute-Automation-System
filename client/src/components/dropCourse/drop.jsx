import { Link } from "react-router-dom";
import { useState } from "react";
import { FaBookOpen, FaClipboardList, FaTrash, FaBullhorn } from "react-icons/fa";

export default function DropCourse() {
  // Example student object with current courses
  // In a real application, this would likely come from props or a context
  const [studentCourses, setStudentCourses] = useState([
    {
      id: "CS101",
      name: "Introduction to Computer Science",
      assignments: [
        { id: "a1", title: "Variables and Data Types" },
        { id: "a2", title: "Control Structures" }
      ],
      announcements: 3
    },
    {
      id: "MATH202",
      name: "Calculus II",
      assignments: [
        { id: "a1", title: "Derivatives" },
        { id: "a2", title: "Integrals" },
        { id: "a3", title: "Series and Sequences" }
      ],
      announcements: 2
    },
    {
      id: "ENG105",
      name: "Academic Writing",
      assignments: [
        { id: "a1", title: "Essay Structure" },
        { id: "a2", title: "Research Methods" }
      ],
      announcements: 5
    }
  ]);

  // Function to handle dropping a course
  const handleDropCourse = (courseId) => {
    // Show confirmation dialog
    if (window.confirm("Are you sure you want to drop this course? This action cannot be undone.")) {
      // Filter out the course with the matching ID
      setStudentCourses(studentCourses.filter(course => course.id !== courseId));
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">My Enrolled Courses</h1>
      
      {studentCourses.length === 0 ? (
        <div className="bg-gray-100 p-8 rounded-lg text-center">
          <p className="text-gray-700 text-lg mb-4">You are not enrolled in any courses.</p>
          <Link
            to="/browse-courses"
            className="bg-pink-500 text-white py-2 px-6 rounded-md font-medium hover:bg-pink-600 transition duration-300"
          >
            Browse Available Courses
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {studentCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition duration-300"
            >
              {/* Course Title and Icon */}
              <div className="flex items-center gap-3 mb-4">
                <FaBookOpen className="text-pink-500 text-3xl" />
                <h2 className="text-2xl font-semibold text-gray-900">{course.name}</h2>
              </div>
              
              {/* Course Code */}
              <p className="text-gray-600 text-sm font-medium mb-3">
                Course Code: <span className="text-gray-800">{course.id}</span>
              </p>
              
              <div className="flex flex-col space-y-2 mb-4">
                {/* Assignment Count */}
                <div className="flex items-center gap-2 text-gray-700">
                  <FaClipboardList className="text-xl text-pink-400" />
                  <span className="font-medium">{course.assignments.length} Assignments</span>
                </div>
                
                {/* Announcement Count */}
                <div className="flex items-center gap-2 text-gray-700">
                  <FaBullhorn className="text-xl text-pink-400" />
                  <span className="font-medium">{course.announcements} Announcements</span>
                </div>
              </div>
              
              <div className="flex flex-col space-y-3">
                {/* Button to View Announcements */}
                <Link
                  to={`/course/${course.id}/announcements`}
                  className="block text-center bg-pink-500 text-white py-2 px-4 rounded-md font-medium hover:bg-pink-600 transition duration-300"
                >
                  View Announcements
                </Link>
                
                {/* Drop Course Button */}
                <button
                  onClick={() => handleDropCourse(course.id)}
                  className="flex items-center justify-center gap-2 text-center bg-white text-red-500 border border-red-500 py-2 px-4 rounded-md font-medium hover:bg-red-50 transition duration-300"
                >
                  <FaTrash className="text-sm" />
                  Drop Course
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}