import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditAssignment() {
  const { courseId, assignmentId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");



  const handleSubmit = async (e) => {
    console.log("Submitting form...", { title, description, dueDate });
    e.preventDefault();

    if (!title || !description || !dueDate) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const res = await fetch(`https://ias-server-cpoh.onrender.com/api/assignment/${courseId}/${assignmentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description, dueDate }),
      });
      console.log("Response from server:", res);
      
      const data = await res.json();

      if (res.ok) {
        alert("Assignment updated successfully!");
        navigate(`/course/${courseId}/assignments`);
      } else {
        alert(data.message || "Failed to update assignment.");
      }
    } catch (err) {
      console.error("Error updating assignment:", err);
      alert("Server error. Please try again.");
    }
  };
  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const res = await fetch(`https://ias-server-cpoh.onrender.com/api/assignment/${courseId}/${assignmentId}`);
        const data = await res.json();
  
        if (res.ok) {
          const { title, description, dueDate } = data.assignment;
          setTitle(title);
          setDescription(description);
          setDueDate(dueDate.slice(0, 10)); // format for <input type="date" />
        } else {
          alert(data.message || "Failed to load assignment.");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        alert("Something went wrong fetching assignment.");
      }
    };
  
    fetchAssignment();
  }, [courseId, assignmentId]);
  
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
