import React from "react";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { assignments } from "./data";

export default function CreateAssignment() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !description || !dueDate) {
      alert("Please fill in all fields.");
      return;
    }

    const newAssignment = {
      id: Date.now().toString(), // temporary unique ID
      course_id: courseId,
      title,
      description,
      due_date: dueDate,
    };

    assignments.push(newAssignment);

    alert("Assignment created successfully!");
    navigate(`/course/${courseId}/assignment`);
  }

    return (
    <div className="max-w-xl mx-auto bg-white p-6 mt-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Create Assignment</h2>

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
          className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition"
        >
          Create Assignment
        </button>
      </form>
    </div>
  );
}
