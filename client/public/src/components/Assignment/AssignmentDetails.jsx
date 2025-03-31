import { useParams } from "react-router-dom";
import { courses } from "./data";
import { useState } from "react";
import { FaFileUpload, FaCheckCircle, FaUndo } from "react-icons/fa";

export default function AssignmentDetail() {
  const { courseId, assignmentId } = useParams();
  const course = courses.find((c) => c.id === courseId);
  const assignment = course?.assignments.find((a) => a.id === assignmentId);

  const [file, setFile] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const dueDate = new Date(assignment?.due_date);
  const today = new Date();
  const isBeforeDeadline = today <= dueDate;

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = () => {
    if (!file) return alert("Please attach a file before submitting.");
    setSubmitted(true);
    alert("Assignment submitted successfully!");
  };

  const handleUndo = () => {
    setSubmitted(false);
    setFile(null);
    alert("Submission undone.");
  };

  if (!assignment) {
    return <p className="text-red-500 text-center p-6">Assignment not found.</p>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-md border border-gray-200">
      {/* Assignment Title */}
      <h2 className="text-3xl font-bold text-gray-900 mb-4">{assignment.title}</h2>

      {/* Description */}
      <p className="text-gray-700 leading-relaxed mb-4">{assignment.description}</p>

      {/* Due Date */}
      <p className="text-gray-600 text-sm mb-6">
        <strong>Due Date:</strong> {assignment.due_date} (EOD)
      </p>

      {/* File Upload & Submission Actions */}
      {isBeforeDeadline ? (
        <div className="space-y-4">
          {/* File Upload */}
          <label className="block text-gray-700 font-medium">
            Attach File:
            <input 
              type="file" 
              onChange={handleFileChange} 
              className="block w-full mt-2 border border-gray-300 rounded-md p-2"
              disabled={submitted}
            />
          </label>

          {/* Submit & Undo Buttons */}
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
        <p className="text-red-500 font-medium">⏳ Submission deadline has passed.</p>
      )}
    </div>
  );
}
