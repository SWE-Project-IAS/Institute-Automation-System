import { useParams, Link } from "react-router-dom";
import { courses } from "./data";
import { FaClipboardList, FaCalendarAlt } from "react-icons/fa";

export default function AssignmentList() {
  const { courseId } = useParams();
  const course = courses.find((c) => c.id === courseId);

  if (!course) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold text-red-500">Course Not Found</h2>
        <p className="text-gray-600">The course you're looking for does not exist.</p>
        <Link 
          to="/assigngmentlanding" 
          className="mt-4 inline-block bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Back to Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">{course.name} - Assignments</h2>

      <div className="space-y-4">
        {course.assignments.map((assignment) => (
          <Link
            key={assignment.id}
            to={`/course/${courseId}/assignment/${assignment.id}`}
            className="block bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition duration-300"
          >
            {/* Assignment Title with Icon */}
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
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <FaCalendarAlt className="text-gray-500" />
              <span>Due: {assignment.due_date}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
