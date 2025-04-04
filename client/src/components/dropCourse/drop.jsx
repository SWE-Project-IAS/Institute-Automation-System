import { useState } from "react";
import { FaTrash } from "react-icons/fa";

export default function DropCourse() {
  // Example student object with current courses
  // In a real application, this would likely come from props or a context
  const [studentCourses, setStudentCourses] = useState([
    {
      id: "CS101",
      name: "Introduction to Computer Science"
    },
    {
      id: "MATH202",
      name: "Calculus II"
    },
    {
      id: "ENG105",
      name: "Academic Writing"
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
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Drop Courses</h1>
      
      {studentCourses.length === 0 ? (
        <div className="bg-gray-100 p-4 rounded-lg text-center">
          <p className="text-gray-700">You are not enrolled in any courses.</p>
        </div>
      ) : (
        <div className="flex flex-col space-y-2">
          {studentCourses.map((course) => (
            <div
              key={course.id}
              className="flex items-center justify-between bg-white p-4 rounded-lg shadow border border-gray-200"
            >
              {/* Course Code and Name */}
              <div className="flex items-center space-x-4">
                <span className="font-bold text-pink-500">{course.id}</span>
                <span className="text-gray-800">{course.name}</span>
              </div>
              
              {/* Drop Course Button */}
              <button
                onClick={() => handleDropCourse(course.id)}
                className="flex items-center justify-center gap-2 bg-white text-red-500 border border-red-500 py-1 px-3 rounded-md font-medium hover:bg-red-50 transition duration-300"
              >
                <FaTrash className="text-sm" />
                Drop
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}