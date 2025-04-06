import React, { useState } from "react";
import { RoleContext } from "../../../context/Rolecontext";
import { useContext } from "react";

const DocumentAccessControl = () => {
  const { role, setRole } = useContext(RoleContext);
  setRole("acadAdmin");
  const [filters, setFilters] = useState({
    branch: "",
    degree: "",
    semester: "",
    search: "",
  });

  // Enhanced mock data
  const [students, setStudents] = useState([
    {
      id: 1,
      name: "John Doe",
      rollNo: "B20CS001",
      branch: "CSE",
      degree: "BTech",
      semester: 6,
      access: { transcript: true, idCard: true, feeReceipt: true },
    },
    {
      id: 2,
      name: "Jane Smith",
      rollNo: "B20EC002",
      branch: "ECE",
      degree: "BTech",
      semester: 6,
      access: { transcript: true, idCard: false, feeReceipt: true },
    },
    {
      id: 3,
      name: "Mike Johnson",
      rollNo: "M21CS001",
      branch: "CSE",
      degree: "MTech",
      semester: 2,
      access: { transcript: false, idCard: true, feeReceipt: true },
    },
    {
      id: 4,
      name: "Sarah Williams",
      rollNo: "B19ME001",
      branch: "ME",
      degree: "BTech",
      semester: 8,
      access: { transcript: true, idCard: true, feeReceipt: false },
    },
    {
      id: 5,
      name: "Alex Brown",
      rollNo: "B21EE001",
      branch: "EE",
      degree: "BTech",
      semester: 4,
      access: { transcript: false, idCard: false, feeReceipt: true },
    },
  ]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleToggleAccess = (studentId, documentType) => {
    setStudents(
      students.map((student) => {
        if (student.id === studentId) {
          return {
            ...student,
            access: {
              ...student.access,
              [documentType]: !student.access[documentType],
            },
          };
        }
        return student;
      })
    );
  };

  const filteredStudents = students.filter((student) => {
    const searchMatch =
      student.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      student.rollNo.toLowerCase().includes(filters.search.toLowerCase());

    const branchMatch =
      filters.branch === "" || student.branch === filters.branch;
    const degreeMatch =
      filters.degree === "" || student.degree === filters.degree;
    const semesterMatch =
      filters.semester === "" ||
      student.semester.toString() === filters.semester;

    return searchMatch && branchMatch && degreeMatch && semesterMatch;
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Document Access Control</h1>

      {/* Filters Section */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name or roll number"
          name="search"
          className="border p-2 rounded"
          onChange={handleFilterChange}
        />
        <select
          name="branch"
          className="border p-2 rounded"
          onChange={handleFilterChange}
        >
          <option value="">Select Branch</option>
          <option value="CSE">CSE</option>
          <option value="ECE">ECE</option>
          <option value="ME">ME</option>
          <option value="EE">EE</option>
        </select>
        <select
          name="degree"
          className="border p-2 rounded"
          onChange={handleFilterChange}
        >
          <option value="">Select Degree</option>
          <option value="BTech">BTech</option>
          <option value="MTech">MTech</option>
        </select>
        <select
          name="semester"
          className="border p-2 rounded"
          onChange={handleFilterChange}
        >
          <option value="">Select Semester</option>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
            <option key={sem} value={sem}>
              Semester {sem}
            </option>
          ))}
        </select>
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Apply Filters
        </button>
      </div>

      {/* Students Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Roll No</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Branch</th>
              <th className="border p-2">Degree</th>
              <th className="border p-2">Semester</th>
              <th className="border p-2">Transcript</th>
              <th className="border p-2">ID Card</th>
              <th className="border p-2">Fee Receipt</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length === 0 ? (
              <tr>
                <td
                  colSpan="8"
                  className="border p-4 text-center text-gray-500"
                >
                  No records found
                </td>
              </tr>
            ) : (
              filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td className="border p-2">{student.rollNo}</td>
                  <td className="border p-2">{student.name}</td>
                  <td className="border p-2">{student.branch}</td>
                  <td className="border p-2">{student.degree}</td>
                  <td className="border p-2">{student.semester}</td>
                  <td className="border p-2">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="form-checkbox h-5 w-5 text-blue-600"
                        checked={student.access.transcript}
                        onChange={() =>
                          handleToggleAccess(student.id, "transcript")
                        }
                      />
                    </label>
                  </td>
                  <td className="border p-2">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="form-checkbox h-5 w-5 text-blue-600"
                        checked={student.access.idCard}
                        onChange={() =>
                          handleToggleAccess(student.id, "idCard")
                        }
                      />
                    </label>
                  </td>
                  <td className="border p-2">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="form-checkbox h-5 w-5 text-blue-600"
                        checked={student.access.feeReceipt}
                        onChange={() =>
                          handleToggleAccess(student.id, "feeReceipt")
                        }
                      />
                    </label>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DocumentAccessControl;
