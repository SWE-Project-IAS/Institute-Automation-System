import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { assignments } from "./data";

export default function EditAssignment() {
  const { courseId, assignmentId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    const assignment = assignments.find(
      (a) => a.id === assignmentId && a.course_id === courseId
    );

    if (assignment) {
      setTitle(assignment.title);
      setDescription(assignment.description);
      setDueDate(assignment.due_date);
    } else {
      alert("Assignment not found.");
      navigate(`/course/${courseId}/assignment`);
    }
  }, [assignmentId, courseId, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !description || !dueDate) {
      alert("Please fill in all fields.");
      return;
    }

    const assignmentIndex = assignments.findIndex(
      (a) => a.id === assignmentId && a.course_id === courseId
    );

    if (assignmentIndex !== -1) {
      assignments[assignmentIndex] = {
        ...assignments[assignmentIndex],
        title,
        description,
        due_date: dueDate,
      };

      alert("Assignment updated successfully!");
      navigate(`/course/${courseId}/assignment`);
    } else {
      alert("Error: Assignment not found.");
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 mt-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Assignment</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium text-gray-700">Title</label>
          <input
            type="text"
            className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700">Description</label>
          <textarea
            rows="4"
            className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        <div>
          <label className="block font-medium text-gray-700">Due Date</label>
          <input
            type="date"
            className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
        >
          Update Assignment
        </button>
      </form>
    </div>
  );
}
