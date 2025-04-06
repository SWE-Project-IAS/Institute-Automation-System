import { useParams, Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { FaClipboardList, FaCalendarAlt, FaEdit, FaTrash, FaPlus, FaEye } from "react-icons/fa";
import { RoleContext } from "../../context/Rolecontext";
import { courses, assignments as initialAssignments } from "./data";

export default function AssignmentList() {
  const { courseId } = useParams();
  const { role } = useContext(RoleContext);
  const navigate = useNavigate();

  // State to manage assignments dynamically
  const [courseAssignments, setCourseAssignments] = useState(
    initialAssignments.filter((a) => a.course_id === courseId)
  );

  const course = courses.find((c) => c.id === courseId);

  if (!course) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold text-red-500">❌ Course Not Found</h2>
        <p className="text-gray-600">The course you're looking for does not exist.</p>
        <Link
          to="/assignmentlanding"
          className="mt-4 inline-block bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
        >
          🔙 Back to Courses
        </Link>
      </div>
    );
  }

  // Function to handle deletion
  const handleDelete = (assignmentId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this assignment?");
    if (confirmDelete) {
      setCourseAssignments(courseAssignments.filter((a) => a.id !== assignmentId));
    }
  };

  // Function to handle "View Assignment" logic based on role
  const handleViewAssignment = (assignmentId) => {
    if (role === "faculty") {
      navigate(`/course/${courseId}/assignment/${assignmentId}/submissions`); // Faculty sees submissions
    } else {
      navigate(`/course/${courseId}/assignment/${assignmentId}`); // Students see details
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">{course.name} - Assignments</h2>

      {/* Faculty-Specific Create Button */}
      {role === "faculty" && (
        <div className="mb-6">
          <Link
            to={`/course/${courseId}/create-assignment`}
            className="inline-block bg-green-500 text-white py-2 px-4 rounded-md font-medium hover:bg-green-600 transition duration-300"
          >
            <FaPlus className="inline-block mr-2" /> Create Assignment
          </Link>
        </div>
      )}

      <div className="space-y-4">
        {courseAssignments.length > 0 ? (
          courseAssignments.map((assignment) => (
            <div
              key={assignment.id}
              className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition duration-300"
            >
              {/* Assignment Title */}
              <div className="flex items-center gap-3 mb-2">
                <FaClipboardList className="text-blue-500 text-2xl" />
                <h3 className="text-xl font-semibold text-gray-900">{assignment.title}</h3>
              </div>

              {/* Assignment Description */}
              <p className="text-gray-700 mb-3">
                {assignment.description.length > 100
                  ? assignment.description.substring(0, 100) + "..."
                  : assignment.description}
              </p>

              {/* Due Date */}
              <div className="flex items-center gap-2 text-gray-600 text-sm mb-4">
                <FaCalendarAlt className="text-gray-500" />
                <span>📅 Due: {assignment.due_date}</span>
              </div>

              {/* View Assignment Button for Everyone */}
              <button
                onClick={() => handleViewAssignment(assignment.id)}
                className="w-full text-center bg-blue-500 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-600 transition duration-300"
              >
                <FaEye className="inline-block mr-2" /> View Assignment
              </button>

              {/* Faculty-Specific Actions */}
              {role === "faculty" && (
                <div className="flex gap-4 mt-3">
                  <Link
                    to={`/course/${courseId}/assignment/${assignment.id}/edit`}
                    className="flex-1 text-center bg-yellow-500 text-white py-2 px-4 rounded-md font-medium hover:bg-yellow-600 transition duration-300"
                  >
                    <FaEdit className="inline-block mr-2" /> Edit
                  </Link>
                  <button
                    className="flex-1 text-center bg-red-500 text-white py-2 px-4 rounded-md font-medium hover:bg-red-600 transition duration-300"
                    onClick={() => handleDelete(assignment.id)}
                  >
                    <FaTrash className="inline-block mr-2" /> Delete
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-600 text-center">📭 No assignments available for this course.</p>
        )}
      </div>
    </div>
  );
}
