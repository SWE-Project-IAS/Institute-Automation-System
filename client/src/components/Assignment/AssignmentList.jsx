import { useParams, Link, useNavigate, replace } from "react-router-dom";
import axios from 'axios';
import { useContext, useEffect, useState } from "react";
import { FaClipboardList, FaCalendarAlt, FaEdit, FaTrash, FaPlus, FaEye } from "react-icons/fa";
import { RoleContext } from "../../context/Rolecontext";

export default function AssignmentList() {
  const { courseId } = useParams();
  const { role } = useContext(RoleContext);
  const navigate = useNavigate();

  const [assignments, setAssignments] = useState([]);
  const [course, setCourse] = useState(null);

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const userId = currentUser?.data?.user?.userId;

  // Fetch all assignments for the course
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await fetch(`process.env.REACT_APP_API_URL/assignment/course/${courseId}/assignments`);
        const data = await res.json();

        if (res.ok) {
          setAssignments(data.assignments || []);
          // console.log("Assignments:", data.assignments);
        } else {
          alert("Failed to fetch assignments.");
        }
      } catch (err) {
        console.error("Error fetching assignments:", err);
        alert("Error fetching assignments.");
      }
    };

    fetchAssignments();
   
  }, [courseId]);
  console.log("Assignments:",assignments);
  // Fetch course details
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`process.env.REACT_APP_API_URL/assignment/course/${courseId}`);
        const data = await res.json();
        if (res.ok) {
          setCourse(data.data);
        } else {
          setCourse(null);
        }
      } catch (err) {
        console.error("Error fetching course:", err);
      }
    };

    fetchCourse();
  }, [courseId]);

  // Delete assignment
  const handleDelete = async (assignmentId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this assignment?");
    if (!confirmDelete) return;
  
    try {
      console.log("Deleting assignment...", { courseId, assignmentId });
  
      const res = await fetch(`process.env.REACT_APP_API_URL/assignment/${courseId}/${assignmentId}`, {
        method: "DELETE",
      });
  
      console.log("Response from server:", res);
  
      const data = await res.json();
  
      if (res.ok) {
        alert("Assignment deleted successfully!");
        window.location.href = `/course/${courseId}/assignments`;
        // navigate(`/course/${courseId}/assignments`,{replace:true});
      } else {
        alert(data.message || "Failed to delete assignment.");
      }
    } catch (err) {
      console.error("Error deleting assignment:", err);
      alert("Server error. Please try again.");
    }
  };
  

  const handleViewAssignment = (assignmentId) => {
    if (role === "faculty") {
      navigate(`/course/${courseId}/assignment/${assignmentId}/submissions`);
    } else {
      navigate(`/course/${courseId}/assignment/${assignmentId}`);
    }
  };

  if (!course) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold text-red-500">❌ Course Not Found</h2>
        <Link
          to="/assignmentlanding"
          className="mt-4 inline-block bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
        >
          🔙 Back to Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">{course.courseName} - Assignments</h2>

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
        {assignments.length > 0 ? (
          assignments.map((assignment) => (
            <div
              key={assignment._id}
              className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition duration-300"
            >
              <div className="flex items-center gap-3 mb-2">
                <FaClipboardList className="text-blue-500 text-2xl" />
                <h3 className="text-xl font-semibold text-gray-900">{assignment.title}</h3>
              </div>

              <p className="text-gray-700 mb-2">
                <strong>Description:</strong>{" "}
                {assignment.description?.length > 100
                  ? assignment.description.substring(0, 100) + "..."
                  : assignment.description}
              </p>

              <p className="text-gray-700 mb-2">
                <strong>Due Date:</strong> 📅{" "}
                {assignment.dueDate ? new Date(assignment.dueDate).toLocaleString() : "N/A"}
              </p>

              <p className="text-gray-700 mb-4">
                <strong>Submissions:</strong>{" "}
                {Array.isArray(assignment.submissions) ? assignment.submissions.length : 0}
              </p>

              <button
                onClick={() => handleViewAssignment(assignment.assignmentNumber)}
                className="w-full text-center bg-blue-500 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-600 transition duration-300"
              >
                <FaEye className="inline-block mr-2" /> View Assignment
              </button>

              {role === "faculty" && (
                <div className="flex gap-4 mt-3">
                  <Link
                    to={`/course/${courseId}/assignment/${assignment.assignmentNumber}/edit`}
                    className="flex-1 text-center bg-yellow-500 text-white py-2 px-4 rounded-md font-medium hover:bg-yellow-600 transition duration-300"
                  >
                    <FaEdit className="inline-block mr-2" /> Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(assignment.assignmentNumber)}
                    className="flex-1 text-center bg-red-500 text-white py-2 px-4 rounded-md font-medium hover:bg-red-600 transition duration-300"
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
