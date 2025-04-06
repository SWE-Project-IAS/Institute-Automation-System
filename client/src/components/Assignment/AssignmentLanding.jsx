import { Link } from "react-router-dom";
import { useContext } from "react";
import { courses, assignments } from "./data"; // new separate schema
import { FaBookOpen, FaClipboardList, FaPlus } from "react-icons/fa";
import { RoleContext } from "../../context/Rolecontext";

export default function AssignmentLanding() {
  const { role } = useContext(RoleContext);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        {role === "faculty" ? "My Faculty Courses" : "My Courses"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => {
          const courseAssignments = assignments.filter(a => a.course_id === course.id);

          return (
            <div 
              key={course.id} 
              className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition duration-300"
            >
              {/* Course Title and Icon */}
              <div className="flex items-center gap-3 mb-4">
                <FaBookOpen className="text-blue-500 text-3xl" />
                <h2 className="text-2xl font-semibold text-gray-900">{course.name}</h2>
              </div>

              {/* Course Code */}
              <p className="text-gray-600 text-sm font-medium mb-3">
                Course Code: <span className="text-gray-800">{course.id}</span>
              </p>
              
              {/* Assignment Count */}
              <div className="flex items-center gap-2 text-gray-700 mb-4">
                <FaClipboardList className="text-xl text-blue-400" />
                <span className="font-medium">{courseAssignments.length} Assignments</span>
              </div>

              {/* Role-specific Options */}
              {role === "faculty" ? (
                <div className="space-y-3">
                  {/* Create Assignment */}
                  <Link 
                    to={`/course/${course.id}/create-assignment`}
                    className="block text-center bg-green-500 text-white py-2 px-4 rounded-md font-medium hover:bg-green-600 transition duration-300"
                  >
                    <FaPlus className="inline-block mr-2" /> Create Assignment
                  </Link>

                  {/* View Assignments */}
                  <Link 
                    to={`/course/${course.id}/assignment`}
                    className="block text-center bg-blue-500 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-600 transition duration-300"
                  >
                    View Assignments
                  </Link>
                </div>
              ) : (
                <Link 
                  to={`/course/${course.id}/assignment`}
                  className="block text-center bg-blue-500 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-600 transition duration-300"
                >
                  View Assignments
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
