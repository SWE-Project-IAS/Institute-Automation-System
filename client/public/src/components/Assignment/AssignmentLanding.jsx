import { Link } from "react-router-dom";
import { courses } from "./data";
import { FaBookOpen, FaClipboardList } from "react-icons/fa";

export default function AssignmentLanding() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">My Courses</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
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
            <p className="text-gray-600 text-sm font-medium mb-3">Course Code: <span className="text-gray-800">{course.id}</span></p>
            
            {/* Assignment Count */}
            <div className="flex items-center gap-2 text-gray-700 mb-4">
              <FaClipboardList className="text-xl text-pink-400" />
              <span className="font-medium">{course.assignments.length} Assignments</span>
            </div>

            {/* Button to View Assignments */}
            <Link 
              to={`/course/${course.id}/assignment`}
              className="block text-center bg-pink-500 text-white py-2 px-4 rounded-md font-medium hover:bg-pink-600 transition duration-300"
            >
              View Assignments
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
