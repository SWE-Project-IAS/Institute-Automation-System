import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const CourseRegistrationFaculty = () => {
  const { courseCode } = useParams();
  const [students, setStudents] = useState([]);
  const [filters, setFilters] = useState({ rollNo: "", name: "", program: "", semester: "" });
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  console.log(courseCode);
  const fetchStudents = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/facultyCourse/course-registrations/${courseCode}`);
      if (response.data.success) {
        setStudents(response.data.students);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      console.log("Full error:", error.response);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [courseCode]);

  const filteredStudents = students.filter((student) =>
    Object.entries(filters).every(([key, value]) =>
      (student[key] || "").toString().toLowerCase().includes(value.toLowerCase())
    )
  );

  const handleSelectStudent = (rollNo) => {
    setSelectedStudents((prev) =>
      prev.includes(rollNo) ? prev.filter((id) => id !== rollNo) : [...prev, rollNo]
    );
  };

  const handleApprove = async () => {
    try {
      const response = await axios.post("http://localhost:8000/api/facultyCourse/approve-registrations", {
        courseCode,
        students: selectedStudents,
      });
  
      if (response.data.success) {
        alert(`Approved ${selectedStudents.length} students!`);
        setSelectedStudents([]);
        fetchStudents(); // Refresh the list
      } else {
        alert("Some error occurred while approving.");
      }
    } catch (error) {
      console.error("Error approving students:", error);
      alert("An error occurred.");
    }
  };

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-4">Students Registered for {courseCode}</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        {["rollNo", "name", "program", "semester"].map((key) => (
          <input
            key={key}
            type="text"
            placeholder={`Filter by ${key}`}
            className="border p-2 rounded-md"
            value={filters[key]}
            onChange={(e) => setFilters({ ...filters, [key]: e.target.value })}
          />
        ))}
      </div>

      {loading ? (
        <p>Loading students...</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">
                <input
                  type="checkbox"
                  onChange={(e) =>
                    setSelectedStudents(e.target.checked ? students.map((s) => s.rollNo) : [])
                  }
                  checked={selectedStudents.length === students.length}
                />
              </th>
              <th className="border p-2">Roll No</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Program</th>
              <th className="border p-2">Semester</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student.rollNo} className="hover:bg-gray-100">
                <td className="border p-2 text-center">
                  <input
                    type="checkbox"
                    checked={selectedStudents.includes(student.rollNo)}
                    onChange={() => handleSelectStudent(student.rollNo)}
                  />
                </td>
                <td className="border p-2">{student.rollNo}</td>
                <td className="border p-2">{student.name}</td>
                <td className="border p-2">{student.program}</td>
                <td className="border p-2">{student.semester}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button
        onClick={handleApprove}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        disabled={selectedStudents.length === 0}
      >
        Approve Selected
      </button>
    </div>
  );
};

export default CourseRegistrationFaculty;
