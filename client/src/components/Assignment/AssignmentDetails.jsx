import { useParams } from "react-router-dom";
import { courses, assignments } from "./data";
import { useState } from "react";
import { FaCheckCircle, FaUndo, FaFileUpload } from "react-icons/fa";

export default function AssignmentDetail() {
  const { assignmentId } = useParams();

  // Find assignment details
  const assignment = assignments.find((a) => a.id === assignmentId);
  const course = courses.find((c) => c.id === assignment?.course_id);

  const [file, setFile] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [submissionTime, setSubmissionTime] = useState(null);

  const dueDate = new Date(assignment?.due_date);
  const today = new Date();
  const isBeforeDeadline = today <= dueDate;

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = () => {
    if (!file) return alert("📂 Please attach a file before submitting.");
    
    setSubmitted(true);
    setSubmissionTime(new Date().toLocaleString());
    alert("✅ Assignment submitted successfully!");
  };

  const handleUndo = () => {
    setSubmitted(false);
    setFile(null);
    setSubmissionTime(null);
    alert("🔄 Submission undone.");
  };

  if (!assignment) {
    return (
      <p className="text-red-500 text-center p-6 font-semibold">
        ❌ Assignment not found.
      </p>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-md border border-gray-300">
      {/* Assignment Title */}
      <h2 className="text-3xl font-bold text-gray-900 mb-2">{assignment.title}</h2>

      {/* Course Name */}
      {course && (
        <p className="text-gray-600 text-sm mb-4">
          <strong>📚 Course:</strong> {course.name} ({course.id})
        </p>
      )}

      {/* Description */}
      <p className="text-gray-700 leading-relaxed mb-4">{assignment.description}</p>

      {/* Due Date */}
      <p className="text-gray-600 text-sm mb-6">
        <strong>📅 Due Date:</strong> {assignment.due_date} (End of Day)
      </p>

      {/* Submission Status */}
      {submitted && (
        <div className="p-4 mb-4 bg-green-100 border border-green-300 rounded-md">
          <p className="text-green-700 font-semibold">✅ Assignment Submitted Successfully!</p>
          <p className="text-gray-600 text-sm">📌 Submitted on: {submissionTime}</p>
          {file && (
            <p className="text-gray-600 text-sm">
              📄 File: <span className="font-medium">{file.name}</span>
            </p>
          )}
        </div>
      )}

      {/* File Upload & Submission */}
      {isBeforeDeadline ? (
        <div className="space-y-4">
          <label className="block text-gray-700 font-medium">
            <FaFileUpload className="inline-block mr-2" />
            Attach File:
            <input
              type="file"
              onChange={handleFileChange}
              className="block w-full mt-2 border border-gray-300 rounded-md p-2"
              disabled={submitted}
            />
          </label>

          <div className="flex gap-4">
            {!submitted ? (
              <button
                onClick={handleSubmit}
                className="flex items-center bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300"
              >
                <FaCheckCircle className="mr-2" /> Hand In Assignment
              </button>
            ) : (
              <button
                onClick={handleUndo}
                className="flex items-center bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300"
              >
                <FaUndo className="mr-2" /> Undo Submission
              </button>
            )}
          </div>
        </div>
      ) : (
        <p className="text-red-500 font-medium">
          ⏳ Submission deadline has passed.
        </p>
      )}
    </div>
  );
}
